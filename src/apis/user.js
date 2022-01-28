import axios from '@/apis'
import putBinaryData from '@/utils/put-binary-data'

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
  updateUserProfile: ({ firstName, lastName }) => axios('/user/update', {
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
  updateAvatar: async ({ orgId, avatar, originalAvatar }) => {
    const avatarFileName = avatar.name
    const originalAvatarFileName = originalAvatar.name

    const { data: { result: { tempUploadId, avatarUploadUrl, originalAvatarUploadUrl } } } = await axios('/org/user/update-avatar/get-upload-url', {
      method: 'POST',
      data: { avatarFileName, originalAvatarFileName }
    })
    await putBinaryData(avatarUploadUrl, avatar)
    await putBinaryData(originalAvatarUploadUrl, originalAvatar)

    return axios('/org/user/update-avatar', {
      method: 'POST',
      data: { orgId, tempUploadId, avatarFileName, originalAvatarFileName }
    })
  },
  removeAvatar: ({ orgId }) => axios('/org/user/remove-avatar', {
    method: 'POST',
    data: { orgId }
  }),
  readNotification: ({ orgId }) => axios('/org/user/read-notification', {
    method: 'POST',
    data: { orgId }
  }),
  sendFeedback: ({ tempFeedbackId, category, comment }) => axios('/user/feedback/send', {
    method: 'POST',
    data: { tempFeedbackId, category, comment }
  }),
  sendFeedbackAttachment: async ({ tempFeedbackId, file }) => {
    const attachmentFileName = file.name

    const { data: { result: { tempUploadId, attachmentUploadUrl } } } = await axios('/user/feedback/upload-attachment/get-upload-url', {
      method: 'POST',
      data: { attachmentFileName }
    })
    await putBinaryData(attachmentUploadUrl, file)

    return axios('/user/feedback/upload-attachment', {
      method: 'POST',
      data: { tempFeedbackId, tempUploadId, attachmentFileName }
    })
  },
  removeFeedbackAttachment: ({ tempFeedbackId, tempFeedbackAttachmentId }) => axios('/user/feedback/remove-attachment', {
    method: 'POST',
    data: { tempFeedbackId, tempFeedbackAttachmentId }
  })
}
