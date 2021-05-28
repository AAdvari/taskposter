'use strict'

class UpdateUser {
  get rules () {
    return {
      email : 'required|unique:users,email',
      username : 'required|unique:users'
    }
  }


  get messages(){
    return {
      'required' : '{{field}} is required',
      'unique' : '{{field}} already used '
    }
  }


  async fails(error){
    // ctx is short for context 
    let errors =[]
    error.forEach( (err) => errors.push(err.message) );
    this.ctx.response.status(400).send(errors)
  }
}

module.exports = UpdateUser
