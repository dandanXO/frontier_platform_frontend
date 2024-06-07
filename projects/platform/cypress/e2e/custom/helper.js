// cypress/e2e/customCommands.js

Cypress.Commands.add('checkErrorMessages', (selector, errorMessage) => {
  cy.get(selector)
    .should('have.text', errorMessage)
    .should('be.visible')
    .and('have.css', 'color', 'rgb(224, 74, 75)')
})
