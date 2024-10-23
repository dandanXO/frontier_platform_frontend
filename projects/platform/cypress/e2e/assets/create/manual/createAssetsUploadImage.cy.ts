/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable no-undef */
// import { ERROR_MESSAGES } from '../../../constants'
// import { generateRandomString } from '../../../utils/string'

context('test upload the image', () => {
  beforeEach(() => {
    cy.login()
  })

  it('go upload page and upload one Image', () => {
    cy.get('[data-cy="upload-page"]').click({ force: true })
    // click smart-upload
    cy.get('[data-cy="smart-upload"]').click()
    // path（ref cypress/fixtures ）
    const filePath = [
      'cypress/fixtures/jpg.jpg',
      'cypress/fixtures/png.png',
      'cypress/fixtures/jpeg.jpeg',
    ]
    cy.get('[data-cy="modal-smart-upload_browse"]').click({ force: true })
    // mean select file on OS API
    // doc https://docs.cypress.io/api/commands/selectfile#__docusaurus_skipToContent_fallback
    cy.get('[data-cy="upload-btn"]').selectFile(filePath, { force: true })
  })
})
