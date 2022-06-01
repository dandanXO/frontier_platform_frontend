import axios from '@/apis'

export default {
  createGroup: ({ orgId, groupName, description = '', labelColor, uploadMaterialEmail }) => axios('/org/group/create', {
    method: 'POST',
    data: { orgId, groupName, description, labelColor, uploadMaterialEmail }
  }),
  getGroup: ({ groupId }) => axios('/org/group/get', {
    method: 'POST',
    data: { groupId: Number(groupId) }
  }),
  updateGroup: ({ groupId, groupName, description, labelColor }) => axios('/org/group/update', {
    method: 'POST',
    data: { groupId, groupName, description, labelColor }
  }),
  deleteGroup: ({ groupId, transferOrgId, transferGroupId }) => axios('/org/group/delete', {
    method: 'POST',
    data: { groupId, transferOrgId, transferGroupId }
  }),
  getGroupUser: ({ groupId }) => axios('/org/group/user/get', {
    method: 'POST',
    data: { groupId }
  }),
  cancelGroupInvitation: ({ groupId, email }) => axios('/org/group/member/cancel-invitation', {
    method: 'POST',
    data: { groupId, email }
  }),
  changeGroupMemberRole: ({ groupUserId, roleId }) => axios('/org/group/member/change-role', {
    method: 'POST',
    data: { groupUserId, roleId }
  }),
  removeGroupMember: ({ groupUserId }) => axios('/org/group/member/delete-member', {
    method: 'POST',
    data: { groupUserId }
  }),
  addMemberToGroup: ({ groupId, orgUserIdList }) => axios('/org/group/member/add-members', {
    method: 'POST',
    data: { groupId, orgUserIdList }
  }),
  inviteToOrgFromGroup: ({ groupId, emailList }) => axios('/org/group/member/invite-via-email', {
    method: 'POST',
    data: { groupId, emailList }
  }),
  joinGroupViaLink: ({ inviteCode }) => axios('/org/group/member/join-via-link', {
    method: 'POST',
    data: { inviteCode }
  })
}
