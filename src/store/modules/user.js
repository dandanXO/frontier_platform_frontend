import userApi from '@/apis/user'
import setVuexState from '@/utils/set-vuex-state'

const state = () => ({
  lastName: '',
  firstName: '',
  displayName: '',
  avatar: '',
  email: '',
  isVerify: false,
  locale: 'zh-TW',
  organizationList: [
    {
      orgId: 1,
      orgName: 'Coop Inc.',
      logo: 'https://picsum.photos/200',
      memberList: [
        {
          avatar: 'https://picsum.photos/200'
        },
        {
          avatar: 'https://picsum.photos/200'
        },
        {
          avatar: 'https://picsum.photos/200'
        },
        {
          avatar: 'https://picsum.photos/200'
        },
        {
          avatar: 'https://picsum.photos/200'
        },
        {
          avatar: 'https://picsum.photos/200'
        },
        {
          avatar: 'https://picsum.photos/200'
        },
        {
          avatar: 'https://picsum.photos/200'
        }
      ]
    }
  ]
})

const getters = {
  user: (state) => state,
  email: (state) => state.email,
  organizationList: (state) => state.organizationList
}

const mutations = {
}

const actions = {
  setUser ({ state }, data) {
    setVuexState(state, data)
  },
  async getUser ({ dispatch }, params) {
    const { data } = await userApi.getUser(params)
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
    const { success, message } = data

    if (!success) {
      throw message.content
    }
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
    const { success, message } = data

    if (!success) {
      throw message.content
    }
  },
  async googleSignIn (_, params) {
    const { data } = await userApi.googleSignIn(params)
    const { success, message } = data

    if (!success) {
      throw message.content
    }
  },
  async changePassword (_, params) {
    await userApi.changePassword(params)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
