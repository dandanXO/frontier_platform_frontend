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
  }),
  getUser: (data) => axios('/user/get', {
    method: 'POST',
    data
  }),
  getUserOrgList: () => axios('/user/get-org-list', {
    method: 'POST'
  }),
  checkEmailExist: (data) => axios('/user/check-email-exist', {
    method: 'POST',
    data
  }),
  changePassword: (data) => axios('/user/change-password', {
    method: 'POST',
    data
  })
}
