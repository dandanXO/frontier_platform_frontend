// src/mocks/handlers.js
import { rest } from 'msw'

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
  // rest.post(BASE_URL + '/sign-in/general', (req, res, ctx) => {
  //   // Persist user's authentication in the session
  //   sessionStorage.setItem('is-authenticated', 'true')
  //   return res(
  //     // Respond with a 200 status code
  //     ctx.status(200)
  //   )
  // }),
  // Handles a GET /user request
  rest.post(BASE_URL + '/user/get', (req, res, ctx) => {
    // const isAuthenticated = sessionStorage.getItem('is-authenticated')

    // if (!isAuthenticated) {
    //   // If not authenticated, respond with a 403 error
    //   return res(
    //     ctx.status(401)
    //   )
    // }
    // If authenticated, return a mocked user details
    const response = deepClone(initialState)
    response.user = {
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
  })
]
