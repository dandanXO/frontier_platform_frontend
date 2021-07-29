import { rest } from 'msw'
import { generalLogin, changePassword } from '@/mocks/resolvers/mockUser'

const BASE_URL = process.env.VUE_APP_API_ENDPOINT

const initialState = {
  success: true,
  message: {
    title: '',
    content: ''
  },
  result: {}
}

const deepClone = (data) => JSON.parse(JSON.stringify(data))

export const handlers = [
  rest.post(BASE_URL + '/sign-in/general', generalLogin),
  rest.post(BASE_URL + '/user/get', (req, res, ctx) => {
    const response = deepClone(initialState)
    response.result.user = {
      lastName: 'Mia',
      firstName: 'Yang',
      displayName: 'Mia Yang',
      avatar: 'https://picsum.photos/200',
      email: 'mia.yang@frontier.cool',
      isVerify: true, // 是否驗證
      locale: 'zh-TW'
    }

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  }),
  rest.post(BASE_URL + '/user/check-email-exist', (req, res, ctx) => {
    const response = deepClone(initialState)

    const { email } = req.body
    const isExist = (/exist/ig).test(email)

    response.result.isExist = isExist

    return res(
      ctx.status(200),
      ctx.json(response)
    )
  }),
  rest.post(BASE_URL + '/user/change-password', changePassword)
]
