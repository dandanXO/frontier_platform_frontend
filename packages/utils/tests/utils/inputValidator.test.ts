import { inputValidator } from '../../src/utils/inputValidator'

describe('inputValidator', () => {
  describe('email format', () => {
    const invalidTestCases = [
      null,
      undefined,
      '',
      'email',
      '123',
      'https://dev.to/emmabostian/regex-cheat-sheet-2j2a',
    ]
    const validTestCases = [
      'raven.pan@frontier.cool',
      'raven.pan@gmail.com',
      'raven.pan85321@gmail.com',
    ]

    invalidTestCases.forEach((testCase) => {
      it(`should return false when email is ${testCase}`, () => {
        expect(inputValidator.emailFormat(testCase)).toEqual(false)
      })
    })

    validTestCases.forEach((testCase) => {
      it(`should return true when email is ${testCase}`, () => {
        expect(inputValidator.emailFormat(testCase)).toEqual(true)
      })
    })
  })

  describe('required', () => {
    const invalidTestCases = [null, undefined, '', [], {}]
    const validTestCases = ['string', 0, 1, [1], { a: 1 }, true, false]

    invalidTestCases.forEach((testCase) => {
      it(`should return false when value is ${testCase}`, () => {
        expect(inputValidator.required(testCase)).toEqual(false)
      })
    })

    validTestCases.forEach((testCase) => {
      it(`should return true when value is ${testCase}`, () => {
        expect(inputValidator.required(testCase)).toEqual(true)
      })
    })
  })

  describe('maxLength', () => {
    const maxLength = 1
    const invalidTestCases = ['12', '123']
    const validTestCases = [null, undefined, '', '1']

    invalidTestCases.forEach((testCase) => {
      it(`should return false when value is ${testCase}`, () => {
        expect(inputValidator.maxLength(testCase, maxLength)).toEqual(false)
      })
    })

    validTestCases.forEach((testCase) => {
      it(`should return true when value is ${testCase}`, () => {
        expect(inputValidator.maxLength(testCase, maxLength)).toEqual(true)
      })
    })
  })

  // TODO
  // describe('maxIntegerDecimal', () => {})
})
