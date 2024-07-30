import { ERROR_MESSAGES } from '../../../constants'
import { generateRandomString } from '../../../utils/string'

context(
  'Verify create 3d material page',
  () => {
    beforeEach(() => {
      cy.login()
    })

    const { MANDATORY_FIELD } = ERROR_MESSAGES

    it('add one noarmal action', () => {
      cy.get('[data-cy="child-sidebar-org-1-6-assets-library"]').click({ force: true })

      //search the data
      cy.get('[data-cy="assets-item-grid"]')
      .should('be.visible')

      cy.get('[data-cy="search-box"] input')
      .should('not.be.disabled').and('be.visible')
      .type('Leather print Test {enter}')

      //select the first one
      cy.get('[data-cy="assets-item-grid"]').first().within(() => {
        cy.contains('p', 'Leather print Test')
          .should('be.visible')
          .click()
      });


      //hit the detail of the selected material
      cy.get('[data-cy="material-detail-internal-moreOptions"]').click()

      //hit create 3d material menu
      cy.get('[data-cy="create-3d-material"]')
      .click();

      //hit crop button
      cy.get('[data-cy="modal-behavior_primary"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click()

      //hit crop button in first time modal
      cy.get('[data-cy="modal-behavior_primary"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click()

      //hit skip button in first time modal
      cy.get('[data-cy="btn-skip"]').click();

      //3d material page assertion
      //button assert
      cy.get('[data-cy="btn-back"]')
      .should('be.visible')
      .should('not.be.disabled')

      cy.get('[data-cy="btn-create"]')
      .should('be.visible')
      .should('not.be.disabled')

      cy.get('[data-cy="btn-exit"]')
      .should('be.visible')
      .should('not.be.disabled')

      //konvajs assert
      cy.get('div.konvajs-content')
      .should('be.visible')
      .and('have.css', 'position', 'relative')

      cy.get('div.konvajs-content')
      .should('have.length', 2)
      .each($el => {
        cy.wrap($el).should('be.visible')
        .and('have.css', 'position', 'relative')

        cy.wrap($el).find('canvas')
        .should('exist')
        .should('be.visible');
      });


      //verify can drag the konvajs
      cy.get('div.konvajs-content')
      .first()
      .trigger('mousedown', { which: 1, pageX: 100, pageY: 100 })
      .trigger('mousemove', { which: 1, pageX: 200, pageY: 200 })
      .trigger('mouseup');

      cy.get('[data-cy="btn-exit"]').click()
    })
  }
)
