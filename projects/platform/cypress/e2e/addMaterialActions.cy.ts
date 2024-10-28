// context('Actions Add ONE material', () => {
//   beforeEach(() => {
//     cy.accessPage()
//   })

//   it('add one noarmal action', () => {
//     cy.get('[data-cy="upload-page"]').click({ force: true })
//     // click manual-upload
//     cy.get('[data-cy="manual-upload"]').click()

//     // input manual-upload fild
//     cy.get('[data-cy="item-number"]').type('item test 1')
//     // {enter} mean press enter
//     cy.get(
//       '[data-cy="face-side-specification"] [data-cy="content-text"] input'
//     ).type('content1 {enter}')
//     cy.get(
//       '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
//     ).type('100 {enter}')
//     cy.get(
//       '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
//     ).type('456')
//     cy.get(
//       '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
//     ).type('789')
//     cy.get(
//       '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
//     ).type('234')
//     // clicke save
//     cy.get('[data-cy="save-button"]').click()

//     // check is success for upload
//     cy.get('[data-cy="modal-how-to-scan-header"]').should('have.text', 'Great')
//   })
// })
