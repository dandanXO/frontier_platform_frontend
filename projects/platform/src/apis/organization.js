import axios from '@/apis'

const orgApiWrapper = (path, orgId = null, params = {}) => {
  const data = {}
  if (orgId) {
    data['orgId'] = orgId
  }
  Object.assign(data, params)
  return axios(path, { method: 'POST', data })
}

export default {
  /**
   * @param {object} params
   * @param {string} params.orgName
   * @param {number} params.orgCategoryId
   * @param {string} params.countryCode
   * @param {string} params.address
   * @param {string} params.phone
   * @param {string} params.phoneCountryCode
   * @param {string} params.fax
   * @param {string} params.faxCountryCode
   * @param {string} params.uploadMaterialEmail
   * @param {number} params.signupSourceType
   */
  createOrg: (_, params) => orgApiWrapper('/org/create', null, params),
  getOrg: (orgId) => orgApiWrapper('/org/get', orgId),
  /**
   * @param {object} params
   * @param {string} params.orgName
   * @param {string} params.labelColor
   * @param {number} params.orgCategoryId
   * @param {string} params.countryCode
   * @param {string} params.address
   * @param {string} params.phone
   * @param {string} params.phoneCountryCode
   * @param {string} params.fax
   * @param {string} params.faxCountryCode
   * @param {string} params.uploadMaterialEmail
   */
  updateOrg: (orgId, params) => orgApiWrapper('/org/update', orgId, params),
  /**
   * @param {object} params
   * @param {number} params.tempUploadId
   * @param {string} params.logoFileName
   * @param {string} params.originalLogoFileName
   */
  updateOrgLogo: (orgId, params) =>
    orgApiWrapper('/org/update-logo', orgId, params),
  removeOrgLogo: (orgId) => orgApiWrapper('/org/remove-logo', orgId),
  deleteOrg: (orgId) => orgApiWrapper('/org/delete', orgId),
  /**
   * @param {object} params
   * @param {string} params.orgName
   */
  checkOrgNameExist: (orgId = null, params) =>
    orgApiWrapper('/org/check-name-exist', orgId, params),
  getOrgUser: (orgId) => orgApiWrapper('/org/user/get', orgId),
  /**
   * @param {object} params
   * @param {string} params.displayName
   */
  updateDisplayName: (orgId, params) =>
    orgApiWrapper('/org/user/update-display-name', orgId, params),
  /**
   * @param {object} params
   * @param {number} params.tempUploadId
   * @param {string} params.avatarFileName
   * @param {string} params.originalAvatarFileName
   */
  updateAvatar: (orgId, params) =>
    orgApiWrapper('/org/user/update-avatar', orgId, params),
  removeAvatar: (orgId) => orgApiWrapper('/org/user/remove-avatar', orgId),
  readNotification: (orgId) =>
    orgApiWrapper('/org/user/read-notification', orgId),
  /**
   * @param {object} params
   * @param {string[]} params.emailList
   */
  orgInviteViaEmail: (orgId, params) =>
    orgApiWrapper('/org/member/invite-via-email', orgId, params),
  /**
   * @param {object} params
   * @param {string} params.email
   */
  cancelOrgInvitation: (orgId, params) =>
    orgApiWrapper('/org/member/cancel-invitation', orgId, params),
  /**
   * @param {object} params
   * @param {number} params.orgUserId
   * @param {number} params.roleId
   */
  changeOrgMemberRole: (_, params) =>
    orgApiWrapper('/org/member/change-role', null, params),
  /**
   * @param {object} params
   * @param {number} params.orgUserId
   */
  removeOrgMember: (_, params) =>
    orgApiWrapper('/org/member/delete', null, params),
  /**
   * @param {object} params
   * @param {string} params.email
   */
  checkOrgMemberExist: (orgId, params) =>
    orgApiWrapper('/org/member/check-exist', orgId, params),
  /**
   * @param {object} params
   * @param {string} params.inviteCode
   */
  joinOrgViaLink: (_, params) =>
    orgApiWrapper('/org/member/join-via-link', null, params),
  /**
   * @param {object} params
   * @param {string} params.uploadMaterialEmail
   */
  setOrgUploadMail: (orgId, params) =>
    orgApiWrapper('/org/create-upload-material-email', orgId, params),
  getPricing: () => orgApiWrapper('/org/payment/get-pricing'),
  /**
   * @param {object} params
   * @param {string} params.recipient
   * @param {string} params.email
   * @param {string} params.countryCode
   * @param {string} params.zipCode
   * @param {string} params.city
   * @param {string} params.address
   */
  updateBillingInfo: (orgId, params) =>
    orgApiWrapper('/org/payment/billing-info/update', orgId, params),
  getStripeClientSecret: (orgId) =>
    orgApiWrapper('/org/payment/card-info/create-setup', orgId),
  /**
   * @param {object} params
   * @param {string} params.clientSecret
   * @param {string} params.cardHolderName
   */
  setCardHolderName: (orgId, params) =>
    orgApiWrapper('/org/payment/card-info/setup-customer', orgId, params),
  upgradePlan: (orgId) => orgApiWrapper('/org/plan/upgrade', orgId),
  getChargingOfUpgradePlan: (orgId) =>
    orgApiWrapper('/org/plan/upgrade/get-estimate-charging', orgId),
  /**
   * @param {object} params
   * @param {string} params.name
   * @param {string} params.email
   * @param {string} params.phone
   * @param {string} params.phoneCountryCode
   * @param {string} params.description
   */
  requestUpgradeToEnterprise: (orgId, params) =>
    orgApiWrapper('/org/plan/upgrade-request', orgId, params),
  /**
   * @param {object} params
   * @param {number} params.setQty
   */
  purchaseMaterial: (orgId, params) =>
    orgApiWrapper('/org/plan/purchase/material', orgId, params),
  /**
   * @param {object} params
   * @param {number} params.setQty
   */
  getChargingOfPurchaseMaterial: (orgId, params) =>
    orgApiWrapper(
      '/org/plan/purchase/material/get-estimate-charging',
      orgId,
      params
    ),
  /**
   * @param {object} params
   * @param {number} params.setQty
   */
  cancelMaterial: (orgId, params) =>
    orgApiWrapper('/org/plan/cancel/material', orgId, params),
  /**
   * @param {object} params
   * @param {number} params.setQty
   */
  purchaseU3m: (orgId, params) =>
    orgApiWrapper('/org/plan/purchase/u3m', orgId, params),
  /**
   * @param {object} params
   * @param {string} params.startDate
   * @param {string} params.endDate
   * @param {number} params.category
   * @param {string} params.keyword
   * @param {object} params.pagination
   */
  getInvoiceList: (orgId, params) =>
    orgApiWrapper('/org/payment/invoice/get-list', orgId, params),
  /**
   * @param {object} params
   * @param {number} params.invoiceId
   */
  getInvoiceDetail: (orgId, params) =>
    orgApiWrapper('/org/payment/invoice/get', orgId, params),
  /**
   * @param {object} params
   * @param {number} params.invoiceId
   * @param {string} params.recipient
   * @param {string} params.email
   * @param {string} params.countryCode
   * @param {string} params.zipCode
   * @param {string} params.city
   * @param {string} params.address
   */
  updateInvoiceBillingInfo: (orgId, params) =>
    orgApiWrapper('/org/payment/invoice/update-billing-info', orgId, params),
  getUnbilledInfo: (orgId) =>
    orgApiWrapper('/org/payment/get-unbilled-info', orgId),
  getLastMonthUnbilledInfo: (orgId) =>
    orgApiWrapper('/org/payment/get-last-month-unbilled-info', orgId),
  payLastMonthUnbilledInfo: (orgId) =>
    orgApiWrapper('/org/payment/pay-last-month-unbilled-info', orgId),
  deactivateOrg: (orgId) => orgApiWrapper('/org/plan/deactivate', orgId),
  activateOrg: (orgId) => orgApiWrapper('/org/plan/activate', orgId),

  /**
   * @param {object} params
   * @param {string} params.orgName
   * @param {number} params.orgCategoryId
   * @param {string} params.name
   * @param {string} params.jobTitle
   * @param {number} params.phoneCountryCode
   * @param {string} params.phone
   * @param {string} params.email
   * @param {string} params.message
   * @param {array} params.attachmentList - [{tempUploadId, fileName}]
   */
  made2flowScheduleMeeting: (orgId, params) =>
    orgApiWrapper(
      '/org/value-added-service/made2flow/schedule-meeting',
      orgId,
      params
    ),
}
