import organizationApi from '@/apis/organization'
import setVuexState from '@/utils/set-vuex-state'
import orgLogo from '@/store/modules/organization/orgLogo'

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
  historyList: [],

  /** LOCAL VAR */
  createForm: {
    orgCategoryId: 1,
    countryCode: '',
    address: '',
    orgName: '',
    phone: '',
    phoneCountryCode: 'TW',
    fax: '',
    faxCountryCode: 'TW',
    uploadMaterialEmail: ''
  }
})

const getters = {
  organization: state => state,
  orgLogo: state => {
    return state.logo === '' ? require('@/assets/images/logo-default.png') : state.logo
  },
  orgId: state => state.orgId,
  orgNo: state => state.orgNo,
  uploadMaterialEmail: state => state.uploadMaterialEmail,
  memberList: state => state.memberList,
  groupList: state => state.groupList,
  historyList: state => state.historyList,
  createForm: state => state.createForm
}

const mutations = {
  SET_createForm (state, data) {
    Object.assign(state.createForm, data)
  },
  SET_createForm_uploadMaterialEmail (state, uploadMaterialEmail) {
    state.createForm.uploadMaterialEmail = uploadMaterialEmail
  }
}

const actions = {
  setOrganization ({ state }, data) {
    setVuexState(state, data)
  },
  async createOrg ({ state, dispatch }) {
    const temp = {}
    Object.keys(state.createForm).forEach(key => {
      if (state.createForm[key] !== '') {
        temp[key] = state.createForm[key]
      }
    })
    if (!Object.prototype.hasOwnProperty.call(temp, 'phone')) {
      delete temp.phoneCountryCode
    }
    if (!Object.prototype.hasOwnProperty.call(temp, 'fax')) {
      delete temp.faxCountryCode
    }

    const { data } = await organizationApi.createOrg(temp)
    const { success, result } = data
    if (success) {
      dispatch('handleResponseData', { data }, { root: true })
    } else {
      throw result.availableEmailList
    }
  },
  async setOrgUploadMail ({ state, dispatch }, params) {
    const { data } = await organizationApi.setOrgUploadMail({
      orgId: state.orgId,
      ...params
    })
    const { success, result } = data
    if (success) {
      dispatch('handleResponseData', { data }, { root: true })
    } else {
      throw result.availableEmailList
    }
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
  async checkOrgMemberExist ({ state }, params) {
    const { data } = await organizationApi.checkOrgMemberExist({
      orgId: state.orgId,
      ...params
    })
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
  async updateOrgLogo ({ state, dispatch }, formData) {
    const { data } = await organizationApi.updateOrgLogo(formData)
    dispatch('handleResponseData', { data }, { root: true })
  },
  async removeOrgLogo ({ state, dispatch }) {
    const { data } = await organizationApi.removeOrgLogo({
      orgId: state.orgId
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
  },
  async inviteToOrg ({ state, dispatch }, params) {
    const { data } = await organizationApi.inviteToOrg({
      orgId: state.orgId,
      ...params
    })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async joinOrgViaLink ({ dispatch }, params) {
    const { data } = await organizationApi.joinOrgViaLink(params)
    dispatch('handleResponseData', { data }, { root: true })
  },
  resetCreateForm ({ commit }) {
    commit('SET_createForm', {
      orgCategoryId: 1,
      countryCode: '',
      address: '',
      orgName: '',
      phone: '',
      phoneCountryCode: 'TW',
      fax: '',
      faxCountryCode: 'TW',
      uploadMaterialEmail: ''
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    orgLogo
  }
}
