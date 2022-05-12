import userApi from '@/apis/user'
import setVuexState from '@/utils/set-vuex-state'
import i18n from '@/utils/i18n'
import dayjs from 'dayjs'
import { ROLE_ID } from '@/utils/constants'

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
  avatar: state => state.avatar,
  orgUserRole: state => {
    const roles = {}
    Object.keys(ROLE_ID).forEach(roleName => {
      roles[roleName] = state.orgRoleId === ROLE_ID[roleName]
    })
    return roles
  }
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
  },
  async readNotification ({ rootGetters, dispatch }) {
    const { data } = await userApi.readNotification({ orgId: rootGetters['organization/orgId'] })
    dispatch('handleResponseData', { data }, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
