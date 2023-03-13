import userApi from '@/apis/user'
import i18n from '@/utils/i18n'

const state = () => ({
  lastName: '',
  firstName: '',
  email: '',
  isVerify: false,
  locale: 'zh-TW',
  organizationList: [],
})

const getters = {
  user: (state) => state,
  email: (state) => state.email,
  organizationList: (state) => state.organizationList,
}

const mutations = {
  SET_user(state, user) {
    Object.assign(state, user)
  },
}

const actions = {
  setUser({ commit }, data) {
    commit('SET_user', data)
  },
  async getUser({ dispatch }) {
    const { data } = await userApi.getUser()
    i18n.global.locale.value = data.result?.user.locale
    dispatch('setUser', data.result.user)
  },
  async changeLocale({ dispatch }, params) {
    const { data } = await userApi.changeLocale(params)
    i18n.global.locale.value = data.result?.user.locale
    dispatch('setUser', data.result.user)
  },
  async checkEmailExist(_, params) {
    const { data } = await userApi.checkEmailExist(params)
    return data.result.isExist
  },
  async generalSignUp({ dispatch }, params) {
    const { data } = await userApi.generalSignUp(params)
    dispatch('setUser', data.result.user)
    return data.result.isExist
  },
  async generalSignIn({ dispatch }, params) {
    const { data } = await userApi.generalSignIn(params)
    dispatch('setUser', data.result.user)
    return data.result
  },
  async googleSignUp({ dispatch }, params) {
    const { data } = await userApi.googleSignUp(params)
    dispatch('setUser', data.result.user)
    return data.result.isExist
  },
  async googleSignIn({ dispatch }, params) {
    const { data } = await userApi.googleSignIn(params)
    dispatch('setUser', data.result.user)
  },
  async oldUserResetPassword(_, params) {
    await userApi.oldUserResetPassword(params)
  },
  async verifyPassword(_, { password }) {
    const { data } = await userApi.verifyPassword({ password })
    return data.result.isVerify
  },
  async changePassword(_, { currentPassword, newPassword }) {
    await userApi.changePassword({ currentPassword, newPassword })
  },
  async sendForgotPasswordEmail(_, params) {
    await userApi.sendForgotPasswordEmail(params)
  },
  async verifyForgotPasswordCode(_, params) {
    const { data } = await userApi.verifyForgotPasswordCode(params)
    return data.result.verifyToken
  },
  async resetPassword(_, params) {
    await userApi.resetPassword(params)
  },
  async resendVerifyEmail(_, signupSourceType) {
    await userApi.resendVerifyEmail(signupSourceType)
  },
  async verifyUser(_, { verifyCode }) {
    await userApi.verifyUser({ verifyCode })
  },
  async updateUserProfile({ dispatch }, { firstName, lastName }) {
    const { data } = await userApi.updateUserProfile({ firstName, lastName })
    dispatch('setUser', data.result.user)
  },
  async sendFeedback(_, { tempFeedbackId, category, comment }) {
    await userApi.sendFeedback({ tempFeedbackId, category, comment })
  },
  async sendFeedbackAttachment(_, { tempFeedbackId, file }) {
    const { data } = await userApi.sendFeedbackAttachment({
      tempFeedbackId,
      file,
    })
    return data.result.feedbackAttachmentList
  },
  async removeFeedbackAttachment(
    _,
    { tempFeedbackId, tempFeedbackAttachmentId }
  ) {
    const { data } = await userApi.removeFeedbackAttachment({
      tempFeedbackId,
      tempFeedbackAttachmentId,
    })
    return data.result.feedbackAttachmentList
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
