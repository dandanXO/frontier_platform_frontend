import groupApi from '@/apis/group'

export default {
  namespaced: true,
  state: () => ({
    groupUserId: 0,
    displayName: '',
    orgRoleId: 0,
    groupRoleId: 0,
    originalAvatar: '',
    avatar: '',
    lastSignInTime: '',
    email: '',
    isPending: false
  }),
  getters: {
    groupUser: state => state,
    avatar: state => state.avatar
  },
  mutations: {
    SET_groupUser (state, groupUser) {
      Object.assign(state, groupUser)
    }
  },
  actions: {
    async getGroupUser ({ rootGetters, commit }) {
      const { data: { result: { groupUser } } } = await groupApi.getGroupUser({ groupId: rootGetters['group/groupId'] })
      commit('SET_groupUser', groupUser)
    }
  }
}
