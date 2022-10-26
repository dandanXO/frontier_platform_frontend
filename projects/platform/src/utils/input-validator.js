export default {
  emailFormat: (v) => /.+@.+/gi.test(v),
  required: (v) => !!v,
}
