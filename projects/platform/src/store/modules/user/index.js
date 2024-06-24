import userApi from '@/apis/user'
import i18n from '@frontier/i18n'
import {
  setDefaultTrackerProperties,
  setProfileTrackerProperties,
  setTrackerId,
} from '@frontier/lib'

const state = () => ({
  lastName: '',
  firstName: '',
  email: '',
  isVerify: false,
  locale: 'zh-TW',
  organizationList: [],
  isShowAnnouncement: true,
  isPromotingNewFeature: true,
  printLabelSetting: null,
})

const getters = {
  user: (state) => state,
  email: (state) => state.email,
  organizationList: (state) => state.organizationList,
  isShowAnnouncement: (state) => state.isShowAnnouncement,
  isPromotingNewFeature: (state) => state.isPromotingNewFeature,
  printLabelSetting: (state) => state.printLabelSetting,
}

const mutations = {
  SET_user(state, user) {
    Object.assign(state, user)
  },
  SET_printLabelSetting(state, printLabelSetting) {
    Object.assign(state, { printLabelSetting })
  },
}

const actions = {
  setUser({ commit }, data) {
    commit('SET_user', data)
    const { email: userEmail } = data
    userEmail && setTrackerId(userEmail)
    setProfileTrackerProperties({
      $email: userEmail,
      $name: userEmail,
    })
    setDefaultTrackerProperties({
      userEmail,
    })
  },
  setPrintLabelSetting({ commit }, data) {
    commit('SET_printLabelSetting', data)
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
  async generalSignUpRequest(_, params) {
    await userApi.generalSignUpRequest(params)
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
  async createPrintLabelSetting({ dispatch }, payload) {
    const { data } = await userApi.createPrintLabelSetting(payload)
    if (data.success) {
      dispatch('setPrintLabelSetting', payload)
    }
  },
  async getPrintLabelSetting({ dispatch }) {
    const { data } = await userApi.getPrintLabelSetting()
    dispatch('setPrintLabelSetting', data.result)
    return data.result
  },
  readAnnouncement() {
    userApi.readAnnouncement()
  },
  openModalNewFeatureLaunch({ dispatch }) {
    dispatch(
      'helper/openModal',
      { component: 'modal-announcement' },
      { root: true }
    )
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
