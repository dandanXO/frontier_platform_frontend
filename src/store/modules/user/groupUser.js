import userApi from '@/apis/user'
import setVuexState from '@/utils/set-vuex-state'

const state = () => ({
  groupUserId: 0,
  displayName: '',
  orgRoleId: 0,
  groupRoleId: 0,
  originalAvatar: '',
  avatar: '',
  lastSignInTime: '',
  email: '',
  isPending: false
})

const getters = {
  groupUser: state => state,
  avatar: state => state.avatar
}

const actions = {
  setGroupUser ({ state }, data) {
    setVuexState(state, data)
  },
  async getGroupUser ({ rootGetters, dispatch }) {
    const { data } = await userApi.getGroupUser({ groupId: rootGetters['group/groupId'] })
    dispatch('handleResponseData', { data }, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
