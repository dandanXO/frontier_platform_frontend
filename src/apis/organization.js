import axios from '@/apis'
import putBinaryData from '@/utils/put-binary-data'

export default {
  createOrg: ({ orgName, orgCategoryId, countryCode, address, phone, phoneCountryCode, fax, faxCountryCode, uploadMaterialEmail }) => axios('/org/create', {
    method: 'POST',
    data: { orgName, orgCategoryId, countryCode, address, phone, phoneCountryCode, fax, faxCountryCode, uploadMaterialEmail }
  }),
  getOrg: ({ orgId }) => axios('/org/get', {
    method: 'POST',
    data: { orgId }
  }),
  updateOrg: ({ orgId, orgName, labelColor, orgCategoryId, countryCode, address, phone, phoneCountryCode, fax, faxCountryCode }) => axios('/org/update', {
    method: 'POST',
    data: { orgId, orgName, labelColor, orgCategoryId, countryCode, address, phone, phoneCountryCode, fax, faxCountryCode }
  }),
  /**
   * @param {formData} formData
   * @param {number} formData.orgId
   * @param {binary} formData.logo
   * @param {binary} formData.originalLogo
   */
  updateOrgLogo: async ({ orgId, logo, originalLogo }) => {
    const logoFileName = logo.name
    const originalLogoFileName = originalLogo.name

    const { data: { result: { tempUploadId, logoUploadUrl, originalLogoUploadUrl } } } = await axios('/org/update-logo/get-upload-url', {
      method: 'POST',
      data: { logoFileName, originalLogoFileName }
    })
    await putBinaryData(logoUploadUrl, logo)
    await putBinaryData(originalLogoUploadUrl, originalLogo)

    return axios('/org/update-logo', {
      method: 'POST',
      data: { orgId, tempUploadId, logoFileName, originalLogoFileName }
    })
  },
  removeOrgLogo: ({ orgId }) => axios('/org/remove-logo', {
    method: 'POST',
    data: { orgId }
  }),
  deleteOrg: ({ orgId }) => axios('/org/delete', {
    method: 'POST',
    data: { orgId }
  }),
  checkOrgNameExist: ({ orgName, orgId = null }) => axios('/org/check-name-exist', {
    method: 'POST',
    data: { orgName, orgId }
  }),
  orgInviteViaEmail: ({ orgId, emailList }) => axios('/org/member/invite-via-email', {
    method: 'POST',
    data: { orgId, emailList }
  }),
  cancelOrgInvitation: ({ orgId, email }) => axios('/org/member/cancel-invitation', {
    method: 'POST',
    data: { orgId, email }
  }),
  changeOrgMemberRole: ({ orgUserId, roleId }) => axios('/org/member/change-role', {
    method: 'POST',
    data: { orgUserId, roleId }
  }),
  removeOrgMember: ({ orgUserId }) => axios('/org/member/delete', {
    method: 'POST',
    data: { orgUserId }
  }),
  checkOrgMemberExist: ({ orgId, email }) => axios('/org/member/check-exist', {
    method: 'POST',
    data: { orgId, email }
  }),
  inviteToOrg: ({ orgId, emailList }) => axios('/org/member/invite-via-email', {
    method: 'POST',
    data: { orgId, emailList }
  }),
  joinOrgViaLink: ({ inviteCode }) => axios('/org/member/join-via-link', {
    method: 'POST',
    data: { inviteCode }
  }),
  setOrgUploadMail: ({ orgId, uploadMaterialEmail }) => axios('/org/create-upload-material-email', {
    method: 'POST',
    data: { orgId, uploadMaterialEmail }
  }),
  getPricing: () => axios('/org/payment/get-pricing', {
    method: 'POST',
    data: {}
  }),
  updateBillingInfo: ({ orgId, recipient, email, countryCode, city, zipCode, address }) => axios('/org/payment/billing-info/update', {
    method: 'POST',
    data: { orgId, recipient, email, countryCode, city, zipCode, address }
  })
}
