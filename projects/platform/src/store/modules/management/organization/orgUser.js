import { putBinaryData } from '@/utils/fileUpload'
import axios from '@/apis'
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
    isPending: false,
  }),
  getters: {
    orgUser: (state) => state,
    avatar: (state) => state.avatar,
    orgUserRole: (state) => {
      const roles = {}
      Object.keys(ROLE_ID).forEach((roleName) => {
        roles[roleName] = state.orgRoleId === ROLE_ID[roleName]
      })
      return roles
    },
  },
  mutations: {
    SET_orgUser(state, orgUser) {
      Object.assign(state, orgUser)
    },
  },
  actions: {
    async getOrgUser({ commit, dispatch }) {
      const { data } = await dispatch(
        'organization/callOrgApi',
        { func: 'getOrgUser' },
        { root: true }
      )
      commit('SET_orgUser', data.result.orgUser)
    },
    async updateDisplayName({ commit, dispatch }, params) {
      const { data } = await dispatch(
        'organization/callOrgApi',
        { func: 'updateDisplayName', params },
        { root: true }
      )
      commit('SET_orgUser', data.result.orgUser)
    },
    async updateAvatar({ commit, dispatch }, { avatar, originalAvatar }) {
      const avatarFileName = avatar.name
      const originalAvatarFileName = originalAvatar.name

      const {
        data: {
          result: { tempUploadId, avatarUploadUrl, originalAvatarUploadUrl },
        },
      } = await axios('/org/user/update-avatar/get-upload-url', {
        method: 'POST',
        data: { avatarFileName, originalAvatarFileName },
      })
      await putBinaryData(avatarUploadUrl, avatar)
      await putBinaryData(originalAvatarUploadUrl, originalAvatar)

      const { data } = await dispatch(
        'organization/callOrgApi',
        {
          func: 'updateAvatar',
          params: { tempUploadId, avatarFileName, originalAvatarFileName },
        },
        { root: true }
      )
      commit('SET_orgUser', data.result.orgUser)
    },
    async removeAvatar({ commit, dispatch }) {
      const { data } = await dispatch(
        'organization/callOrgApi',
        { func: 'removeAvatar' },
        { root: true }
      )
      commit('SET_orgUser', data.result.orgUser)
    },
    async readNotification({ commit, dispatch }) {
      const { data } = await dispatch(
        'organization/callOrgApi',
        { func: 'readNotification' },
        { root: true }
      )
      commit('SET_orgUser', data.result.orgUser)
    },
  },
}
