'use strict'

class LoginUser {
  get rules () {
    return {
      'email' : 'required|email',
      'password' : 'required'
    }
  }

  get messages(){
    return {
      'required':'{{field}} is required',

    }
  }

  async fails(error){
    // ctx is short for context 
    let errors =[]
    error.forEach( (err) => errors.push(err.message) );
    this.ctx.response.status(400).send(errors)
  }
}

module.exports = LoginUser
