import userApi from '@/apis/user'
import setVuexState from '@/utils/set-vuex-state'

const state = () => ({
  orgUserId: 0,
  displayName: '',
  orgRoleId: 0,
  originalAvatar: '',
  avatar: '',
  lastSignInTime: '',
  email: '',
  isPending: false
})

const getters = {
  orgUser: state => state
}

const actions = {
  setOrgUser ({ state }, data) {
    setVuexState(state, data)
  },
  async getOrgUser ({ rootGetters, dispatch }, { orgNo }) {
    const orgId = rootGetters['user/organizationList'].find(org => org.orgNo === orgNo)?.orgId || null
    const { data } = await userApi.getOrgUser({ orgId })
    dispatch('handleResponseData', { data }, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
