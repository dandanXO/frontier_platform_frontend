import organizationApi from '@/apis/organization'
import { ROLE_ID } from '@/utils/constants'

export default {
  namespaced: true,
  state: () => ({
    orgUserId: 0,
    displayName: '',
    orgRoleId: 0,
    originalAvatar: '',
    avatar: '',
    lastSignInTime: '',
    email: '',
    isPending: false
  }),
  getters: {
    orgUser: state => state,
    avatar: state => state.avatar,
    orgUserRole: state => {
      const roles = {}
      Object.keys(ROLE_ID).forEach(roleName => {
        roles[roleName] = state.orgRoleId === ROLE_ID[roleName]
      })
      return roles
    }
  },
  mutations: {
    SET_orgUser (state, orgUser) {
      Object.assign(state, orgUser)
    }
  },
  actions: {
    async getOrgUser ({ rootGetters, commit }) {
      const { data: { result: { orgUser } } } = await organizationApi.getOrgUser({ orgId: rootGetters['organization/orgId'] })
      commit('SET_orgUser', orgUser)
    },
    async updateDisplayName ({ rootGetters, commit }, { displayName }) {
      const { data: { result: { orgUser } } } = await organizationApi.updateDisplayName({ orgId: rootGetters['organization/orgId'], displayName })
      commit('SET_orgUser', orgUser)
    },
    async updateAvatar ({ rootGetters, commit }, { avatar, originalAvatar }) {
      const { data: { result: { orgUser } } } = await organizationApi.updateAvatar({ orgId: rootGetters['organization/orgId'], avatar, originalAvatar })
      commit('SET_orgUser', orgUser)
    },
    async removeAvatar ({ rootGetters, commit }) {
      const { data: { result: { orgUser } } } = await organizationApi.removeAvatar({ orgId: rootGetters['organization/orgId'] })
      commit('SET_orgUser', orgUser)
    },
    async readNotification ({ rootGetters, commit }) {
      const { data: { result: { orgUser } } } = await organizationApi.readNotification({ orgId: rootGetters['organization/orgId'] })
      commit('SET_orgUser', orgUser)
    }
  }
}
