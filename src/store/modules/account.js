import accountApi from '@/apis/account'

const state = () => ({
})

const getters = {

}

const mutations = {
}

const actions = {
  async generalSignUp (_, params) {
    const { data } = await accountApi.generalSignUp(params)
    const { success, message } = data

    if (!success) {
      throw message.content
    }
  },
  async generalSignIn (_, params) {
    const { data } = await accountApi.generalSignIn(params)
    const { success, message } = data

    if (!success) {
      throw message.content
    }
  },
  async googleSignUp (_, params) {
    const { data } = await accountApi.googleSignUp(params)
    const { success, message } = data

    if (!success) {
      throw message.content
    }
  },
  async googleSignIn (_, params) {
    const { data } = await accountApi.googleSignIn(params)
    const { success, message } = data

    if (!success) {
      throw message.content
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
