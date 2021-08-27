import code from '@/mocks/seeds/code'

const deepClone = (data) => JSON.parse(JSON.stringify(data))

const successState = {
  success: true,
  message: {
    title: '',
    content: ''
  },
  result: {
    code: {}
  }
}

export default {
  getCountryList: (req, res, ctx) => {
    const response = deepClone(successState)
    response.result.code.countryList = code.countryList

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  getOrgCategoryList: (req, res, ctx) => {
    const response = deepClone(successState)
    response.result.code.orgCategoryList = code.orgCategoryList

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  getRoleList: (req, res, ctx) => {
    const response = deepClone(successState)
    response.result.code.roleList = code.roleList

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  getRoleLimitTable: (req, res, ctx) => {
    const response = deepClone(successState)
    response.result.code.roleLimit = code.roleLimit

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  }
}
