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
    isPending: false,
  }),
  getters: {
    groupUser: (state) => state,
    avatar: (state) => state.avatar,
  },
  mutations: {
    SET_groupUser(state, groupUser) {
      Object.assign(state, groupUser)
    },
  },
  actions: {
    async getGroupUser({ dispatch, commit }) {
      const { data } = await dispatch(
        'group/callGroupApi',
        { func: 'getGroupUser' },
        { root: true }
      )
      commit('SET_groupUser', data.result.groupUser)
    },
  },
}
