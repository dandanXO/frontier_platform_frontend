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
  orgUser: state => state,
  avatar: state => state.avatar ? state.avatar : require('@/assets/images/default_user.png')
}

const actions = {
  setOrgUser ({ state }, data) {
    setVuexState(state, data)
  },
  async getOrgUser ({ rootGetters, dispatch }) {
    const { data } = await userApi.getOrgUser({ orgId: rootGetters['organization/orgId'] })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async updateDisplayName ({ rootGetters, dispatch }, { displayName }) {
    const { data } = await userApi.updateDisplayName({ orgId: rootGetters['organization/orgId'], displayName })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async updateAvatar ({ rootGetters, dispatch }, { avatar, originalAvatar }) {
    const { data } = await userApi.updateAvatar({ orgId: rootGetters['organization/orgId'], avatar, originalAvatar })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async removeAvatar ({ rootGetters, dispatch }) {
    const { data } = await userApi.removeAvatar({ orgId: rootGetters['organization/orgId'] })
    dispatch('handleResponseData', { data }, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
