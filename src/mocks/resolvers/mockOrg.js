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
  }
}
