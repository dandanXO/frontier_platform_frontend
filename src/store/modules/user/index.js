import userApi from '@/apis/user'
import orgUser from '@/store/modules/user/orgUser'
import groupUser from '@/store/modules/user/groupUser'
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
  organizationList: (state) => {
    return state.organizationList.map(org => {
      return {
        ...org,
        logo: org.logo ? org.logo : require('@/assets/images/logo-default.png'),
        memberList: org.memberList.map(member => ({
          ...member,
          avatar: member.avatar ? member.avatar : require('@/assets/images/default_user.png')
        }))
      }
    })
  }
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
    const { success, message, result } = data

    if (!success) {
      throw message.content
    }

    return result.isExist
  },
  async generalSignUp (_, params) {
    const { data } = await userApi.generalSignUp(params)
    const { success, message, result } = data

    if (!success) {
      throw message.content
    }

    return result.isExist
  },
  async generalSignIn (_, params) {
    const { data } = await userApi.generalSignIn(params)
    const { success, message, result } = data

    if (!success) {
      throw message.content
    }

    return result.isOldUser
  },
  async googleSignUp (_, params) {
    const { data } = await userApi.googleSignUp(params)
    const { success, message, result } = data

    if (!success) {
      throw message.content
    }

    return result.isExist
  },
  async googleSignIn (_, params) {
    const { data } = await userApi.googleSignIn(params)
    const { success, message } = data

    if (!success) {
      throw message.content
    }
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  modules: {
    orgUser,
    groupUser
  }
}
