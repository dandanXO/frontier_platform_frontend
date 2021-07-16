import axios from '@/apis'

export default {
  generalSignUp: (data) => axios('/sign-up/general', {
    method: 'POST',
    data
  }),
  generalSignIn: (data) => axios('/sign-in/general', {
    method: 'POST',
    data
  }),
  googleSignUp: (data) => axios('/sign-up/google', {
    method: 'POST',
    data
  }),
  googleSignIn: (data) => axios('/sign-in/google', {
    method: 'POST',
    data
  })
}
