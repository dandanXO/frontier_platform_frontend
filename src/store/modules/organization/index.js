import organizationApi from '@/apis/organization'
import setVuexState from '@/utils/set-vuex-state'
import { PLAN_TYPE, PLAN_STATUS } from '@/utils/constants.js'
import i18n from '@/utils/i18n'
import dayjs from 'dayjs'

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
  workspaceNodeId: null,
  memberList: [],
  groupList: [],
  historyList: [],
  plan: {
    planType: PLAN_TYPE.BASIC,
    activatedStatus: PLAN_STATUS.ACTIVE,
    renewDate: '',
    quota: {
      material: {
        used: 0,
        max: ''
      },
      u3m: {
        used: '',
        max: ''
      },
      member: {
        used: '',
        max: ''
      }
    },
  },
  paymentDetail: {
    cardInfo: {
      lastFour: '',
      expiredDate: '',
      cardHolderName: ''
    },
    billingInfo: {
      recipient: '',
      email: '',
      countryCode: '',
      zipCode: '',
      city: '',
      address: ''
    }
  },
  pricing: {
    basic: {
      planPrice: 0,
      materialUnit: 100,
      materialPrice: 20,
      materialFreeQuota: 50,
      materialUpgradeAlert: 2000,
      u3mUnit: 100,
      u3mPrice: 20,
      u3mFreeQty: 10
    },
    pro: {
      planPrice: 0,
      memberPrice: 0,
      materialUnit: 100,
      materialPrice: 20,
      materialFreeQuota: 50,
      u3mUnit: 100,
      u3mPrice: 20,
      u3mMonthFreeQty: 10
    }
  },

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
  orgLogo: state => state.logo,
  orgId: state => state.orgId,
  orgNo: state => state.orgNo,
  uploadMaterialEmail: state => state.uploadMaterialEmail,
  memberList: state => state.memberList,
  groupList: state => state.groupList,
  historyList: state => state.historyList,
  createForm: state => state.createForm,
  plan: state => state.plan,
  planName: (state, getters) => {
    const { BASIC, PRO, ENT } = PLAN_TYPE
    const obj = {
      [BASIC]: i18n.global.t('RR0159'),
      [PRO]: i18n.global.t('RR0160'),
      [ENT]: i18n.global.t('RR0161')
    }
    return obj[getters.plan.planType]
  },
  paymentDetail: state => state.paymentDetail,
  noBindingPayment: (state, getters) => !getters.paymentDetail.cardInfo,
  pricing: state => state.pricing
}

const mutations = {
  SET_createForm (state, data) {
    Object.assign(state.createForm, data)
  },
  SET_createForm_uploadMaterialEmail (state, uploadMaterialEmail) {
    state.createForm.uploadMaterialEmail = uploadMaterialEmail
  },
  SET_pricing (state, pricing) {
    state.pricing = pricing
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
    if (data.success) {
      dispatch('handleResponseData', { data }, { root: true })
    }
    return data
  },
  async setOrgUploadMail ({ state, dispatch }, params) {
    const { data } = await organizationApi.setOrgUploadMail({
      orgId: state.orgId,
      ...params
    })
    if (data.success) {
      dispatch('handleResponseData', { data }, { root: true })
    }
    return data
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
  async deleteOrg ({ state, dispatch }) {
    const { data } = await organizationApi.deleteOrg({
      orgId: state.orgId
    })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async updateOrgLogo ({ state, dispatch }, { logo, originalLogo }) {
    const { data } = await organizationApi.updateOrgLogo({ orgId: state.orgId, logo, originalLogo })
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
  },
  async getPricing ({ commit }) {
    const { data } = await organizationApi.getPricing()
    commit('SET_pricing', data.result.pricing)
  },
  async updateBillingInfo ({ state, dispatch }, params) {
    const { data } = await organizationApi.updateBillingInfo({ orgId: state.orgId, ...params })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async getStripeClientSecret ({ state }) {
    const { data } = await organizationApi.getStripeClientSecret({ orgId: state.orgId })
    return data.result.clientSecret
  },
  async setCardHolderName ({ state }, params) {
    await organizationApi.setCardHolderName({
      orgId: state.orgId,
      ...params
    })
  },
  async upgradePlan ({ state, dispatch }) {
    const { data } = await organizationApi.upgradePlan({ orgId: state.orgId })
    dispatch('handleResponseData', { data }, { root: true })
    return data
  },
  async requestUpgradeToEnterprise ({ state }, params) {
    await organizationApi.requestUpgradeToEnterprise({ orgId: state.orgId, ...params })
  },
  async purchaseMaterial ({ state, dispatch }, { setQty }) {
    const { data } = await organizationApi.purchaseMaterial({ orgId: state.orgId, setQty })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async cancelMaterial ({ state, dispatch }, { setQty }) {
    const { data } = await organizationApi.cancelMaterial({ orgId: state.orgId, setQty })
    dispatch('handleResponseData', { data }, { root: true })
  },
  async purchaseU3m ({ state, dispatch }, { setQty }) {
    const { data } = await organizationApi.purchaseU3m({ orgId: state.orgId, setQty })
    dispatch('handleResponseData', { data }, { root: true })
    return data
  },
  async getInvoiceList ({ state, dispatch }, params) {
    if (params.startDate?.length > 0) {
      params.startDate = dayjs(params.startDate).format('YYYY/MM/DD')
    }

    if (params.endDate?.length > 0) {
      params.endDate = dayjs(params.endDate).format('YYYY/MM/DD')
    }

    const { data } = await organizationApi.getInvoiceList({ orgId: state.orgId, ...params })
    dispatch('handleResponseData', { data }, { root: true })
    return data.result
  },
  async getInvoiceDetail ({ state, dispatch }, { invoiceId }) {
    const { data } = await organizationApi.getInvoiceDetail({ orgId: state.orgId, invoiceId })
    dispatch('handleResponseData', { data }, { root: true })
    return data.result
  },
  async updateInvoiceBillingInfo ({ state }, params) {
    const { data } = await organizationApi.updateInvoiceBillingInfo({ orgId: state.orgId, ...params })
    return data.result
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
