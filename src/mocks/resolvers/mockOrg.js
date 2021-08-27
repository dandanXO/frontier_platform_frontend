import organizationList from '@/mocks/seeds/organization'

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
  changeOrgMemberRole: (req, res, ctx) => {
    const { orgUserId, roleId } = req.body
    const orgId = req.user.organizationList[0].orgId
    const organization = organizationList.find(org => org.orgId === orgId)

    const memberIndex = organization.memberList.findIndex(member => member.orgUserId === orgUserId)
    organization.memberList[memberIndex].roleId = roleId

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
  }
}
