// https://developers.google.com/identity/sign-in/web/reference

class GoogleSignInApi {
  constructor () {
    this.gapi = window.gapi
    this.googleAuth = null // gapi.auth2.GoogleAuth
    this.googleUser = null // gapi.auth2.GoogleUser
    this.client_id = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID
  }

  async init () {
    return new Promise((resolve, reject) => {
      this.gapi.load('auth2', async () => {
        this.googleAuth = await this.gapi.auth2.init({
          client_id: this.client_id
        })
        resolve()
      })
    })
  }

  attachClickHandler ({ elementId, options = {}, successHandler = this.successHandler, failHandler = this.failHandler }) {
    this.googleAuth.attachClickHandler(elementId, options, successHandler, failHandler)
  }

  successHandler (googleUser) {
    this.googleUser = googleUser
  }

  failHandler (error) {
    console.log(error)
  }
}

export default new GoogleSignInApi()
