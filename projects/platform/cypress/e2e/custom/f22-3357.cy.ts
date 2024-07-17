/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable no-undef */
import { ERROR_MESSAGES } from '../../constants'
import { generateRandomString } from '../../utils/string'

context(
  'Check the face, back and middle side display correct target information',
  () => {
    beforeEach(() => {
      cy.login()
    })

    const { MANDATORY_FIELD } = ERROR_MESSAGES

    it('add one noarmal action', () => {
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
      const itemChar51 = generateRandomString(51)
      cy.get('[data-cy="item-number"]').type(itemChar51, {
        parseSpecialCharSequences: false,
      })
      cy.get('[data-cy="item-number"] input').should('have.value', itemChar51)

      cy.checkErrorMessages(
        '[data-cy="item-number"] [data-cy="hintError"]',
        `50.00 character limit`
      )

      cy.get('[data-cy="item-number"] input').clear()
      cy.checkErrorMessages(
        '[data-cy="item-number"] [data-cy="hintError"]',
        MANDATORY_FIELD
      )

      const itemChar50 = generateRandomString(50)

      cy.get('[data-cy="item-number"]').type(itemChar50, {
        parseSpecialCharSequences: false,
      })

      cy.get('[data-cy="item-number"]').click()

      cy.get('[data-cy="item-number"] input').should('have.value', itemChar50)

      //verify season-input and season-input-year

      let temp = generateRandomString(51)
      cy.get('[data-cy="season-input"] [data-cy="f-popper"]').click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`, { parseSpecialCharSequences: false })
        .should('have.value', temp.slice(0, 10))
        .type('{enter}')

      //verify with negative value
      cy.get('[data-cy="season-input-year"]').type(`-1 {enter}`)
      cy.get('[data-cy="item-number"]').click()
      cy.get('[data-cy="season-input-year"] input').should('have.value', '-1')

      cy.checkErrorMessages(
        '[data-cy="season-input-year"] [data-cy="hintError"]',
        'Must be at least 0.00.'
      )

      //verify with decimal value
      cy.get('[data-cy="season-input-year"]').clear()
      cy.get('[data-cy="season-input-year"]').type(`22.3 {enter}`)
      cy.get('[data-cy="item-number"]').click()
      cy.get('[data-cy="season-input-year"] input').should('have.value', '22.3')
      cy.checkErrorMessages(
        '[data-cy="season-input-year"] [data-cy="hintError"]',
        'Integers only'
      )

      //verify with more than 9999
      cy.get('[data-cy="season-input-year"]').clear()
      cy.get('[data-cy="season-input-year"]').type(`10000 {enter}`)
      cy.get('[data-cy="item-number"]').click()
      cy.get('[data-cy="season-input-year"] input').should(
        'have.value',
        '10000'
      )
      cy.checkErrorMessages(
        '[data-cy="season-input-year"] [data-cy="hintError"]',
        'Must be no more than 9,999.00.'
      )

      //verify with max value
      cy.get('[data-cy="season-input-year"]').clear()
      cy.get('[data-cy="season-input-year"]').type(`9999 {enter}`)
      cy.get('[data-cy="item-number"]').click()
      cy.get('[data-cy="season-input-year"] input').should('have.value', '9999')

      // verify features-input
      temp = generateRandomString(501)
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="features-input"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`, { parseSpecialCharSequences: false })
        .should('have.value', temp.slice(0, 500))
        .type('{enter}')
      cy.get('body').click(0, 0)

      //test with string length more than 100
      temp = generateRandomString(101)
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`, { parseSpecialCharSequences: false })
        .should('have.value', temp)
        .type('{enter}')
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        '100.00 character limit, This field is required.'
      )

      //test with value more than 100
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('101 {enter}')
        .should('have.value', '101')
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
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
        '[data-cy="face-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
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
        '[data-cy="face-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
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
        '[data-cy="face-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
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
        '[data-cy="face-side-specification"] [data-cy="content-text"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] .ease-out svg').click()
      cy.get('body').click()
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        MANDATORY_FIELD
      )

      //test with empty content value
      temp = generateRandomString(100)
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="content-text"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        MANDATORY_FIELD
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
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] [data-cy="hintError"]',
        'Must be at least 1.00.'
      )

      //verify with empty value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      ).clear()
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] [data-cy="hintError"]',
        MANDATORY_FIELD
      )

      //verify with 3 decimal
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      )
        .type('1.001 {enter}')
        .should('have.value', 1.001)
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] [data-cy="hintError"]',
        'Enter with 2 decimal places only'
      )

      //verify with max value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      ).type('999.00 {enter}')
      cy.get('body').click()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="cuttable-width-text"] input'
      ).should('have.value', 999)

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
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] [data-cy="hintError"]',
        'Must be at least 1.00.'
      )

      //verify with empty value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      ).clear()
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] [data-cy="hintError"]',
        MANDATORY_FIELD
      )

      //verify with 3 decimal
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      )
        .type('1.001 {enter}')
        .should('have.value', 1.001)
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] [data-cy="hintError"]',
        'Enter with 2 decimal places only'
      )

      //verify with max value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      ).type('999.00 {enter}')
      cy.get('body').click()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="full-width-text"] input'
      ).should('have.value', 999)

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
        '[data-cy="face-side-specification"] [data-cy="weight-text"] [data-cy="hintError"]',
        'Must be at least 1.00.'
      )

      //verify with empty value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      ).clear()
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] [data-cy="hintError"]',
        MANDATORY_FIELD
      )

      //verify with 3 decimal
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      )
        .type('1.0012 {enter}')
        .should('have.value', 1.0012)
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] [data-cy="hintError"]',
        'Enter with 3 decimal places only'
      )

      //verify with max value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      ).type('99999.00 {enter}')
      cy.get('body').click()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      ).should('have.value', 99999)

      //verify with max decimal digit
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      ).clear()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="weight-text"] input'
      )
        .type('99998.999 {enter}')
        .should('have.value', 99998.999)

      //verify finish info
      temp = generateRandomString(501)
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="finish-info"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`)
        .should('have.value', temp.slice(0, 500))
        .type('{enter}')
      cy.get('body').click(1, 1)

      // //verify color info
      temp = generateRandomString(101)
      cy.get('[data-cy="face-side-specification"] [data-cy="color-info"] input')
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="color-info"] [data-cy="hintError"]',
        '100.00 character limit'
      )

      //empty value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="color-info"]'
      ).click()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="color-info"] input'
      ).clear()

      //max length
      temp = generateRandomString(100)
      cy.get('[data-cy="face-side-specification"] [data-cy="color-info"] input')
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')

      //verify pattern info
      temp = generateRandomString(101)
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="pattern-info"] input'
      )
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')
      cy.checkErrorMessages(
        '[data-cy="face-side-specification"] [data-cy="pattern-info"] [data-cy="hintError"]',
        '100.00 character limit'
      )

      //empty value
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="pattern-info"]'
      ).click()
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="pattern-info"] input'
      ).clear()

      //max length
      temp = generateRandomString(100)
      cy.get(
        '[data-cy="face-side-specification"] [data-cy="pattern-info"] input'
      )
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')

      // middle side----------
      // select middle side
      cy.get('[data-cy="side-select"]>div').eq(1).click()
      // verify features
      temp = generateRandomString(501)
      cy.get(
        '[data-cy="middle-side-specification"] [data-cy="features-input"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`, { parseSpecialCharSequences: false })
        .should('have.value', temp.slice(0, 500))
        .type('{enter}')
      cy.get('body').click(0, 0)

      // verify finish info
      temp = generateRandomString(501)
      cy.get(
        '[data-cy="middle-side-specification"] [data-cy="finish-info"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`, { parseSpecialCharSequences: false })
        .should('have.value', temp.slice(0, 500))
        .type('{enter}')
      cy.get('body').click(1, 1)

      // back side----------
      // select back side
      cy.get('[data-cy="side-select"]>div').eq(2).click()

      // verify features
      temp = generateRandomString(501)
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="features-input"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`, { parseSpecialCharSequences: false })
        .should('have.value', temp.slice(0, 500))
        .type('{enter}')
      cy.get('body').click(0, 0)

      //test with string length more than 100
      temp = generateRandomString(101)
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`, { parseSpecialCharSequences: false })
        .should('have.value', temp)
        .type('{enter}')
      cy.checkErrorMessages(
        '[data-cy="back-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        '100.00 character limit, This field is required.'
      )

      //test with value more than 100
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('101 {enter}')
        .should('have.value', '101')
      cy.checkErrorMessages(
        '[data-cy="back-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        'The total fabric content percentage must be 100%, 100.00 character limit, Cannot exceed 100.00'
      )

      //test with value 3 decimal
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('20.001 {enter}')
        .should('have.value', '20.001')
      cy.checkErrorMessages(
        '[data-cy="back-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        'The total fabric content percentage must be 100%, 100.00 character limit, Enter with 2 decimal places only'
      )

      //test with value -1
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('-1 {enter}')
        .should('have.value', '-1')
      cy.checkErrorMessages(
        '[data-cy="back-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        'The total fabric content percentage must be 100%, 100.00 character limit, Must be greater than 0.00'
      )

      //test with value 0
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('0 {enter}')
        .should('have.value', '0')
      cy.checkErrorMessages(
        '[data-cy="back-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        'The total fabric content percentage must be 100%, 100.00 character limit, Must be greater than 0.00'
      )

      //test with empty content
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('100 {enter}')
        .should('have.value', '100')
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] .ease-out svg').click()
      cy.get('body').click(1, 1)
      cy.checkErrorMessages(
        '[data-cy="back-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        MANDATORY_FIELD
      )

      //test with empty content value
      temp = generateRandomString(100)
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      ).clear()
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')
      cy.checkErrorMessages(
        '[data-cy="back-side-specification"] [data-cy="content-box"] [data-cy="hintError"]',
        MANDATORY_FIELD
      )

      //test with max value for content and content value
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="content-text-value"] input'
      )
        .type('100')
        .should('have.value', '100')

      temp = generateRandomString(501)
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="finish-info"]'
      ).click()
      cy.get('[data-cy="f-popper-body"] input')
        .type(`${temp}`)
        .should('have.value', temp.slice(0, 500))
        .type('{enter}')
      cy.get('body').click(1, 1)

      // //verify color info
      temp = generateRandomString(101)
      cy.get('[data-cy="back-side-specification"] [data-cy="color-info"] input')
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')
      cy.checkErrorMessages(
        '[data-cy="back-side-specification"] [data-cy="color-info"] [data-cy="hintError"]',
        '100.00 character limit'
      )

      //empty value
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="color-info"]'
      ).click()
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="color-info"] input'
      ).clear()

      //max length
      temp = generateRandomString(100)
      cy.get('[data-cy="back-side-specification"] [data-cy="color-info"] input')
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')

      //verify pattern info
      temp = generateRandomString(101)
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="pattern-info"] input'
      )
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')
      cy.checkErrorMessages(
        '[data-cy="back-side-specification"] [data-cy="pattern-info"] [data-cy="hintError"]',
        '100.00 character limit'
      )

      //empty value
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="pattern-info"]'
      ).click()
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="pattern-info"] input'
      ).clear()

      //max length
      temp = generateRandomString(100)
      cy.get(
        '[data-cy="back-side-specification"] [data-cy="pattern-info"] input'
      )
        .type(`${temp}`)
        .should('have.value', temp)
        .type('{enter}')

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
      cy.get('[data-cy="assets-item-grid"]').eq(0).trigger('mouseenter')
      cy.wait(300)
      cy.get('[data-cy="assets-item-grid"]').eq(0).click()
      cy.wait(300)
      // check faceSideSep1 value correct
      cy.get('[data-cy="value-of-features"] p').should('not.be.empty')
      // check middleSideSep1 value correct
      cy.get('[data-cy="filter-range"]>div').eq(1).click()
      cy.get('[data-cy="value-of-features"] p').should('not.be.empty')
      // check backSideSep1 value correct
      cy.get('[data-cy="filter-range"]>div').eq(2).click()
      cy.get('[data-cy="value-of-features"] p').should('not.be.empty')
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
