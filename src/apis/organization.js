import axios from '@/apis'

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
  updateOrgLogo: (formData) => axios('/org/update-logo', {
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    data: formData
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
  })
}
