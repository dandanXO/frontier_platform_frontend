/* eslint-disable no-undef */
/// <reference types="cypress" />
import TestData from './testdata'
import ErrorMessages from './errormessages'
import './helper'

context(
  'Check the face, back and middle side display correct target information',
  () => {
    beforeEach(() => {
      cy.viewport(1920, 1080)
      cy.visit('/sign-in')
    })
    const {
      selectedOrg,
      string10Length,
      string50Length,
      string51Length,
      string500Length,
      string501Length,
      string100Length,
      string101Length,
    } = TestData

    const { mandatoryField } = ErrorMessages
    // if (Cypress.env('NODE_ENV') == 'development') {
    // }

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

      cy.get('[data-cy="org"]').each(($el) => {
        const value = $el.text().trim()
        if (value.includes(selectedOrg)) {
          cy.wrap($el).click()
          return false
        }
      })
      // click upload button to upload page
      cy.wait(2000)
      cy.get('[data-cy="upload-page"]').click({ force: true })
      // face side----------
      // click manual-upload
      cy.get('[data-cy="manual-upload"]').click()

      // select on 2-Sides
      cy.get('[data-cy="create-material-side-information-selecter"]')
        .should('exist')
        .and('be.visible')
        .click()
      cy.get('[data-cy="f-context-menu"]').click()

      cy.get('[data-cy="create-material-check-box"]')
        .find('input[type="checkbox"]')
        .check({ force: true })

      // verify item-number
      cy.get('[data-cy="item-number"]').type(`${string51Length}`, {
        parseSpecialCharSequences: false,
      })
      cy.get('[data-cy="item-number"] input').should(
        'have.value',
        string51Length
      )

      cy.checkErrorMessages(
        [
          '[data-cy="item-number"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        '50.00 character limit'
      )

      cy.checkErrorMessages(
        '[data-cy="item-number"] [data-cy="hintError"]',
        `50.00 character limit`
      )

      cy.get('[data-cy="item-number"] input').clear()
      cy.checkErrorMessages(
        '[data-cy="item-number"] .text-caption.text-red-400.whitespace-nowrap',
        mandatoryField
      )

      cy.get('[data-cy="item-number"]')
        .type(`${string50Length}{enter}`, { parseSpecialCharSequences: false })
        .should('have.value', string50Length)

      // verify season-input and season-input-year
      cy.get('[data-cy="face-side-specification"] [data-cy="season-input"]')
        .type(`${string51Length}{enter}`, { parseSpecialCharSequences: false })
        .should('have.value', string50Length)

      //verify with negative value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="season-input-year"]'
      )
        .type(`-1 {enter}`)
        .should('have.value', '-1')
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="season-input-year"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'Must be at least 0.00.'
      )

      //verify with decimal value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="season-input-year"]'
      )
        .type(`22.3 {enter}`)
        .should('have.value', '22.3')
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="season-input-year"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'Integers only'
      )

      //verify with more than 9999
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="season-input-year"]'
      )
        .type(`10000 {enter}`)
        .should('have.value', '10000')
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="season-input-year"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'Must be no more than 9,999.00'
      )

      //verify with max value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="season-input-year"]'
      )
        .type(`9999 {enter}`)
        .should('have.value', '9999')

      // verify features-input
      cy.get('[data-cy="face-side-specification"] [data-cy="features-input"]')
        .click()
        .type(`${string501Length} {enter}`)
        .should('have.value', string500Length)

      // blur m-input
      cy.get('body').click()

      // {enter} mean press enter
      //test with string length more than 100
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text"] input'
      )
        .type(`${string101Length} {enter}`)
        .should('have.value', string101Length)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="content-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        '100.00 character limit, This field is required.'
      )

      //test with value more than 100
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('101 {enter}')
        .should('have.value', '100.01')
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="content-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'The total fabric content percentage must be 100%, 100.00 character limit, Cannot exceed 100.00'
      )

      //test with value 3 decimal
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('20.001 {enter}')
        .should('have.value', '20.001')
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="content-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'The total fabric content percentage must be 100%, 100.00 character limit, Enter with 2 decimal places only'
      )

      //test with value -1
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('-1 {enter}')
        .should('have.value', '-1')
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="content-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'The total fabric content percentage must be 100%, 100.00 character limit, Must be greater than 0.00'
      )

      //test with value 0
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('0 {enter}')
        .should('have.value', '0')
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="content-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'The total fabric content percentage must be 100%, 100.00 character limit, Must be greater than 0.00'
      )

      //test with empty content
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('100 {enter}')
        .should('have.value', '100')
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text"] input'
      ).clear()
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="content-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        mandatoryField
      )

      //test with empty content value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text"] input'
      )
        .type(`${string100Length} {enter}`)
        .should('have.value', string100Length)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="content-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        mandatoryField
      )

      //test with max value for content and content value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('100')
        .should('have.value', '100')

      //verify cuttable width
      //verify with value less than 1
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      )
        .type('0.99')
        .should('have.value', 0.99)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'Must be at least 1.00.'
      )

      //verify with empty value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      ).clear()
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        mandatoryField
      )

      //verify with 3 decimal
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      )
        .type('1.001 {enter}')
        .should('have.value', 1.001)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'Enter with 2 decimal places only'
      )

      //verify with max value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      )
        .type('999.00 {enter}')
        .should('have.value', 999)

      //verify with max decimal digit
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      )
        .type('998.99 {enter}')
        .should('have.value', 998.99)

      //verify full width
      //verify with value less than 1
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      )
        .type('0.99')
        .should('have.value', 0.99)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="full-width-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'Must be at least 1.00.'
      )

      //verify with empty value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      ).clear()
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="full-width-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        mandatoryField
      )

      //verify with 3 decimal
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      )
        .type('1.001 {enter}')
        .should('have.value', 1.001)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="full-width-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'Enter with 2 decimal places only'
      )

      //verify with max value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      )
        .type('999.00 {enter}')
        .should('have.value', 999)

      //verify with max decimal digit
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      )
        .type('998.99 {enter}')
        .should('have.value', 998.99)

      //verify weight
      //verify with value less than 1
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      )
        .type('0.99')
        .should('have.value', 0.99)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="weight-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'Must be at least 1.00.'
      )

      //verify with empty value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      ).clear()
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="weight-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        mandatoryField
      )

      //verify with 3 decimal
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      )
        .type('1.001 {enter}')
        .should('have.value', 1.001)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="weight-text"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        'Enter with 2 decimal places only'
      )

      //verify with max value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      )
        .type('999.00 {enter}')
        .should('have.value', 999)

      //verify with max decimal digit
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      )
        .type('998.99 {enter}')
        .should('have.value', 998.99)

      //verify finish info
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="finish-info"] input'
      )
        .type(`${string501Length} {enter}`)
        .should('have.value', string500Length)

      //verify color info
      cy.get('[data-cy="face-side-specification"] [data-cy="color-info"] input')
        .type(`${string101Length} {enter}`)
        .should('have.value', string101Length)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="color-info"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        '100.00 character limit'
      )

      cy.get(
        '[data-cy="face-side-specification"] [data-cy="color-info"] input'
      ).clear()
      cy.get('[data-cy="face-side-specification"] [data-cy="color-info"] input')
        .type(`${string100Length} {enter}`)
        .should('have.value', string100Length)

      //verify pattern info
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="pattern-info"] input'
      )
        .type(`${string101Length} {enter}`)
        .should('have.value', string101Length)
      cy.checkErrorMessages(
        [
          '[data-cy="face-side-specification"] [data-cy="pattern-info"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        '100.00 character limit'
      )

      cy.get(
        '[data-cy="face-side-specification"] [data-cy="pattern-info"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="pattern-info"] input'
      )
        .type(`${string100Length} {enter}`)
        .should('have.value', string100Length)

      // middle side----------
      // select middle side
      cy.get('[data-cy="side-select"]>div').eq(1).click()
      // verify features
      cy.get('[data-cy="middle-side-specification"] [data-cy="features-input"]')
        .click()
        .type(`${string501Length} {enter}`)
        .should('have.value', string500Length)

      // verify features
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="finish-info"] input'
      )
        .type(`${string501Length} {enter}`)
        .should('have.value', string500Length)

      // back side----------
      // select back side
      cy.get('[data-cy="side-select"]>div').eq(2).click()
      cy.get('[data-cy="middle-side-specification"] [data-cy="features-input"]')
        .click()
        .type(`${string501Length} {enter}`)
        .should('have.value', string500Length)

      //verify finish info
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="finish-info"] input'
      )
        .type(`${string501Length} {enter}`)
        .should('have.value', string500Length)

      //verify color info
      cy.get('[data-cy="back-side-specification"] [data-cy="color-info"] input')
        .type(`${string101Length} {enter}`)
        .should('have.value', string101Length)
      cy.checkErrorMessages(
        [
          '[data-cy="back-side-specification"] [data-cy="color-info"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        '100.00 character limit'
      )

      cy.get(
        '[data-cy="back-side-specification"] [data-cy="color-info"] input'
      ).clear()
      cy.get('[data-cy="back-side-specification"] [data-cy="color-info"] input')
        .type(`${string100Length} {enter}`)
        .should('have.value', string100Length)

      //verify pattern info
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="pattern-info"] input'
      )
        .type(`${string101Length} {enter}`)
        .should('have.value', string101Length)
      cy.checkErrorMessages(
        [
          '[data-cy="back-side-specification"] [data-cy="pattern-info"] .text-caption.text-red-400.whitespace-nowrap',
        ],
        '100.00 character limit'
      )

      cy.get(
        '[data-cy="back-side-specification"] [data-cy="pattern-info"] input'
      ).clear()
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="pattern-info"] input'
      )
        .type(`${string100Length} {enter}`)
        .should('have.value', string100Length)

      // clicke save
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

      //TODO:verify value after submit
      // select first asset your test case
      cy.get('[data-cy="assets"] .w-full.relative.aspect-square')
        .eq(0)
        .trigger('mouseenter')
      cy.wait(300)
      cy.get('[data-cy="assets"] .w-full.relative.aspect-square').eq(0).click()
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
  }
)
