'use strict'


// importing the model 
const Task = use('App/Models/task')
const Helpers = use('Helpers')
const Database = use('Database')


class TaskController {
    async home({request}) { 

        // fetch  tasks 
        const query = request.get()
        const search = query.search;
        const sort = query.sort || 'created_at'
        const sort_type = query.sort_type || 'desc'
        const page = query.page;
        const page_size = query.page_size


        let tasks = Task.query().select('*').orderBy(sort,sort_type);
        if(search)
            tasks =  tasks.where('title','like' , `%${search}%`)
                          .orWhere('description','like',`%${search}%`)
                          .orWhere('link','like',`%${search}%`) 

        if(page&&page_size)
            tasks = await tasks.paginate(page,page_size)
        else
            tasks = await tasks.fetch();
        
        return tasks.toJSON();
    }

    async userIndex( { auth,request,response }){


        const query = request.get()
        const search = query.search;
        const sort = query.sort || 'created_at'
        const sort_type = query.sort_type || 'desc'
        const page = query.page;
        const page_size = query.page_size
        
        
        let tasks;
        if(search){
            try{
                tasks =  auth.user.tasks()
                            .orderBy(sort,sort_type)
                            .where('title','like' , `%${search}%`)
                            .orWhere('description','like',`%${search}%`)
                            .orWhere('link','like',`%${search}%`)

            } catch {
                 return response.status(401).send('Authentication Failed')
            }
        }
        else 
            tasks = auth.user.tasks().orderBy(sort,sort_type)

        if(page && page_size)
            tasks = await tasks.paginate(page,page_size)
        else
            tasks = await tasks.fetch()

        return tasks.toJSON();
    }

    async create( { request , auth ,response}){
        const task = request.all();
    
         await auth.user.tasks().create({
            title:task.title,
            link:task.link,
            description: task.description,
            expire:task.expire
        })

        return response.send('Task Has been Posted ');
    }

    async delete({ params , response}){
        const task= await Task.find(params.id);
        
        if(!task)
            return response.status(404).send('Task not Found ! ')

        await task.delete();
        return response.send('Task has been deleted')
    }

    async update({ request, params , response}){
        const task = await Task.find(params.id);

        if(!task)
            return response.status(404).send('Task not Found ! ')
        const data = request.all();
        task.title = data.title || task.title;
        task.link = data.link || task.link;
        task.description = data.description || task.description;
        task.expire =  data.expire || task.expire;

        await task.save();

        return response.send('Task Updated')
    }

    async setPic({params,request,auth}){
            let user;
            try{
                user = await auth.getUser();
            }
            catch{
                return 'Authentication failed'; 
            }
            
                const id = params.id; 
                // user.tasks() returns a query ( modeling sql queries are possible )
                // output should be converted to JSON 
                let task = await user.tasks().where('id', id).first();

                if(!task)
                    return 'Not Exists'

                task = task.toJSON();
            
                // the name (here : uploadedFile ) should be provided in form-data (key-value) pairs 
                const receivedFile = await request.file('task-pic' , {
                    "types":['image'],
                    "size" : '2mb'
                });
    
                await receivedFile.move(Helpers.tmpPath(`uploads/${user.id}/tasks/${id}/picture`) , {
                    name:`tp_${id}.${receivedFile.extname}`
                });
    
                if(!receivedFile.moved()){
                    return receivedFile.error();
                }
                return 'Task Pic Saved'; 
    }

    async sendTf({response,params}){
        const id = params.id;
        let ownerId = await Database
                    .from('tasks')
                    .select('user_id')
                    .where('id',id)
                    .first();
        ownerId = ownerId.user_id;

        response.header('Content-Type', 'image/jpg');
        await response.attachment(Helpers.tmpPath(`uploads/${ownerId}/tasks/${id}/picture/tp_${id}.jpg`))
    }

}

module.exports = TaskController
