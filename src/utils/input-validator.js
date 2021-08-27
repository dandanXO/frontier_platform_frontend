export default {
  emailFormat: (v) => (/.+@.+/ig).test(v),
  required: (v) => !!v
}
