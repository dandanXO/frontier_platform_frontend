/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable no-undef */

context(
  'Check the face, back and middle side display correct target information',
  () => {
    beforeEach(() => {
      cy.login()
    })

    describe('add one noarmal action check all input field', () => {
      it('start add', () => {
        cy.get('[data-cy="upload-page"]').click({ force: true })
        // face side----------
        // click manual-upload
        cy.get('[data-cy="manual-upload"]').click()

        // select on 2-Sides
        cy.get('[data-cy="create-material-side-information-selecter"]').click()
        cy.get('[data-cy="f-context-menu"]').click()
        // check the Composite material box

        cy.get('[data-cy="create-material-check-box"]').click()

        // clicke save show all error message
        cy.get('[data-cy="save-button"]').click()
        cy.get('[data-cy="save-button"]').should('be.disabled')

        // input manual-upload fild
        cy.get('[data-cy="item-number"]').type('f22-3357-test')
        // input season
        cy.get('[data-cy="season-input"] [data-cy="f-popper"]').click()
        cy.get('[data-cy="f-popper-body"] input').type(
          'seanseanseanseansean {enter}'
        )
        cy.get('[data-cy="season-input-year"] input').type('9999')

        // input m-input
        cy.get(
          '[data-cy="face-side-specification"] [data-cy="features-input"]'
        ).click()
        cy.get('[data-cy="f-popper-body"] input').type('faceSideSep1 {enter}')
        // blur m-input
        cy.get('body').click(0, 0)

        // {enter} mean press enter
        cy.get(
          '[data-cy="face-side-specification"] [data-cy="content-text"] input'
        ).type('faceSideSep1 {enter}')
        cy.get(
          '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
        ).type('100 {enter}')
        cy.get(
          '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
        ).type('456')
        cy.get(
          '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
        ).type('789')
        cy.get(
          '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
        ).type('234')
        // middle side----------
        // select middle side
        cy.get('[data-cy="side-select"]>div').eq(1).click()
        // input m-input
        cy.get('[data-cy="middle-side-specification"] [data-cy="f-popper"]')
          .eq(0)
          .click()
        cy.get('[data-cy="f-popper-body"] input').type('middleSideSep1 {enter}')
        // blur m-input
        cy.get('body').click(0, 0)

        // back side----------
        // select back side
        cy.get('[data-cy="side-select"]>div').eq(2).click()

        // input m-input
        cy.get(
          '[data-cy="back-side-specification"] [data-cy="features-input"]'
        ).click()
        cy.get('[data-cy="f-popper-body"] input').type('backSideSep1 {enter}')
        // blur m-input
        cy.get('body').click(0, 0)

        // {enter} mean press enter
        cy.get(
          '[data-cy="back-side-specification"] [data-cy="content-text"] input'
        ).type('backSideSep1 {enter}')
        cy.get(
          '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
        ).type('100 {enter}')

        // clicke save
        cy.get('[data-cy="hintError"]').should('have.length', 0)
        cy.get('[data-cy="save-button"]').click()

        // check is success for upload
        cy.get('[data-cy="modal-how-to-scan-header"]').should(
          'have.text',
          'Great'
        )
        // click done button
        cy.get('[data-cy="modal-behavior_primary"]').click()
        // go to home page
        cy.visit('/488452000/1-6/assets?currentPage=1&sort=7')

        // select first asset your test case
        cy.get('[data-cy="assets-item-grid"]').eq(0).trigger('mouseenter')
        cy.wait(300)
        cy.get('[data-cy="assets-item-grid"]').eq(0).click()
        cy.wait(300)
        // check faceSideSep1 value correct
        cy.get('[data-cy="value-of-features"] p').should(
          'have.text',
          'faceSideSep1'
        )
        // check middleSideSep1 value correct
        cy.get('[data-cy="filter-range"]>div').eq(1).click()
        cy.get('[data-cy="value-of-features"] p').should(
          'have.text',
          'middleSideSep1'
        )
        // check backSideSep1 value correct
        cy.get('[data-cy="filter-range"]>div').eq(2).click()
        cy.get('[data-cy="value-of-features"] p').should(
          'have.text',
          'backSideSep1'
        )
        // delet the item
        cy.get('[data-cy="material-detail-internal-moreOptions"]').click()
        cy.get('[data-cy="f-contextual-menu"] [data-cy="f-context-menu"]>div')
          .last()
          .click()
        // check is delete and DELETE
        cy.get(
          '[data-cy="modal-confirm"] [data-cy="modal-confirm-title"] p'
        ).should('have.text', 'Delete the materials?')
        cy.get('[data-cy="modal-confirm"] [data-cy="modal-confirm-primary"]')
          .should('have.text', 'Confirm')
          .click()
        cy.wait(300)
        cy.visit('/488452000/1-6/assets?currentPage=1&sort=7')
      })
    })
  }
)
