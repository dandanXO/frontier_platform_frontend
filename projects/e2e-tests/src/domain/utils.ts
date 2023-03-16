import { nanoid } from 'nanoid'

export const makeId = () => {
  return nanoid()
}

export const randomString = (length: number, source: string) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += source.charAt(Math.floor(Math.random() * source.length))
  }

  return result.trim().length === 0 ? '/' : result
}

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

export const getUrl = (host: string, path: string) => new URL(path, host).href
