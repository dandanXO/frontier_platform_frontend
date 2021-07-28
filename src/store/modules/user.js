import userApi from '@/apis/user'

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
  organizationList: (state) => state.organizationList
}

const mutations = {
}

const actions = {
  async generalSignUp (_, params) {
    const { data } = await userApi.generalSignUp(params)
    const { success, message } = data

    if (!success) {
      throw message.content
    }
  },
  async generalSignIn (_, params) {
    const { data } = await userApi.generalSignIn(params)
    const { success, message } = data

    if (!success) {
      throw message.content
    }
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
  async getUser (_, params) {
    const { data } = await userApi.getUser(params)
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
