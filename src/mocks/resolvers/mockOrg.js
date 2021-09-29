import organizationList from '@/mocks/seeds/organization'
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
  createOrg: (req, res, ctx) => {
    const { uploadMaterialEmail } = req.body
    const response = deepClone(successState)
    if ((/exist/).test(uploadMaterialEmail)) {
      response.success = false
      response.result.organization = null
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

    const organization = Object.assign(organizationList[0], {
      orgId: organizationList.length + 1,
      orgNo: `00000100${organizationList.length + 1}`,
      ...req.body,
      memberList: [
        {
          orgUserId: 100,
          displayName: req.user.firstName + req.user.lastName,
          ...req.user
        }
      ],
      groupList: [],
      historyList: []
    })

    response.result.organization = organization
    response.result.availableEmailList = null
    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  setOrgUploadMail: (req, res, ctx) => {
    const { orgId, uploadMaterialEmail } = req.body
    const response = deepClone(successState)
    if ((/exist/).test(uploadMaterialEmail)) {
      response.success = false
      response.result.organization = null
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
    organization.uploadMaterialEmail = uploadMaterialEmail

    response.result.organization = organization
    response.result.availableEmailList = null
    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  getOrg: (req, res, ctx) => {
    const { orgId } = req.body

    const organization = organizationList.find(org => org.orgId === orgId)
    const response = deepClone(successState)

    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  getOrgUser: (req, res, ctx) => {
    const { orgId } = req.body
    const organization = organizationList.find(org => org.orgId === orgId)
    const orgUser = organization.memberList.find(member => member.email === req.user.email)
    const response = deepClone(successState)
    response.result.orgUser = orgUser

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  checkOrgNameExist: (req, res, ctx) => {
    const { orgName, orgId } = req.body
    const isExist = organizationList.filter(org => org.orgId !== orgId).some(org => org.orgName === orgName)
    const response = deepClone(successState)
    response.result.isExist = isExist

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  updateOrg: (req, res, ctx) => {
    const { orgId } = req.body
    const organization = organizationList.find(org => org.orgId === orgId)
    Object.assign(organization, req.body)
    const response = deepClone(successState)
    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  updateOrgLogo: (req, res, ctx) => {
    // const { orgId } = req.body
    // I'm not sure why orgId become string type instead of number, probably it's related to formData?
    // const organization = organizationList.find(org => org.orgId === toString(orgId))
    const organization = organizationList[0]
    Object.assign(organization, req.body)
    organization.logo = require('@/assets/images/cover.png')
    const response = deepClone(successState)
    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  removeOrgLogo: (req, res, ctx) => {
    // const { orgId } = req.body
    // const organization = organizationList.find(org => org.orgId === orgId)
    const organization = organizationList[0]
    Object.assign(organization, {
      logo: '',
      originalLogo: ''
    })
    const response = deepClone(successState)
    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  changeOrgMemberRole: (req, res, ctx) => {
    const { orgUserId, roleId } = req.body
    const orgId = req.user.organizationList[0].orgId
    const organization = organizationList.find(org => org.orgId === orgId)

    const memberIndex = organization.memberList.findIndex(member => member.orgUserId === orgUserId)
    organization.memberList[memberIndex].orgRoleId = roleId

    const response = deepClone(successState)
    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  removeOrgMember: (req, res, ctx) => {
    const { orgUserId } = req.body
    const orgId = req.user.organizationList[0].orgId
    const organization = organizationList.find(org => org.orgId === orgId)

    const memberIndex = organization.memberList.findIndex(member => member.orgUserId === orgUserId)
    organization.memberList.splice(memberIndex, 1)

    const response = deepClone(successState)
    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  cancelOrgInvitation: (req, res, ctx) => {
    const { orgId, email } = req.body
    const organization = organizationList.find(org => org.orgId === orgId)

    const memberIndex = organization.memberList.findIndex(member => member.email === email)
    organization.memberList.splice(memberIndex, 1)

    const response = deepClone(successState)
    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  checkOrgMemberExist: (req, res, ctx) => {
    const { orgId, email } = req.body
    const organization = organizationList.find(org => org.orgId === orgId)
    const isExist = organization.memberList.some(member => member.email === email)
    const response = deepClone(successState)
    response.result.isExist = isExist

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  inviteToOrg: (req, res, ctx) => {
    const { orgId, emailList } = req.body
    const organization = organizationList.find(org => org.orgId === orgId)

    const invitedMemberList = emailList.map((email, index) => {
      return (index === 0)
        ? {
          orgUserId: null,
          displayName: null,
          avatar: null,
          originalAvatar: null,
          email,
          orgRoleId: null,
          lastSignInTime: null,
          isPending: true
        }
        : {
          orgUserId: index + 100,
          displayName: `New Member ${index}`,
          avatar: null,
          originalAvatar: null,
          email,
          orgRoleId: ROLE_ID.MEMBER3,
          lastSignInTime: '8小時前',
          isPending: false
        }
    })

    organization.memberList.push(...invitedMemberList)

    const response = deepClone(successState)
    response.result.organization = organization

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  }
}
