export default {
  emailFormat (email, errorMsg = 'error.invalidEmail') {
    const isValid = (/.+@.+/ig).test(email)
    return {
      isValid,
      message: isValid ? '' : errorMsg
    }
  },
  required (text, errorMsg = 'term.required') {
    const isValid = !!text
    return {
      isValid,
      message: isValid ? '' : errorMsg
    }
  }
}
