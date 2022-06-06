import userApi from '@/apis/user'
import setVuexState from '@/utils/set-vuex-state'
import i18n from '@/utils/i18n'

const state = () => ({
  lastName: '',
  firstName: '',
  email: '',
  isVerify: false,
  locale: 'zh-TW',
  organizationList: []
})

const getters = {
  user: (state) => state,
  email: (state) => state.email,
  organizationList: state => state.organizationList
}

const actions = {
  setUser ({ state }, data) {
    setVuexState(state, data)
  },
  async getUser ({ dispatch }) {
    const { data } = await userApi.getUser()
    i18n.global.locale = data.result?.user.locale
    dispatch('handleResponseData', { data }, { root: true })
  },
  async changeLocale ({ dispatch }, params) {
    const { data } = await userApi.changeLocale(params)
    dispatch('handleResponseData', { data }, { root: true })
  },
  async checkEmailExist (_, params) {
    const { data } = await userApi.checkEmailExist(params)
    return data.result.isExist
  },
  async generalSignUp (_, params) {
    const { data } = await userApi.generalSignUp(params)
    return data.result.isExist
  },
  async generalSignIn (_, params) {
    const { data } = await userApi.generalSignIn(params)
    return data.result.isOldUser
  },
  async googleSignUp (_, params) {
    const { data } = await userApi.googleSignUp(params)
    return data.result.isExist
  },
  async googleSignIn (_, params) {
    await userApi.googleSignIn(params)
  },
  async oldUserResetPassword (_, params) {
    await userApi.oldUserResetPassword(params)
  },
  async changePassword (_, { currentPassword, newPassword }) {
    const { data } = await userApi.changePassword({ currentPassword, newPassword })
    const { success, message } = data

    if (!success) {
      throw message.content
    }
  },
  async sendForgotPasswordEmail (_, params) {
    await userApi.sendForgotPasswordEmail(params)
  },
  async verifyForgotPasswordCode ({ dispatch }, params) {
    const { data } = await userApi.verifyForgotPasswordCode(params)
    dispatch('handleResponseData', { data }, { root: true })
    return data.result.verifyToken
  },
  async resetPassword ({ dispatch }, params) {
    const { data } = await userApi.resetPassword(params)
    dispatch('handleResponseData', { data }, { root: true })
  },
  async resendVerifyEmail () {
    await userApi.resendVerifyEmail()
  },
  async verifyUser (_, { verifyCode }) {
    await userApi.verifyUser({ verifyCode })
  },
  async updateUserProfile ({ dispatch }, { firstName, lastName }) {
    const { data } = await userApi.updateUserProfile({ firstName, lastName })
    dispatch('handleResponseData', { data }, { root: true })
  },
  sendFeedback (_, { tempFeedbackId, category, comment }) {
    userApi.sendFeedback({ tempFeedbackId, category, comment })
  },
  async sendFeedbackAttachment (_, { tempFeedbackId, file }) {
    const { data } = await userApi.sendFeedbackAttachment({ tempFeedbackId, file })
    return data.result.feedbackAttachmentList
  },
  async removeFeedbackAttachment (_, { tempFeedbackId, tempFeedbackAttachmentId }) {
    const { data } = await userApi.removeFeedbackAttachment({ tempFeedbackId, tempFeedbackAttachmentId })
    return data.result.feedbackAttachmentList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
