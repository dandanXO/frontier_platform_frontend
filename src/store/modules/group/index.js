import groupApi from '@/apis/group'
import setVuexState from '@/utils/set-vuex-state'
import { COLOR } from '@/utils/constants'

const state = () => ({
  groupId: '',
  groupNo: '',
  groupName: '',
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
    labelColor: COLOR.RED,
    description: '',
    uploadMaterialEmail: ''
  }
})

const getters = {
  group: state => state,
  groupId: state => state.groupId,
  uploadMaterialEmail: state => state.uploadMaterialEmail,
  memberList: state => {
    return state.memberList.map(member => ({
      ...member,
      avatar: member.avatar ? member.avatar : require('@/assets/images/default_user.png')
    }))
  },
  historyList: state => state.historyList,
  createForm: state => state.createForm
}

const mutations = {
  SET_createForm_groupName (state, groupName) {
    state.createForm.groupName = groupName
  },
  SET_createForm_labelColor (state, labelColor) {
    state.createForm.labelColor = labelColor
  },
  SET_createForm_description (state, description) {
    state.createForm.description = description
  },
  SET_createForm_uploadMaterialEmail (state, uploadMaterialEmail) {
    state.createForm.uploadMaterialEmail = uploadMaterialEmail
  }
}

const actions = {
  setGroup ({ state }, data) {
    setVuexState(state, data)
  },
  async createGroup ({ rootGetters, state, dispatch }) {
    const { data } = await groupApi.createGroup({
      ...state.createForm,
      orgId: rootGetters['organization/orgId']
    })
    const { success, result } = data
    if (success) {
      dispatch('handleResponseData', { data }, { root: true })
    } else {
      throw result.availableEmailList
    }
  },
  async getGroup ({ dispatch }, params) {
    const { data } = await groupApi.getGroup(params)
    dispatch('handleResponseData', { data }, { root: true })
  },
  async updateGroup ({ state, dispatch }, params) {
    const { data } = await groupApi.updateGroup({
      ...params,
      groupId: state.groupId
    })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async deleteGroup ({ state, dispatch }, params) {
    const { data } = await groupApi.deleteGroup({
      ...params,
      groupId: state.groupId
    })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async cancelGroupInvitation ({ state, dispatch }, params) {
    const { data } = await groupApi.cancelGroupInvitation({
      ...params,
      groupId: state.groupId
    })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async changeGroupMemberRole ({ dispatch }, params) {
    const { data } = await groupApi.changeGroupMemberRole(params)
    dispatch('handleResponseData', { data }, { root: true })
  },
  async removeGroupMember ({ dispatch }, params) {
    const { data } = await groupApi.removeGroupMember(params)
    dispatch('handleResponseData', { data }, { root: true })
  },
  async addMemberToGroup ({ state, dispatch }, params) {
    const { data } = await groupApi.addMemberToGroup({
      groupId: state.groupId,
      ...params
    })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async inviteToOrgFromGroup ({ state, dispatch }, params) {
    const { data } = await groupApi.inviteToOrgFromGroup({
      groupId: state.groupId,
      ...params
    })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async joinGroupViaLink ({ dispatch }, params) {
    const { data } = await groupApi.joinGroupViaLink(params)
    dispatch('handleResponseData', { data }, { root: true })
  },
  resetCreateForm ({ commit }) {
    commit('SET_createForm_groupName', '')
    commit('SET_createForm_labelColor', COLOR.RED)
    commit('SET_createForm_description', '')
    commit('SET_createForm_uploadMaterialEmail', '')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
