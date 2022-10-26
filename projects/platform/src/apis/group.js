import axios from '@/apis'

const groupApiWrapper = (path, groupId = null, params = {}) => {
  const data = {}
  if (groupId) {
    data['groupId'] = groupId
  }
  Object.assign(data, params)
  return axios(path, { method: 'POST', data })
}

export default {
  /**
   * @param {object} params
   * @param {number} params.orgId
   * @param {string} params.groupName
   * @param {string} params.description
   * @param {string} params.labelColor
   * @param {string} params.uploadMaterialEmail
   */
  createGroup: (_, params) =>
    groupApiWrapper('/org/group/create', null, params),
  getGroup: (groupId) => groupApiWrapper('/org/group/get', groupId),
  /**
   * @param {object} params
   * @param {string} params.groupName
   * @param {string} params.description
   * @param {string} params.labelColor
   */
  updateGroup: (groupId, params) =>
    groupApiWrapper('/org/group/update', groupId, params),
  /**
   * @param {object} params
   * @param {number?} params.transferOrgId
   * @param {number?} params.transferGroupId
   */
  deleteGroup: (groupId, params) =>
    groupApiWrapper('/org/group/delete', groupId, params),
  getGroupUser: (groupId) => groupApiWrapper('/org/group/user/get', groupId),
  /**
   * @param {object} params
   * @param {number} params.email
   */
  cancelGroupInvitation: (groupId, params) =>
    groupApiWrapper('/org/group/member/cancel-invitation', groupId, params),
  /**
   * @param {object} params
   * @param {number} params.groupUserId
   * @param {number} params.roleId
   */
  changeGroupMemberRole: (_, params) =>
    groupApiWrapper('/org/group/member/change-role', null, params),
  /**
   * @param {object} params
   * @param {number} params.groupUserId
   */
  removeGroupMember: (_, params) =>
    groupApiWrapper('/org/group/member/delete-member', null, params),
  /**
   * @param {object} params
   * @param {number[]} params.orgUserIdList
   */
  addMemberToGroup: (groupId, params) =>
    groupApiWrapper('/org/group/member/add-members', groupId, params),
  /**
   * @param {object} params
   * @param {string[]} params.emailList
   */
  inviteToOrgFromGroup: (groupId, params) =>
    groupApiWrapper('/org/group/member/invite-via-email', groupId, params),
  /**
   * @param {object} params
   * @param {string} params.inviteCode
   */
  joinGroupViaLink: (_, params) =>
    groupApiWrapper('/org/group/member/join-via-link', null, params),
}
