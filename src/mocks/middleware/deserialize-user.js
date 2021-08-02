import users from '@/mocks/seeds/user'

const deepClone = (data) => JSON.parse(JSON.stringify(data))

export default (resolver) => {
  return (req, res, ctx) => {
    const email = sessionStorage.getItem('accessToken')
    const user = deepClone(users).find(user => user.email === email)

    if (user === undefined) {
      return res(ctx.status(401))
    }

    req.user = user
    return resolver(req, res, ctx)
  }
}
