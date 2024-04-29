/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('/sign-in')
  })
  if (Cypress.env('NODE_ENV') == 'development') {
  }

  // https://on.cypress.io/interacting-with-elements

  it('add one noarmal action', () => {
    // typing email
    cy.get('[data-cy="email"]').type('demo_tester@frontier.cool')
    cy.get('[data-cy="email"] input').should(
      'have.value',
      'demo_tester@frontier.cool'
    )
    // typing password
    cy.get('[data-cy="password"]').type('qweasdzxc')
    cy.get('[data-cy="password"] input').should('have.value', 'qweasdzxc')

    // click login button
    cy.get('[data-cy="login"]').click()
    // select fabric Pro
    cy.get('[data-cy="org"]').eq(1).click()
    // click upload button to upload page
    cy.wait(1000)
    cy.get('[data-cy="upload-page"]').click({ force: true })
    // click manual-upload
    cy.get('[data-cy="manual-upload"]').click()

    // input manual-upload fild
    cy.get('[data-cy="itemNumber"]').type('item test 1')
    // {enter} mean press enter
    cy.get('[data-cy="faceSideSep"] [data-cy="contentText"] input').type(
      'content1 {enter}'
    )
    cy.get('[data-cy="faceSideSep"] [data-cy="contentTextValue"] input').type(
      '100 {enter}'
    )
    cy.get('[data-cy="faceSideSep"] [data-cy="cuttableWidthText"] input').type(
      '456'
    )
    cy.get('[data-cy="faceSideSep"] [data-cy="WeightText"] input').type('789')
    cy.get('[data-cy="faceSideSep"] [data-cy="fullWidthText"] input').type(
      '234'
    )
    // clicke save
    cy.get('[data-cy="saveButton"]').click()

    // check is success for upload
    cy.get('[data-cy="modal-how-to-scan-header"]').should('have.text', 'Great')
  })
})
