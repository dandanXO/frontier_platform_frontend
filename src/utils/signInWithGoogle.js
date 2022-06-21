// https://developers.google.com/identity/gsi/web/guides/overview

import i18n from '@/utils/i18n.js'

class SignInWithGoogle {
  constructor ({ elementId, callback }) {
    this.google = window.google
    this.client_id = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID

    if (this.google) {
      this.initialize(elementId, callback)
    }
  }

  initialize (elementId, callback) {
    // https://developers.google.com/identity/gsi/web/reference/js-reference#context
    this.google.accounts.id.initialize({
      client_id: this.client_id,
      callback,
      ux_mode: 'popup',
      context: 'use'
    })
    this.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        locale: i18n.global.locale.value,
        width: 340,
        logo_alignment: 'center'
      }  // customization attributes
    )
    this.google.accounts.id.prompt()
  }
}

export default SignInWithGoogle
