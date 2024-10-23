import { ERROR_MESSAGES } from '../../../constants'
import { generateRandomString } from '../../../utils/string'

context('Check the upload setting text recognition toggle ', () => {
  beforeEach(() => {
    cy.login()
  })

  const { MANDATORY_FIELD } = ERROR_MESSAGES

  it('add one noarmal action', () => {
    cy.get('[data-cy="upload-page"]').click({ force: true })
    // face side----------
    // click manual-upload
    const isToggleOn = () => {
      return cy
        .get('label.flex.items-center svg.svg-icon')
        .invoke('attr', 'xlink:href')
        .then((href) => {
          return href === '#toggle_on'
        })
    }

    // Function to toggle the switch
    const toggleSwitch = () => {
      cy.get('label.flex.items-center svg.svg-icon').last().click()
    }

    cy.get('[data-cy="text-recognition-setting"]').click()

    // Check the current state of the toggle
    let toggle = true
    isToggleOn().then((isOn) => {
      if (isOn) {
        // If it's on, turn it off and verify
        toggleSwitch()
        isToggleOn().should('eq', true)
        toggle = true
      } else {
        // If it's off, turn it on and verify
        toggleSwitch()
        isToggleOn().should('eq', false)
        toggle = false
      }
    })
  })
})
