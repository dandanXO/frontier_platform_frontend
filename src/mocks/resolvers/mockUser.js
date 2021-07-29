const initialState = {
  success: true,
  message: {
    title: '',
    content: ''
  },
  result: {}
}

const deepClone = (data) => JSON.parse(JSON.stringify(data))

const users = [
  {
    lastName: 'Mia',
    firstName: 'Yang',
    displayName: 'Mia Yang',
    avatar: 'https://picsum.photos/200',
    email: 'mia.yang@frontier.cool',
    isVerify: true, // 是否驗證
    locale: 'zh-TW',
    isOldUser: false
  },
  {
    lastName: 'Old',
    firstName: 'User',
    displayName: 'Old User',
    avatar: 'https://picsum.photos/200',
    email: 'oldUser@frontier.cool',
    isVerify: true, // 是否驗證
    locale: 'zh-TW',
    isOldUser: true
  }
]

const generalLogin = (req, res, ctx) => {
  const { email } = req.body

  const user = users.find(user => user.email === email)
  const response = deepClone(initialState)

  if (user === undefined) {
    response.success = false
    response.message.content = '帳號或密碼錯誤'
  } else {
    response.result = {
      isOldUser: user.isOldUser,
      accessToken: 'access',
      refreshToken: 'refresh'
    }
  }

  return res(
    ctx.status(200),
    ctx.json(response)
  )
}

const changePassword = (req, res, ctx) => {
  const response = deepClone(initialState)
  return res(
    ctx.status(200),
    ctx.json(response)
  )
}

export { generalLogin, changePassword }
