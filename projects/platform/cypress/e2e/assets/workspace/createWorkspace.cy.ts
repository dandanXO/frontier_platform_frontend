import { ERROR_MESSAGES } from '../../../constants'
import { generateRandomString } from '../../../utils/string'

context(
  'Verify create workspace and collection',
  () => {
    beforeEach(() => {
      cy.login()
    })

    const { MANDATORY_FIELD } = ERROR_MESSAGES

    it('add one normal action', () => {
      //click workspace menu on sidebar
      cy.get('[data-cy="child-sidebar-org-1-6-workspace"]').click({ force: true })

      cy.get('[data-cy="workspace-item-0"]').should('be.visible')

      //click button create new collection
      cy.get('[data-cy="create-new-collection"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click()

      //verify when first time visit the create button is disabled
      cy.get('[data-cy="modal-behavior_primary"]')
      .should('be.visible')
      .should('be.disabled')

      //verify collection name
      let collectionName = generateRandomString(101)
      cy.get('[data-cy="input-collection-name"] input')
      .type(`${collectionName}`)
      .should('have.value', collectionName)

      cy.checkErrorMessages(
        '[data-cy="input-collection-name"] [data-cy="hintError"]',
        'You have exceeded the max character limit'
      )

      cy.get('[data-cy="input-collection-name"] input').clear()
      cy.checkErrorMessages(
        '[data-cy="input-collection-name"] [data-cy="hintError"]',
        'This field is required.'
      )

      collectionName = generateRandomString(100)
      cy.get('[data-cy="input-collection-name"] input')
      .type(`${collectionName}`)
      .should('have.value', collectionName)

      //verify can hit the button submit after already input for all mandatory value
      cy.get('[data-cy="modal-behavior_primary"]')
      .should('be.visible')
      .should('not.be.disabled')

      //verify description
      let description = generateRandomString(1001)
      cy.get('[data-cy="input-description-collection"] [contenteditable="true"]')
      .type(`${description}`)
      .and('contain', description);

      cy.get('[data-cy="modal-how-to-scan-header"]')
      .closest('.absolute.w-min.rounded.card-show.pt-5.shadow-32.bg-grey-0')
      .find('.os-viewport') 
      .scrollTo('bottom');

      cy.checkErrorMessages(
        '[data-cy="input-description-collection"] [data-cy="hintError"]',
        'Do not exceed 1000 characters.'
      )

      cy.get('[data-cy="input-description-collection"] [contenteditable="true"]').clear()
      description = generateRandomString(1000)
      cy.get('[data-cy="input-description-collection"] [contenteditable="true"]')
      .type(`${description}`)
      .and('contain', description);

      //verify can hit the button submit button
      cy.get('[data-cy="modal-behavior_primary"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click()
      
      cy.waitLoadingDissmissed()
      //search the new created workspace
      cy.get('[data-cy="search-box"] input')
      .should('not.be.disabled').and('be.visible')
      .type(`${collectionName} {enter}`)

      cy.get('[data-cy="workspace-item-0"]')
      .should('be.visible')
      .trigger('mouseover')

      cy.get('[data-cy="workspace-item-0"] [data-cy="tooltip"]')
      .first()
      .click({force: true})

      cy.get('[data-cy="f-context-menu"]').should('be.visible');

      //delete the new workspace
      cy.get('[data-cy="delete-collection"]')
      .click({force: true})

      cy.get('[data-cy="modal-confirm-primary"]')
      .click({force: true})

    })
  }
)
