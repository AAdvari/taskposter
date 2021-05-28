const Mail = use('Mail')

class UserResetPassEmail {
  static get key() {
    return 'UserRestPassEmail-key'
  }

  async handle(job) {
    const { link , email } = job
    await Mail.raw( `<a href="${link}">Click On This </a>` , (message)=>{
        message.from('noreply@app.com')
        message.to(email)
    }); 

    return data
  }
}

module.exports = UserResetPassEmail