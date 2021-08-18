import organizationList from '@/mocks/seeds/organization'

const deepClone = (data) => JSON.parse(JSON.stringify(data))

// const errorState = {
//   message: {
//     title: '',
//     content: ''
//   }
// }

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
  }
}
