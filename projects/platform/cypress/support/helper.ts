import { ERROR_MESSAGES } from '../constants'
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
