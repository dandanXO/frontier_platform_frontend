import userApi from '@/apis/user'
import setVuexState from '@/utils/set-vuex-state'

const state = () => ({
  orgUserId: 0,
  displayName: '',
  roleId: 0,
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
  async getOrgUser ({ rootGetters, dispatch }, { orgName }) {
    const orgId = rootGetters['user/organizationList'].find(org => org.orgName === orgName)?.orgId || null
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
