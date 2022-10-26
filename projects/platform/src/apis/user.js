import axios from '@/apis'
import putBinaryData from '@/utils/put-binary-data'

export default {
  generalSignUp: ({ email, lastName, firstName, password }) =>
    axios('/sign-up/general', {
      method: 'POST',
      data: {
        email,
        lastName,
        firstName,
        password,
        locale: 'en-US',
        platform: 1,
      },
    }),
  generalSignIn: ({ email, password }) =>
    axios('/sign-in/general', {
      method: 'POST',
      data: { email, password, platform: 1 },
    }),
  googleSignUp: ({ idToken }) =>
    axios('/sign-up/google', {
      method: 'POST',
      data: { idToken, locale: 'en-US', platform: 1 },
    }),
  googleSignIn: ({ idToken }) =>
    axios('/sign-in/google', {
      method: 'POST',
      data: { idToken, platform: 1 },
    }),
  getUser: () =>
    axios('/user', {
      method: 'GET',
    }),
  updateUserProfile: ({ firstName, lastName }) =>
    axios('/user/update', {
      method: 'POST',
      data: { firstName, lastName },
    }),
  checkEmailExist: ({ email }) =>
    axios('/user/check-email-exist', {
      method: 'POST',
      data: { email },
    }),
  oldUserResetPassword: ({ password, oldUserVerifyToken }) =>
    axios('/user/old-user/reset-password', {
      method: 'POST',
      data: { password, oldUserVerifyToken },
    }),
  verifyPassword: ({ password }) =>
    axios('/user/verify-password', {
      method: 'POST',
      data: { password },
    }),
  changePassword: ({ currentPassword, newPassword }) =>
    axios('/user/change-password', {
      method: 'POST',
      data: { currentPassword, newPassword },
    }),
  verifyUser: ({ verifyCode }) =>
    axios('/user/verify', {
      method: 'POST',
      data: { verifyCode },
    }),
  resendVerifyEmail: () =>
    axios('/user/resend-verify-email', {
      method: 'POST',
      data: { platform: 1 },
    }),
  sendForgotPasswordEmail: ({ email }) =>
    axios('/user/forgot-password/send-email', {
      method: 'POST',
      data: { email, platform: 1 },
    }),
  verifyForgotPasswordCode: ({ verifyCode }) =>
    axios('/user/forgot-password/verify', {
      method: 'POST',
      data: { verifyCode },
    }),
  resetPassword: ({ verifyToken, password }) =>
    axios('/user/forgot-password/reset-password', {
      method: 'POST',
      data: { verifyToken, password },
    }),
  changeLocale: ({ locale }) =>
    axios('/user/change-language', {
      method: 'POST',
      data: { locale },
    }),
  sendFeedback: ({ tempFeedbackId, category, comment }) =>
    axios('/user/feedback/send', {
      method: 'POST',
      data: { tempFeedbackId, category, comment },
    }),
  sendFeedbackAttachment: async ({ tempFeedbackId, file }) => {
    const attachmentFileName = file.name

    const {
      data: {
        result: { tempUploadId, attachmentUploadUrl },
      },
    } = await axios('/user/feedback/upload-attachment/get-upload-url', {
      method: 'POST',
      data: { attachmentFileName },
    })
    await putBinaryData(attachmentUploadUrl, file)

    return axios('/user/feedback/upload-attachment', {
      method: 'POST',
      data: { tempFeedbackId, tempUploadId, attachmentFileName },
    })
  },
  removeFeedbackAttachment: ({ tempFeedbackId, tempFeedbackAttachmentId }) =>
    axios('/user/feedback/remove-attachment', {
      method: 'POST',
      data: { tempFeedbackId, tempFeedbackAttachmentId },
    }),
}
