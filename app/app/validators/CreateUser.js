'use strict'

class CreateUser {
  get rules () {
    return {
        'username' : 'required|unique:users',
        'email' : 'required|unique:users|email',
        'password' : 'required|unique:users'
    }
  }

  // Defining the messages in order to return the proper message while receiving validation fault
  get messages(){
    return {
      'required': '{{field}} is required',
      'unique': '{{field}} already exists',
    }
  }

// if the validation failed .... 
  async fails(error){
    // ctx is short for context 
    let errors =[]
    error.forEach( (err) => errors.push(err.message) );
    this.ctx.response.status(400).send(errors)
  }
}

module.exports = CreateUser
