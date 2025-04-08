import organizationApi from '@/apis/organization'
import orgUser from '@/store/modules/management/organization/orgUser.js'
import { putBinaryData } from '@/utils/fileUpload'
import { SIGNUP_SOURCE } from '@/utils/constants'
import axios from '@/apis'
import { setDefaultTrackerProperties, toYYYYMMDDFormat } from '@frontier/lib'

export default {
  namespaced: true,
  modules: {
    orgUser,
  },
  state: () => ({
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
    materialAttachmentUploadSizeLimit: 0,
    paymentDetail: {
      cardInfo: {
        lastFour: '',
        expiredDate: '',
        cardHolderName: '',
      },
      billingInfo: {
        recipient: '',
        email: '',
        countryCode: '',
        zipCode: '',
        city: '',
        address: '',
      },
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
        u3mFreeQty: 10,
      },
      pro: {
        planPrice: 0,
        memberPrice: 0,
        materialUnit: 100,
        materialPrice: 20,
        materialFreeQuota: 50,
        u3mUnit: 100,
        u3mPrice: 20,
        u3mMonthFreeQty: 10,
      },
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
      uploadMaterialEmail: '',
      signupSourceType: SIGNUP_SOURCE.NORMAL,
    },
  }),
  getters: {
    organization: (state) => state,
    orgLogo: (state) => state.logo,
    orgId: (state) => state.orgId,
    orgNo: (state) => state.orgNo,
    uploadMaterialEmail: (state) => state.uploadMaterialEmail,
    memberList: (state) => state.memberList,
    groupList: (state) => state.groupList,
    historyList: (state) => state.historyList,
    createForm: (state) => state.createForm,
    paymentDetail: (state) => state.paymentDetail,
    noBindingPayment: (state, getters) => !getters.paymentDetail.cardInfo,
    pricing: (state) => state.pricing,
    materialAttachmentUploadSizeLimit: (state) =>
      state.materialAttachmentUploadSizeLimit,
  },
  mutations: {
    SET_organization(state, organization) {
      Object.assign(state, organization)
    },
    SET_createForm(state, data) {
      Object.assign(state.createForm, data)
    },
    SET_createForm_uploadMaterialEmail(state, uploadMaterialEmail) {
      state.createForm.uploadMaterialEmail = uploadMaterialEmail
    },
    SET_pricing(state, pricing) {
      state.pricing = pricing
    },
  },
  actions: {
    async callOrgApi({ getters }, { func, params = {} }) {
      return await organizationApi[func](getters.orgId, params)
    },
    setOrganization({ commit }, data) {
      const { orgId, orgName } = data
      setDefaultTrackerProperties({
        orgId,
        orgName,
      })
      commit('SET_organization', data)
    },
    async createOrg({ state, dispatch }) {
      const temp = {}
      Object.keys(state.createForm).forEach((key) => {
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

      const { data } = await dispatch('callOrgApi', {
        func: 'createOrg',
        params: temp,
      })
      if (data.success) {
        dispatch('setOrganization', data.result.organization)
      }
      return data
    },
    async setOrgUploadMail({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'setOrgUploadMail',
        params,
      })
      if (data.success) {
        dispatch('setOrganization', data.result.organization)
      }
      return data
    },
    async getOrg({ rootGetters, dispatch }, { orgNo }) {
      const orgId =
        rootGetters['user/organizationList'].find((org) => org.orgNo === orgNo)
          ?.orgId || null
      const { data } = await organizationApi.getOrg(orgId)

      dispatch(
        'permission/updateFeatureFlag',
        data.result.organization.featureFlagList,
        { root: true }
      )

      dispatch('setOrganization', data.result.organization)
    },
    async checkOrgNameExist(_, { orgId, orgName }) {
      const { data } = await organizationApi.checkOrgNameExist(orgId, {
        orgName,
      })
      return data.result.isExist
    },
    async checkOrgMemberExist({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'checkOrgMemberExist',
        params,
      })
      return data.result.isExist
    },
    async updateOrg({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'updateOrg',
        params,
      })
      dispatch('setOrganization', data.result.organization)
    },
    async deleteOrg({ dispatch }) {
      const { data } = await dispatch('callOrgApi', { func: 'deleteOrg' })
      return data
    },
    async updateOrgLogo({ getters, dispatch }, { logo, originalLogo }) {
      const logoFileName = logo.name
      const originalLogoFileName = originalLogo.name

      const {
        data: {
          result: { tempUploadId, logoUploadUrl, originalLogoUploadUrl },
        },
      } = await axios('/org/update-logo/get-upload-url', {
        method: 'POST',
        data: { orgId: getters.orgId, logoFileName, originalLogoFileName },
      })
      await putBinaryData(logoUploadUrl, logo)
      await putBinaryData(originalLogoUploadUrl, originalLogo)

      const { data } = await dispatch('callOrgApi', {
        func: 'updateOrgLogo',
        params: { tempUploadId, logoFileName, originalLogoFileName },
      })
      dispatch('setOrganization', data.result.organization)
    },
    async removeOrgLogo({ dispatch }) {
      const { data } = await dispatch('callOrgApi', { func: 'removeOrgLogo' })
      dispatch('setOrganization', data.result.organization)
    },
    async changeOrgMemberRole({ dispatch }, params) {
      await dispatch('callOrgApi', {
        func: 'changeOrgMemberRole',
        params,
      })
    },
    async removeOrgMember({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'removeOrgMember',
        params,
      })
      dispatch('setOrganization', data.result.organization)
    },
    async cancelOrgInvitation({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'cancelOrgInvitation',
        params,
      })
      dispatch('setOrganization', data.result.organization)
    },
    async orgInviteViaEmail({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'orgInviteViaEmail',
        params,
      })
      dispatch('setOrganization', data.result.organization)
    },
    async joinOrgViaLink({ dispatch }, params) {
      await dispatch('callOrgApi', {
        func: 'joinOrgViaLink',
        params,
      })
    },
    resetCreateForm({ commit }) {
      commit('SET_createForm', {
        orgCategoryId: 1,
        countryCode: '',
        address: '',
        orgName: '',
        phone: '',
        phoneCountryCode: 'TW',
        fax: '',
        faxCountryCode: 'TW',
        uploadMaterialEmail: '',
      })
    },
    async getPricing({ commit, dispatch }) {
      const { data } = await dispatch('callOrgApi', { func: 'getPricing' })
      commit('SET_pricing', data.result.pricing)
    },
    async updateBillingInfo({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'updateBillingInfo',
        params,
      })
      dispatch('setOrganization', data.result.organization)
    },
    async getStripeClientSecret({ dispatch }) {
      const { data } = await dispatch('callOrgApi', {
        func: 'getStripeClientSecret',
      })
      return data.result.clientSecret
    },
    async setCardHolderName({ dispatch }, params) {
      await dispatch('callOrgApi', { func: 'setCardHolderName', params })
    },
    async upgradePlan({ dispatch }) {
      const { data } = await dispatch('callOrgApi', { func: 'upgradePlan' })
      dispatch('setOrganization', data.result.organization)
      return data
    },
    async unsubscribeDesignerPlan({ dispatch }) {
      const { data } = await dispatch('callOrgApi', {
        func: 'unsubscribeDesignerPlan',
      })
      dispatch('setOrganization', data.result.organization)
      return data.result.subscribeDateTo
    },
    async getChargingOfUpgradePlan({ dispatch }) {
      const { data } = await dispatch('callOrgApi', {
        func: 'getChargingOfUpgradePlan',
      })
      return data.result
    },
    async requestUpgradeToEnterprise({ dispatch }, params) {
      await dispatch('callOrgApi', {
        func: 'requestUpgradeToEnterprise',
        params,
      })
    },
    async purchaseMaterial({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'purchaseMaterial',
        params,
      })
      dispatch('setOrganization', data.result.organization)
    },
    async getChargingOfPurchaseMaterial({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'getChargingOfPurchaseMaterial',
        params,
      })
      return data.result
    },
    async cancelMaterial({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'cancelMaterial',
        params,
      })
      dispatch('setOrganization', data.result.organization)
    },
    async purchaseU3m({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'purchaseU3m',
        params,
      })
      dispatch('setOrganization', data.result.organization)
      return data
    },
    async getInvoiceList({ dispatch }, params) {
      if (params.startDate?.length > 0) {
        params.startDate = toYYYYMMDDFormat('YYYY/MM/DD')
      }

      if (params.endDate?.length > 0) {
        params.endDate = toYYYYMMDDFormat('YYYY/MM/DD')
      }

      const { data } = await dispatch('callOrgApi', {
        func: 'getInvoiceList',
        params,
      })
      return data.result
    },
    async getInvoiceDetail({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'getInvoiceDetail',
        params,
      })
      dispatch('setOrganization', data.result.organization)
      return data.result
    },
    async updateInvoiceBillingInfo({ dispatch }, params) {
      const { data } = await dispatch('callOrgApi', {
        func: 'updateInvoiceBillingInfo',
        params,
      })
      return data.result
    },
    async getUnbilledInfo({ dispatch }) {
      const { data } = await dispatch('callOrgApi', { func: 'getUnbilledInfo' })
      return data
    },
    async getLastMonthUnbilledInfo({ dispatch }) {
      const { data } = await dispatch('callOrgApi', {
        func: 'getLastMonthUnbilledInfo',
      })
      return data
    },
    async payLastMonthUnbilledInfo({ dispatch }) {
      const { data } = await dispatch('callOrgApi', {
        func: 'payLastMonthUnbilledInfo',
      })
      dispatch('setOrganization', data.result.organization)
      return data
    },
    async deactivateOrg({ dispatch }) {
      const { data } = await dispatch('callOrgApi', { func: 'deactivateOrg' })
      dispatch('setOrganization', data.result.organization)
      return data
    },
    async activateOrg({ dispatch }) {
      const { data } = await dispatch('callOrgApi', { func: 'activateOrg' })
      dispatch('setOrganization', data.result.organization)
    },
    async made2flowScheduleMeeting({ dispatch }, params) {
      const { attachmentFileList } = params
      const attachmentList = await Promise.all(
        attachmentFileList.map((attachment) =>
          dispatch(
            'uploadFileToS3',
            { fileName: attachment.name, file: attachment },
            { root: true }
          )
        )
      )
      const tempParams = { ...params, attachmentList }
      delete tempParams.attachmentFileList

      await dispatch('callOrgApi', {
        func: 'made2flowScheduleMeeting',
        params: tempParams,
      })
    },
  },
}
