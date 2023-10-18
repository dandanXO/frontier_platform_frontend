import { isEqual } from '../../src/utils/isEqual'

describe('isEqual', () => {
  const invalidTestCases = [
    ['', ' '],
    [1, 2],
    [true, false],
    [null, undefined],
    [{ a: 10 }, { a: 11 }],
    [
      ['a', 'b'],
      ['a', 'c'],
    ],
  ]
  const validTestCases = [
    [{ a: 10 }, { a: 10 }],
    [1, 1],
    [true, true],
    [null, null],
    [undefined, undefined],
    [
      ['a', 'b'],
      ['a', 'b'],
    ],
  ]

  invalidTestCases.forEach((testCase) => {
    it(`should return false when variables' value are not equal: ${
      (testCase[0], testCase[1])
    }`, () => {
      expect(isEqual(testCase[0], testCase[1])).toEqual(false)
    })
  })

  validTestCases.forEach((testCase) => {
    it(`should return true when variables' value are equal: ${
      (testCase[0], testCase[1])
    }`, () => {
      expect(isEqual(testCase[0], testCase[1])).toEqual(true)
    })
  })
})
