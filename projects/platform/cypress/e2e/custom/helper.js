import TestData from './testdata'

let LOCAL_STORAGE_MEMORY = {}
const timeout = 60000

Cypress.Commands.add('checkErrorMessages', (selector, errorMessage) => {
  cy.get(selector)
    .should('have.text', errorMessage)
    .should('be.visible')
    .and('have.css', 'color', 'rgb(224, 74, 75)')
})

Cypress.Commands.add('waitLoadingDissmissed', () => {
  cy.get('[data-cy="loading-indicator"]', { timeout }).should('exist')
  cy.get('[data-cy="loading-indicator"]', { timeout }).should('not.exist')
})

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key]
  })
  cy.task(
    'info',
    `save current local storage with value: ${JSON.stringify(
      LOCAL_STORAGE_MEMORY
    )}`
  )
})

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
  cy.task('info', 'restore previous local storage data')
})

Cypress.Commands.add('chooseOrganization', () => {
  const { selectedOrg } = TestData
  // select fabric Pro
  cy.get('[data-cy="org"]', { timeout }).each(($el) => {
    const value = $el.text().trim()
    if (value.includes(selectedOrg)) {
      cy.wrap($el).click()
      return false
    }
  })
  cy.get('[data-cy="sidebar"]', { timeout }).should('exist')
  cy.waitLoadingDissmissed()
})

Cypress.Commands.add('login', () => {
  cy.visit('/sign-in')
  cy.get('[data-cy="email"]').type('demo_tester@frontier.cool')
  cy.get('[data-cy="email"] input').should(
    'have.value',
    'demo_tester@frontier.cool'
  )
  // typing password
  cy.get('[data-cy="password"]').type('qweasdzxc')
  cy.get('[data-cy="password"] input').should('have.value', 'qweasdzxc')
  cy.get('[data-cy="login"]').click()

  cy.chooseOrganization()
})

Cypress.Commands.add('accessPage', () => {
  cy.intercept('https://textile-webapi-dev.frontier.cool/user').as('userData')
  cy.viewport(1920, 1080)
  cy.visit('/')
  cy.wait('@userData')
    .its('response.statusCode')
    .then((statusCode) => {
      switch (statusCode) {
        case 401:
          cy.login()

          break

        case 200:
          cy.chooseOrganization()
          break
        default:
          break
      }
    })
})

Cypress.Commands.add('shouldNotCrash', () => {
  cy.get('[data-cy="modal-confirm-crash"]').should('not.exist')
})
