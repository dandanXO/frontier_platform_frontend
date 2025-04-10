import axios from '@/apis'
import { putBinaryData } from '@/utils/fileUpload'

export default {
  generalSignUp: ({
    email,
    lastName,
    firstName,
    password,
    signupSourceType,
  }: {
    [key: string]: string
  }) =>
    axios('/sign-up/general', {
      method: 'POST',
      data: {
        email,
        lastName,
        firstName,
        password,
        locale: 'en-US',
        platform: 1,
        signupSourceType,
      },
    }),
  generalSignUpRequest: ({
    name,
    email,
    phone,
    phoneCountryCode,
    description,
  }: {
    [key: string]: string
  }) =>
    axios('/sign-up/request', {
      method: 'POST',
      data: {
        name,
        email,
        phone,
        phoneCountryCode,
        description,
      },
    }),
  googleSignUp: ({ idToken, signupSourceType }: { [key: string]: string }) =>
    axios('/sign-up/google', {
      method: 'POST',
      data: { idToken, locale: 'en-US', platform: 1, signupSourceType },
    }),
  getUser: () =>
    axios('/user', {
      method: 'GET',
    }),
  updateUserProfile: ({ firstName, lastName }: { [key: string]: string }) =>
    axios('/user/update', {
      method: 'POST',
      data: { firstName, lastName },
    }),
  checkEmailExist: ({ email }: { [key: string]: string }) =>
    axios('/user/check-email-exist', {
      method: 'POST',
      data: { email },
    }),
  oldUserResetPassword: ({
    password,
    oldUserVerifyToken,
  }: {
    [key: string]: string
  }) =>
    axios('/user/old-user/reset-password', {
      method: 'POST',
      data: { password, oldUserVerifyToken },
    }),
  verifyPassword: ({ password }: { [key: string]: string }) =>
    axios('/user/verify-password', {
      method: 'POST',
      data: { password },
    }),
  changePassword: ({
    currentPassword,
    newPassword,
  }: {
    [key: string]: string
  }) =>
    axios('/user/change-password', {
      method: 'POST',
      data: { currentPassword, newPassword },
    }),
  verifyUser: ({ verifyCode }: { [key: string]: string }) =>
    axios('/user/verify', {
      method: 'POST',
      data: { verifyCode },
    }),
  resendVerifyEmail: (signupSourceType: number) =>
    axios('/user/resend-verify-email', {
      method: 'POST',
      data: { platform: 1, signupSourceType },
    }),
  sendForgotPasswordEmail: ({ email }: { [key: string]: string }) =>
    axios('/user/forgot-password/send-email', {
      method: 'POST',
      data: { email, platform: 1 },
    }),
  verifyForgotPasswordCode: ({ verifyCode }: { [key: string]: string }) =>
    axios('/user/forgot-password/verify', {
      method: 'POST',
      data: { verifyCode },
    }),
  resetPassword: ({ verifyToken, password }: { [key: string]: string }) =>
    axios('/user/forgot-password/reset-password', {
      method: 'POST',
      data: { verifyToken, password },
    }),
  changeLocale: ({ locale }: { [key: string]: string }) =>
    axios('/user/change-language', {
      method: 'POST',
      data: { locale },
    }),
  sendFeedback: ({
    tempFeedbackId,
    category,
    comment,
  }: {
    [key: string]: string
  }) =>
    axios('/user/feedback/send', {
      method: 'POST',
      data: { tempFeedbackId, category, comment },
    }),
  sendFeedbackAttachment: async ({
    tempFeedbackId,
    file,
  }: {
    tempFeedbackId: string
    file: File
  }) => {
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
  removeFeedbackAttachment: ({
    tempFeedbackId,
    tempFeedbackAttachmentId,
  }: {
    [key: string]: string
  }) =>
    axios('/user/feedback/remove-attachment', {
      method: 'POST',
      data: { tempFeedbackId, tempFeedbackAttachmentId },
    }),
  readAnnouncement: () =>
    axios('/user/read-announcement', {
      method: 'POST',
      data: {},
    }),
  createPrintLabelSetting: (payload: any) =>
    axios('/user/qrcode-label-print-setting/create', {
      method: 'POST',
      data: payload,
    }),
  getPrintLabelSetting: () =>
    axios('/user/qrcode-label-print-setting/get', {
      method: 'POST',
    }),
}
