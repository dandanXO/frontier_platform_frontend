import userList from '@/mocks/seeds/user'

const deepClone = (data) => JSON.parse(JSON.stringify(data))

const errorState = {
  message: {
    title: '',
    content: ''
  }
}

const successState = {
  success: true,
  message: {
    title: '',
    content: ''
  },
  result: {}
}

export default {
  generalLogin: (req, res, ctx) => {
    const { email } = req.body

    const user = userList.find(user => user.email === email)
    const response = deepClone(successState)

    if (user === undefined) {
      response.success = false
      response.message.content = '帳號或密碼錯誤'
    } else {
      response.result.isOldUser = user.isOldUser
      sessionStorage.setItem('accessToken', email)
      sessionStorage.setItem('refreshToken', email)
    }

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  getUser: (req, res, ctx) => {
    const response = deepClone(successState)
    response.result.user = req.user

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  checkEmailExist: (req, res, ctx) => {
    const response = deepClone(successState)

    const { email } = req.body
    const isExist = userList.some(user => user.email === email)

    response.result.isExist = isExist

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  changePassword: (req, res, ctx) => {
    const response = deepClone(successState)
    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  sendForgotPasswordEmail: (req, res, ctx) => {
    const { email } = req.body
    sessionStorage.setItem('emailForgotPassword', email)
    const response = deepClone(successState)
    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  verifyForgotPasswordCode: (req, res, ctx) => {
    const { verifyCode } = req.body

    const response = deepClone(successState)

    if (verifyCode === '012345') {
      response.result = {
        verifyToken: 'verifyToken'
      }
    } else if (verifyCode === '543210') {
      response.success = false
      response.message.content = '驗證碼過期'
    } else {
      response.success = false
      response.message.content = '驗證碼錯誤'
    }

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  },
  resetPassword: (req, res, ctx) => {
    const { verifyToken } = req.body

    if (verifyToken !== 'verifyToken') {
      const response = deepClone(errorState)
      response.message.content = '驗證 Token 錯誤'
      return res(
        ctx.status(400),
        ctx.json(response)
      )
    } else {
      const response = deepClone(successState)
      const email = sessionStorage.getItem('emailForgotPassword')
      sessionStorage.setItem('accessToken', email)
      sessionStorage.setItem('refreshToken', email)
      return res(
        ctx.status(200),
        ctx.json(response)
      )
    }
  }
}
