import organizationList from '@/mocks/seeds/organization'
import groupList from '@/mocks/seeds/group'
import { ROLE_ID } from '@/utils/constants'

const deepClone = (data) => JSON.parse(JSON.stringify(data))

const successState = {
  success: true,
  message: {
    title: '',
    content: ''
  },
  result: {}
}

export default {
  createGroup: (req, res, ctx) => {
    const { orgId, groupName, labelColor, description, uploadMaterialEmail } = req.body
    const response = deepClone(successState)
    if ((/exist/).test(uploadMaterialEmail)) {
      response.success = false
      response.result.organization = null
      response.result.group = null
      response.result.availableEmailList = [
        'frontier',
        'frontier01',
        'frontier02'
      ]
      return res(
        ctx.status(200),
        ctx.json(response)
      )
    }

    const organization = organizationList.find(org => org.orgId === orgId)
    organization.groupList.push({
      groupId: groupList.length + 1,
      groupName,
      labelColor
    })

    const defaultGroupMemberList = organization.memberList
      .filter(member => member.orgRoleId === ROLE_ID.OWNER || member.orgRoleId === ROLE_ID.ADMIN)
      .map((member, index) => {
        delete member.orgUserId
        return {
          groupUserId: index,
          ...member
        }
      })
    const group = {
      groupId: groupList.length + 1,
      groupName,
      labelColor,
      description,
      inviteCode: `invite-code:${groupName}`,
      uploadMaterialEmail: '',
      memberList: defaultGroupMemberList,
      historyList: []
    }

    response.result.organization = organization
    response.result.group = group
    response.result.availableEmailList = null

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  getGroup: (req, res, ctx) => {
    const { groupId } = req.body
    const group = groupList.find(group => group.groupId === groupId)
    const response = deepClone(successState)

    response.result.group = group

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  updateGroup: (req, res, ctx) => {
    const { groupId } = req.body
    const group = groupList.find(group => group.groupId === groupId)
    Object.assign(group, req.body)

    const organization = organizationList.find(org => org.groupList.some(group => group.groupId === groupId))
    const orgGroupIndex = organization.groupList.findIndex(group => group.groupId === groupId)
    organization.groupList[orgGroupIndex] = {
      groupId,
      groupName: group.groupName,
      labelColor: group.labelColor
    }

    const response = deepClone(successState)
    response.result.group = group
    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  deleteGroup: (req, res, ctx) => {
    const { groupId } = req.body
    const organization = organizationList.find(org => org.groupList.some(group => group.groupId === groupId))
    const orgGroupIndex = organization.groupList.findIndex(group => group.groupId === groupId)
    organization.groupList.splice(orgGroupIndex, 1)

    const response = deepClone(successState)
    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  cancelGroupInvitation: (req, res, ctx) => {
    const { groupId, email } = req.body
    const group = groupList.find(group => group.groupId === groupId)

    const memberIndex = group.memberList.findIndex(member => member.email === email)
    group.memberList.splice(memberIndex, 1)

    const response = deepClone(successState)
    response.result.group = group

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  changeGroupMemberRole: (req, res, ctx) => {
    const { groupUserId, roleId } = req.body

    const group = groupList.find(group => group.memberList.some(member => member.groupUserId === groupUserId))
    const memberIndex = group.memberList.findIndex(member => member.groupUserId === groupUserId)
    group.memberList[memberIndex].groupRoleId = roleId

    const response = deepClone(successState)
    response.result.group = group

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  removeGroupMember: (req, res, ctx) => {
    const { groupUserId } = req.body
    const group = groupList.find(group => group.memberList.some(member => member.groupUserId === groupUserId))

    const memberIndex = group.memberList.findIndex(member => member.groupUserId === groupUserId)
    group.memberList.splice(memberIndex, 1)

    const response = deepClone(successState)
    response.result.group = group

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  addMemberToGroup: (req, res, ctx) => {
    const { groupId, orgUserIdList } = req.body
    const organization = organizationList.find(org => org.groupList.some(group => group.groupId === groupId))
    const addedMemberList = organization.memberList
      .filter(member => orgUserIdList.includes(member.orgUserId))
      .map(member => ({
        groupUserId: member.orgUserId + 100,
        groupRoleId: member.orgRoleId,
        ...member
      }))
    const group = groupList.find(group => group.groupId === groupId)
    group.memberList.push(...addedMemberList)
    const response = deepClone(successState)
    response.result.group = group

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  inviteToOrgFromGroup: (req, res, ctx) => {
    const { groupId, emailList } = req.body
    const group = groupList.find(group => group.groupId === groupId)
    const invitedMemberList = emailList.map((email, index) => {
      return (index === 0)
        ? {
          groupUserId: null,
          orgRoleId: null,
          groupRoleId: null,
          email,
          displayName: null,
          avatar: null,
          originalAvatar: null,
          lastSignInTime: null,
          isPending: true
        }
        : {
          groupUserId: index + 100,
          orgRoleId: ROLE_ID.MEMBER3,
          groupRoleId: ROLE_ID.MEMBER3,
          email,
          displayName: `New Member ${index}`,
          avatar: null,
          originalAvatar: null,
          lastSignInTime: '8小時前',
          isPending: false
        }
    })
    group.memberList.push(...invitedMemberList)
    const response = deepClone(successState)
    response.result.group = group

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  }
}
