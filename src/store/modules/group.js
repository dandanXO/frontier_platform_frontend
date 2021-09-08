import groupApi from '@/apis/group'
import setVuexState from '@/utils/set-vuex-state'

const state = () => ({
  groupId: '',
  groupNo: '',
  groupName: '',
  description: '',
  labelColor: '',
  inviteCode: '',
  uploadMaterialEmail: '',
  memberList: [],
  historyList: []
})

const getters = {
  group: state => state,
  memberList: state => state.memberList,
  historyList: state => state.historyList
}

const actions = {
  setGroup ({ state }, data) {
    setVuexState(state, data)
  },
  async createGroup ({ rootGetters, dispatch }, params) {
    const { data } = await groupApi.createGroup({
      ...params,
      orgId: rootGetters['organization/orgId']
    })
    dispatch('handleResponseData', { data }, { root: true })
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
