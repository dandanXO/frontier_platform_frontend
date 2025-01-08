import groupApi from '@/apis/group'
import { COLOR } from '@/utils/constants'
import groupUser from '@/store/modules/management/group/groupUser'

export default {
  namespaced: true,
  modules: {
    groupUser,
  },
  state: () => ({
    groupId: '',
    groupNo: '',
    groupName: '',
    address: '',
    description: '',
    labelColor: '',
    inviteCode: '',
    uploadMaterialEmail: '',
    workspaceNodeId: null,
    memberList: [],
    historyList: [],

    /** LOCAL VAR */
    createForm: {
      groupName: '',
      address: '',
      labelColor: COLOR.RED,
      description: '',
      uploadMaterialEmail: '',
    },
  }),
  getters: {
    group: (state) => state,
    groupId: (state) => state.groupId,
    uploadMaterialEmail: (state) => state.uploadMaterialEmail,
    memberList: (state) => state.memberList,
    historyList: (state) => state.historyList,
    createForm: (state) => state.createForm,
  },
  mutations: {
    SET_group(state, group) {
      Object.assign(state, group)
    },
    SET_createForm_groupName(state, groupName) {
      state.createForm.groupName = groupName
    },
    SET_createForm_address(state, address) {
      state.createForm.address = address
    },
    SET_createForm_labelColor(state, labelColor) {
      state.createForm.labelColor = labelColor
    },
    SET_createForm_description(state, description) {
      state.createForm.description = description
    },
    SET_createForm_uploadMaterialEmail(state, uploadMaterialEmail) {
      state.createForm.uploadMaterialEmail = uploadMaterialEmail
    },
  },
  actions: {
    async callGroupApi({ getters }, { func, params = {} }) {
      return await groupApi[func](getters.groupId, params)
    },
    setGroup({ commit }, data) {
      commit('SET_group', data)
    },
    async createGroup({ rootGetters, state, dispatch }) {
      const { data } = await dispatch('callGroupApi', {
        func: 'createGroup',
        params: {
          ...state.createForm,
          orgId: rootGetters['organization/orgId'],
        },
      })

      if (data.success) {
        dispatch('setGroup', data.result.group)
        dispatch('organization/setOrganization', data.result.organization, {
          root: true,
        })
      }
      return data
    },
    async getGroup({ dispatch }, { groupId }) {
      const { data } = await groupApi.getGroup(groupId)
      dispatch('setGroup', data.result.group)
    },
    async updateGroup({ dispatch }, params) {
      const { data } = await dispatch('callGroupApi', {
        func: 'updateGroup',
        params,
      })
      dispatch('setGroup', data.result.group)
      dispatch('organization/setOrganization', data.result.organization, {
        root: true,
      })
    },
    async deleteGroup({ dispatch }, params) {
      const { data } = await dispatch('callGroupApi', {
        func: 'deleteGroup',
        params,
      })
      dispatch('organization/setOrganization', data.result.organization, {
        root: true,
      })
    },
    async cancelGroupInvitation({ dispatch }, params) {
      const { data } = await dispatch('callGroupApi', {
        func: 'cancelGroupInvitation',
        params,
      })
      dispatch('setGroup', data.result.group)
    },
    async changeGroupMemberRole({ dispatch }, params) {
      await dispatch('callGroupApi', {
        func: 'changeGroupMemberRole',
        params,
      })
    },
    async removeGroupMember({ dispatch }, params) {
      const { data } = await dispatch('callGroupApi', {
        func: 'removeGroupMember',
        params,
      })
      dispatch('setGroup', data.result.group)
    },
    async addMemberToGroup({ dispatch }, params) {
      const { data } = await dispatch('callGroupApi', {
        func: 'addMemberToGroup',
        params,
      })
      dispatch('setGroup', data.result.group)
    },
    async inviteToOrgFromGroup({ dispatch }, params) {
      const { data } = await dispatch('callGroupApi', {
        func: 'inviteToOrgFromGroup',
        params,
      })
      dispatch('setGroup', data.result.group)
    },
    async joinGroupViaLink({ dispatch }, params) {
      await dispatch('callGroupApi', {
        func: 'joinGroupViaLink',
        params,
      })
    },
    resetCreateForm({ commit }) {
      commit('SET_createForm_groupName', '')
      commit('SET_createForm_address', '')
      commit('SET_createForm_labelColor', COLOR.RED)
      commit('SET_createForm_description', '')
      commit('SET_createForm_uploadMaterialEmail', '')
    },
  },
}
