'use strict'

const { route, RouteResource } = require('@adonisjs/framework/src/Route/Manager');

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


/* USERS */ 
  // Authentication is handled in Controller
  Route.group( () => {

    Route.post('/login' , 'UserController.login').validator('LoginUser')
    Route.post('/signup','UserController.create').validator('CreateUser')
    Route.put('/:id', 'UserController.update').validator('UpdateUser')
    Route.get('/profile-pic/:id','UserController.sendPf')

    // Just For testing 
    // delete the user with the given id 
    Route.delete('/delete/:id', 'UserController.delete')

    
    Route.post('/forget', 'UserController.forget');
    
    // Just for Testing Purposes
    // if id is passed, show the specified user, else , show all users ...  
    Route.get('/' , 'UserController.show')

  }).prefix('users')




 /* UPLOAD */ 
  // Authentication is Done in Controller : Better Approach : Use Middleware.
  Route.post('/upload', 'UserController.getFile')
  Route.post('/upload/profile-pic', 'UserController.profPic')
  Route.post('/resetPass/:token', 'UserController.resetPass')

 

/* Task Handlers */ 
    // Just return back all tasks ( Testing Purposes )
    Route.get('/', 'TaskController.home');
    Route.group( () => { 
      Route.delete('/delete/:id' , 'TaskController.delete'); 
      Route.get('/' , 'TaskController.userIndex')
      Route.get('/task-pic/:id' ,'TaskController.sendTf');
      Route.post('/' , 'TaskController.create').validator('CreateTask')
      Route.put('/update/:id' , 'TaskController.update').validator('CreateTask');
      Route.post('/upload-pic/:id' , 'TaskController.setPic');
    }).prefix('/tasks').middleware('auth')
    
