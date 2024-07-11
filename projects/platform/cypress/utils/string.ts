import { TEST_DATA } from '../constants'

const { ALPHA_NUMBERIC } = TEST_DATA

export function generateRandomString(length: number) {
  let result = ''
  const charactersLength = ALPHA_NUMBERIC.length
  for (let i = 0; i < length; i++) {
    result += ALPHA_NUMBERIC.charAt(
      Math.floor(Math.random() * charactersLength)
    )
  }
  return result
}
