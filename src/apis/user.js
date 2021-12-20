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
  oldUserResetPassword: ({ password }) => axios('/user/old-user/reset-password', {
    method: 'POST',
    data: { password }
  }),
  changePassword: ({ currentPassword, newPassword }) => axios('/user/change-password', {
    method: 'POST',
    data: { currentPassword, newPassword }
  }),
  verifyUser: ({ verifyCode }) => axios('/user/verify', {
    method: 'POST',
    data: { verifyCode }
  }),
  resendVerifyEmail: () => axios('/user/resend-verify-email', {
    method: 'POST',
    data: {}
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
  getGroupUser: ({ groupId }) => axios('/org/group/user/get', {
    method: 'POST',
    data: { groupId }
  }),
  updateDisplayName: ({ orgId, displayName }) => axios('/org/user/update-display-name', {
    method: 'POST',
    data: { orgId, displayName }
  }),
  updateAvatar: ({ orgId, avatar, originalAvatar }) => {
    const formData = new FormData()
    formData.append('orgId', orgId)
    formData.append('avatar', avatar)
    formData.append('originalAvatar', originalAvatar)

    return axios('/org/user/update-avatar', {
      headers: { 'Content-Type': 'multipart/form-data' },
      method: 'POST',
      data: formData
    })
  },
  removeAvatar: ({ orgId }) => axios('/org/user/remove-avatar', {
    method: 'POST',
    data: { orgId }
  })
}
