export default {
  emailFormat (email) {
    return (/.+@.+/ig).test(email)
  },
  required (text) {
    return text.length > 0
  }
}
