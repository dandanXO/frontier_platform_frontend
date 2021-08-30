import organizationApi from '@/apis/organization'
import setVuexState from '@/utils/set-vuex-state'

const state = () => ({
  orgId: 1,
  orgNo: '',
  logo: '',
  originalLogo: '',
  orgName: '',
  orgCategoryId: 1,
  countryCode: '',
  address: '',
  phone: '',
  phoneCountryCode: '',
  fax: '',
  faxCountryCode: '',
  inviteCode: '',
  labelColor: '',
  uploadMaterialEmail: '',
  memberList: [],
  groupList: [],
  historyList: []
})

const getters = {
  organization: state => state,
  orgId: state => state.orgId,
  memberList: state => state.memberList,
  groupList: state => state.groupList,
  historyList: state => state.historyList
}

const actions = {
  setOrganization ({ state }, data) {
    setVuexState(state, data)
  },
  async createOrg (_, params) {
    const temp = {}
    Object.keys(params).forEach(key => {
      if (params[key] !== '') {
        temp[key] = params[key]
      }
    })
    if (!Object.prototype.hasOwnProperty.call(temp, 'phone')) {
      delete temp.phoneCountryCode
    }
    if (!Object.prototype.hasOwnProperty.call(temp, 'fax')) {
      delete temp.faxCountryCode
    }

    await organizationApi.createOrg(temp)
  },
  async getOrg ({ rootGetters, dispatch }, { orgNo }) {
    const orgId = rootGetters['user/organizationList'].find(org => org.orgNo === orgNo)?.orgId || null
    const { data } = await organizationApi.getOrg({ orgId })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async checkOrgNameExist (_, params) {
    const { data } = await organizationApi.checkOrgNameExist(params)
    const { result } = data

    return result.isExist
  },
  async updateOrg ({ state, dispatch }, params) {
    const { data } = await organizationApi.updateOrg({
      orgId: state.orgId,
      ...params
    })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async changeOrgMemberRole ({ dispatch }, params) {
    const { data } = await organizationApi.changeOrgMemberRole(params)
    dispatch('handleResponseData', { data }, { root: true })
  },
  async removeOrgMember ({ dispatch }, params) {
    const { data } = await organizationApi.removeOrgMember(params)
    dispatch('handleResponseData', { data }, { root: true })
  },
  async cancelOrgInvitation ({ state, dispatch }, params) {
    const { data } = await organizationApi.cancelOrgInvitation({
      orgId: state.orgId,
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
