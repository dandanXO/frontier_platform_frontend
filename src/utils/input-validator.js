export default {
  emailForma: (v) => (/.+@.+/ig).test(v),
  required: (v) => !!v
}
