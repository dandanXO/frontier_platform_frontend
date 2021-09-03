import axios from '@/apis'

export default {
  generalSignUp: ({ email, lastName, firstName, password, locale }) => axios('/sign-up/general', {
    method: 'POST',
    data: { email, lastName, firstName, password, locale }
  }),
  generalSignIn: ({ email, password }) => axios('/sign-in/general', {
    method: 'POST',
    data: { email, password }
  }),
  googleSignUp: ({ idToken, locale }) => axios('/sign-up/google', {
    method: 'POST',
    data: { idToken, locale }
  }),
  googleSignIn: ({ idToken }) => axios('/sign-in/google', {
    method: 'POST',
    data: { idToken }
  }),
  getUser: () => axios('/user', {
    method: 'GET'
  }),
  updateUser: ({ firstName, lastName }) => axios('/user/update', {
    method: 'POST',
    data: { firstName, lastName }
  }),
  checkEmailExist: ({ email }) => axios('/user/check-email-exist', {
    method: 'POST',
    data: { email }
  }),
  changePassword: ({ password }) => axios('/user/change-password', {
    method: 'POST',
    data: { password }
  }),
  sendForgotPasswordEmail: ({ email }) => axios('/user/forgot-password/send-email', {
    method: 'POST',
    data: { email }
  }),
  verifyForgotPasswordCode: ({ verifyCode }) => axios('/user/forgot-password/verify', {
    method: 'POST',
    data: { verifyCode }
  }),
  resetPassword: ({ verifyToken, password }) => axios('/user/forgot-password/reset-password', {
    method: 'POST',
    data: { verifyToken, password }
  }),
  changeLocale: ({ locale }) => axios('/user/change-language', {
    method: 'POST',
    data: { locale }
  }),
  getOrgUser: ({ orgId }) => axios('/org/user/get', {
    method: 'POST',
    data: { orgId }
  }),
  updateDisplayName: ({ orgId, displayName }) => axios('/org/user//org/user/update-display-name', {
    method: 'POST',
    data: { orgId, displayName }
  }),
  /**
   * @param {formData} formData
   * @param {number} formData.orgId
   * @param {binary} formData.avatar
   * @param {binary} formData.originalAvatar
   */
  updateAvatar: (formData) => axios('/org/user/update-avatar', {
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data: formData
  })
}
