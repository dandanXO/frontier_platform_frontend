import { getUrl } from "./utils"

export const port = 8080
export const host = `http://localhost:${port}`
export const apiUrl = "https://textile-webapi-dev.frontier.cool"

export const paths = {
  index: "/",
  signIn: `/sign-in`,
  signUp: `/sign-up`,
}

export const urls = Object.keys(paths).reduce((result, key) => {
  return { ...result, [key]: getUrl(host, paths[key]) }
}, {} as typeof paths)
