/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable no-undef */
import { ERROR_MESSAGES } from '../../../constants'
import { generateRandomString } from '../../../utils/string'

context(
  'Check the face, back and middle side display correct target information',
  () => {
    beforeEach(() => {
      cy.login()
    })

    const { MANDATORY_FIELD } = ERROR_MESSAGES

    it('add one noarmal action', () => {
      cy.get('[data-cy="upload-page"]').click({ force: true })
      // face side----------
      // click smart-upload
      cy.get('[data-cy="smart-upload"]').click()
    })
  }
)
