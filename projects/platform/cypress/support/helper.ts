/* eslint-disable cypress/unsafe-to-chain-command */
import { ERROR_MESSAGES } from '../constants'
import { generateRandomString } from '../utils/string'
const { MANDATORY_FIELD } = ERROR_MESSAGES

export function verifyFieldError(
  inputSelector: string,
  value: string,
  errorMessageSelector: string,
  errorMessage: string,
  clear: boolean
) {
  cy.get(inputSelector).type(value, { parseSpecialCharSequences: false })
  // field will block in no error hint so reset vlaue trigger it(error)
  cy.get(inputSelector).type(value + 'reTrigger', {
    parseSpecialCharSequences: false,
  })
  cy.get(inputSelector).type(value, {
    parseSpecialCharSequences: false,
  })
  cy.checkErrorMessages(errorMessageSelector, errorMessage)
  if (clear) {
    cy.get(inputSelector).clear()
  }
}

export function verifyField(
  inputSelector: string,
  expectedValue: string,
  value: string,
  expectedValueSelector?: string,
  clear?: boolean
) {
  cy.get(inputSelector).type(value, { parseSpecialCharSequences: false })
  if (expectedValueSelector) {
    cy.get(expectedValueSelector).should('have.value', expectedValue)
  } else {
    cy.get(inputSelector).should('have.value', expectedValue)
  }

  if (clear) {
    cy.get(inputSelector).clear()
  }
}

export function verifyMandatoryField(
  inputSelector: string,
  errorMessageSelector: string
) {
  cy.get(inputSelector).clear()
  cy.get(errorMessageSelector).should('contain.text', MANDATORY_FIELD)
}

export function createOneSide(
  selectedSide: string,
  createWidthSection: boolean
) {
  const featuresInput = generateRandomString(501)
  const contentText = generateRandomString(100)
  const patternInfo = generateRandomString(100)
  const colorInfo = generateRandomString(100)
  const finishInfo = generateRandomString(501)

  // enter input for features-input
  cy.get(`[data-cy="${selectedSide}"] [data-cy="features-input"]`).click()
  cy.get(`[data-cy="f-popper-body"] input`)
    .type(featuresInput, { parseSpecialCharSequences: false })
    .should('have.value', featuresInput.slice(0, 500))
    .type('{enter}')
  cy.get('body').click(0, 0)

  //enter input for content-text
  cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text"]`).click()
  cy.get(`[data-cy="f-popper-body"] input`)
    .type(contentText, { parseSpecialCharSequences: false })
    .should('have.value', contentText)
    .type('{enter}')

  //enter input for content-text-value
  cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`)
    .type('100 {enter}')
    .should('have.value', '100')

  if (createWidthSection) {
    //enter input for cuttable width text
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`
    ).type('998.99 {enter}')
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`
    ).should('have.value', 998.99)

    //enter input for full width
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`
    ).type('998.99 {enter}')
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`
    ).should('have.value', 998.99)

    //enter input for weight
    cy.get(`[data-cy="${selectedSide}"] [data-cy="weight-text"] input`).type(
      '99999.00 {enter}'
    )
    cy.get('body').click()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="weight-text"] input`).should(
      'have.value',
      99999
    )
  }

  //enter input for finish info
  cy.get(`[data-cy="${selectedSide}"] [data-cy="finish-info"]`).click()
  cy.get('[data-cy="f-popper-body"] input')
    .type(finishInfo)
    .should('have.value', finishInfo.slice(0, 500))
    .type('{enter}')
  cy.get('body').click(1, 1)

  //enter input for color info
  cy.get(`[data-cy="${selectedSide}"] [data-cy="color-info"] input`)
    .type(colorInfo)
    .should('have.value', colorInfo)
    .type('{enter}')

  //enter input for pattern info
  cy.get(`[data-cy="${selectedSide}"] [data-cy="pattern-info"] input`)
    .type(patternInfo)
    .should('have.value', patternInfo)
    .type('{enter}')
}
export function createMiddleSide() {
  const featuresInput = generateRandomString(500)
  cy.get(
    '[data-cy="middle-side-specification"] [data-cy="features-input"]'
  ).click()
  cy.get('[data-cy="f-popper-body"] input')
    .type(featuresInput, { parseSpecialCharSequences: false })
    .should('have.value', featuresInput)
    .type('{enter}')
  cy.get('body').click(0, 0)

  // enter finish info
  const finishInfo = generateRandomString(500)
  cy.get(
    '[data-cy="middle-side-specification"] [data-cy="finish-info"]'
  ).click()
  cy.get('[data-cy="f-popper-body"] input')
    .type(finishInfo, { parseSpecialCharSequences: false })
    .should('have.value', finishInfo)
    .type('{enter}')
  cy.get('body').click(1, 1)
}
