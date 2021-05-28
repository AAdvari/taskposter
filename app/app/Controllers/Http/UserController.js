'use strict'
const User = use('App/Models/User')
const Mail = use('Mail');
const Helpers = use('Helpers')

const Mailer = use('App/Jobs/UserResetPassEmail')
const Bull = use('Rocketseat/Bull')

class UserController {
    async create( { request , auth , response }) { 

        // here we are sure that the data is valid. 
        const user = await User.create( request.only(['username', 'email' , 'password'])); 

        // login the created user / generate and send a token 
        const token = await auth.generate(user);
    
        return response.send(token);
    }

    async login( { request, auth , response}){
        const {email , password} = request.all();

        try{
            const token = await auth.attempt(email, password);
            return response.send(token)
        }
        catch{
            return response.status(401).send('Authentication Failed')
        }
    }

    async delete({params,response}){
        const id =  parseInt(params.id);
        const user = await User.find(id)
        if(!user)
            return response.status(404).send('User Not Found ...')

        await user.delete();
        return response.send('User Deleted Succesfully');
    }

    async update( { auth  , request , response }){

        try {
        
            const user = await auth.getUser();
            const {username , email} = request.all(); 
            user.username = username;
            user.email = email; 

            await user.save();
            return response.send(
                {
                    username:user.username,
                    email:user.email
                });
        }
        catch {
            return response.status(401).send('Authentication Failed')
        }
    }

    async show({ request , response }){

        let users; 

        const query = request.get();
        const id = query.id
        const page = query.page 
        const page_size = query.page_size


        if (id){
             const user = await User.find(id);

             if(!user)
                return response.status(404).send('User Not Found ...')

             return response.send({ email:user.email , username:user.username })
        }
        else{
            users = User.query() 
                        .select('username','email')                                         
        }

        if(!users)
             return response.status(404).send('User Not Found ...')

        if( page && page_size)
            return await users.paginate(page,page_size);
            
        return response.send( await users.fetch() );
    }


    async forget({request , auth ,response }){
        const {email} = request.all();

        // find the corresponding user
        const user = await User.findBy({email : email});
        if(!user)
            return response.status(404).send('The user with the given email has not registered yet')

        const token =  (await auth.generate(user)).token;
        const link = 'http://localhost/resetPass/' + token ; 

        Bull.add(Mailer.key, {email:email,link:link})
    }

    async resetPass({request , auth , params ,response }){
        try {
            const token = params.token;
            request.request.headers.authorization = `Bearer ${token}`;
            
            const user = auth.getUser();
            const {password} = request.all();
            user.password = password;

            user.save();
            return response.send('Password Changed Successfully');
            
        } catch{
            return response.status(401).send('Authentication Failed ')
        }
    }

    async getFile({request , auth, response }){

        let user;
        try{
            user = await auth.getUser();

        }
        catch(error){
            return response.status(401).send('Authentication Failed ')
        }
            
            // the name (here : uploadedFile ) should be provided in form-data (key-value) pairs 
            const receivedFile = await request.file('uploadFile' , {
                "types":['image' , 'text'],
                "size" : '10mb'
            });

            await receivedFile.move(Helpers.tmpPath(`uploads/${user.id}`) , {
                name:`data_${user.id}_${receivedFile.clientName}`
            });

            if(!receivedFile.moved()){
                return receivedFile.error();
            }
            return response.send('File Saved')
 
    }

    async profPic({request , auth , response }){

        let user;
        try{
            user = await auth.getUser();

        }
        catch(error){
            return response.status(401).send('Authentication Failed ')
        }
        
            // the name (here : uploadedFile ) should be provided in form-data (key-value) pairs 
            const receivedFile = await request.file('pf' , {
                "types":['image'],
                "size" : '10mb'
            });

            await receivedFile.move(Helpers.tmpPath(`uploads/${user.id}`) , {
                name:`pf_${user.id}.${receivedFile.extname}`
            });

            if(!receivedFile.moved()){
                return response.status(500).send(receivedFile.error());
            }
            return response.send('Profile Pic Saved')
    }

    // we have assumed that pic is saved in .jpg format (it is simply possible to support more ext's)
    async sendPf({response,params}){
        
        const id = params.id; 
        if(!(await User.find(id)))
            return response.status(404).send('Profile Pic Not Found for the user');
        response.header('Content-Type', 'image/jpg');
        return response.attachment(Helpers.tmpPath(`uploads/${id}/pf_${id}.jpg`));
    }

}

module.exports = UserController
