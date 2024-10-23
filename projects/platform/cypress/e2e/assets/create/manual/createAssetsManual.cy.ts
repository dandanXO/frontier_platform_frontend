/* eslint-disable cypress/unsafe-to-chain-command */
import { ERROR_MESSAGES } from '../../../../constants'
import { generateRandomString } from '../../../../utils/string'
import {
  verifyFieldError,
  verifyMandatoryField,
} from '../../../../support/helper'

context('Verify create asset manual by user input', () => {
  beforeEach(() => {
    cy.login()
  })

  const { MANDATORY_FIELD } = ERROR_MESSAGES
  let itemNumber = generateRandomString(51)
  let constructionType = generateRandomString(51)
  let patternInfo = generateRandomString(101)
  let featuresInput = generateRandomString(501)
  let colorInfo = generateRandomString(101)
  const seasonInput = generateRandomString(51)
  const contentText = generateRandomString(100)
  const finishInfo = generateRandomString(501)

  function verifyItemNumber() {
    // verify item-number
    verifyFieldError(
      '[data-cy="item-number"] input',
      itemNumber,
      '[data-cy="item-number"] [data-cy="hintError"]',
      '50 character limit',
      true
    )
    verifyMandatoryField(
      '[data-cy="item-number"] input',
      '[data-cy="item-number"] [data-cy="hintError"]'
    )
    itemNumber = generateRandomString(50)
    cy.get('[data-cy="item-number"]').type(itemNumber, {
      parseSpecialCharSequences: false,
    })
    cy.get('[data-cy="item-number"]').click()
    cy.get('[data-cy="item-number"] input').should('have.value', itemNumber)
  }
  function verifySeason() {
    //verify season-input and season-input-year
    cy.get('[data-cy="season-input"] [data-cy="f-popper"]').click()
    cy.get('[data-cy="f-popper-body"] input')
      .type(seasonInput, { parseSpecialCharSequences: false })
      .should('have.value', seasonInput.slice(0, 10))
      .type('{enter}')

    //verify with negative value of season year.
    cy.get('[data-cy="season-input-year"]').type(`-1 {enter}`)
    cy.get('[data-cy="item-number"]').click()
    cy.get('[data-cy="season-input-year"] input').should('have.value', '-1')
    cy.checkErrorMessages(
      '[data-cy="season-input-year"] [data-cy="hintError"]',
      'Must be at least 0.'
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
    cy.get('[data-cy="season-input-year"] input').should('have.value', '10000')
    cy.checkErrorMessages(
      '[data-cy="season-input-year"] [data-cy="hintError"]',
      'Must be no more than 9,999.'
    )

    //verify with max value
    cy.get('[data-cy="season-input-year"]').clear()
    cy.get('[data-cy="season-input-year"]').type(`9999 {enter}`)
    cy.get('[data-cy="item-number"]').click()
    cy.get('[data-cy="season-input-year"] input').should('have.value', '9999')
  }
  function verifyWidthSection(selectedSide: string) {
    //verify cuttable width
    //verify with value less than 1
    cy.get(`[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`)
      .type('0.99')
      .should('have.value', 0.99)
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] [data-cy="hintError"]`,
      'Must be at least 1.00.'
    )

    //verify with empty value
    verifyMandatoryField(
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`,
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] [data-cy="hintError"]`
    )

    //verify with 3 decimal
    cy.get(`[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`)
      .type('1.001 {enter}')
      .should('have.value', 1.001)
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] [data-cy="hintError"]`,
      'Enter with 2 decimal places only'
    )

    //verify with max value
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`
    ).clear()
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`
    ).type('999.00 {enter}')
    cy.get('body').click()
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`
    ).should('have.value', 999)

    //verify with max decimal digit
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`
    ).clear()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="cuttable-width-text"] input`)
      .type('998.99 {enter}')
      .should('have.value', 998.99)

    //verify full width
    //verify with value less than 1
    cy.get(`[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`)
      .type('0.99')
      .should('have.value', 0.99)
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] [data-cy="hintError"]`,
      'Must be at least 1.00.'
    )

    //verify with empty value
    verifyMandatoryField(
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`,
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] [data-cy="hintError"]`
    )

    //verify with 3 decimal
    cy.get(`[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`)
      .type('1.001 {enter}')
      .should('have.value', 1.001)
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] [data-cy="hintError"]`,
      'Enter with 2 decimal places only'
    )

    //verify with max value
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`
    ).clear()
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`
    ).type('999.00 {enter}')
    cy.get('body').click()
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`
    ).should('have.value', 999)

    //verify with max decimal digit
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`
    ).clear()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="full-width-text"] input`)
      .type('998.99 {enter}')
      .should('have.value', 998.99)

    //verify weight
    //verify with value less than 1
    cy.get(`[data-cy="${selectedSide}"] [data-cy="weight-text"] input`)
      .type('0.99')
      .should('have.value', 0.99)
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="weight-text"] [data-cy="hintError"]`,
      'Must be at least 1.00.'
    )

    //verify with empty value
    verifyMandatoryField(
      `[data-cy="${selectedSide}"] [data-cy="weight-text"] input`,
      `[data-cy="${selectedSide}"] [data-cy="weight-text"] [data-cy="hintError"]`
    )

    //verify with 3 decimal
    cy.get(`[data-cy="${selectedSide}"] [data-cy="weight-text"] input`)
      .type('1.0012 {enter}')
      .should('have.value', 1.0012)
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="weight-text"] [data-cy="hintError"]`,
      'Enter with 3 decimal places only'
    )

    //verify with max value
    cy.get(`[data-cy="${selectedSide}"] [data-cy="weight-text"] input`).clear()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="weight-text"] input`).type(
      '99999.00 {enter}'
    )
    cy.get('body').click()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="weight-text"] input`).should(
      'have.value',
      99999
    )

    //verify with max decimal digit
    cy.get(`[data-cy="${selectedSide}"] [data-cy="weight-text"] input`).clear()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="weight-text"] input`)
      .type('99998.999 {enter}')
      .should('have.value', 99998.999)
  }
  function verifyOneSide(selectedSide: string, checkWidthSection: boolean) {
    // verify features-input
    featuresInput = generateRandomString(501)
    cy.get(`[data-cy="${selectedSide}"] [data-cy="features-input"]`).click()
    cy.get(`[data-cy="f-popper-body"] input`)
      .type(featuresInput, { parseSpecialCharSequences: false })
      .should('have.value', featuresInput.slice(0, 500))
      .type('{enter}')
    cy.get('body').click(0, 0)

    //verify construction type
    constructionType = generateRandomString(51)
    cy.get(`[data-cy="${selectedSide}"] [data-cy="construction-type"]`).click()
    cy.get(`[data-cy="tab-item-1"]`).last().click()
    cy.get(`[data-cy="f-popper-body"] input`)
      .type(constructionType, { parseSpecialCharSequences: false })
      .should('have.value', constructionType)
      .type('{enter}')
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="construction-type"] [data-cy="hintError"]`,
      '50 character limit'
    )

    //empty value on construction type
    cy.get(`[data-cy="${selectedSide}"] [data-cy="construction-type"]`).click()
    cy.get(`[data-cy="tab-item-1"]`).last().click()
    cy.get('[data-cy="f-popper-body"] .ease-out svg').click()
    cy.get('body').click(0, 0)
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="construction-type"] [data-cy="hintError"]`,
      MANDATORY_FIELD
    )

    //max string length on construction type
    constructionType = generateRandomString(50)
    cy.get(`[data-cy="${selectedSide}"] [data-cy="construction-type"]`).click()
    cy.get(`[data-cy="tab-item-1"]`).last().click()
    cy.get(`[data-cy="f-popper-body"] input`)
      .type(constructionType, { parseSpecialCharSequences: false })
      .should('have.value', constructionType)
      .type('{enter}')

    //test with string length more than 100
    featuresInput = generateRandomString(101)
    cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text"]`).click()
    cy.get(`[data-cy="tab-item-1"]`).last().click()
    cy.get(`[data-cy="f-popper-body"] input`)
      .type(featuresInput, { parseSpecialCharSequences: false })
      .should('have.value', featuresInput)
      .type('{enter}')
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="content-box"] [data-cy="hintError"]`,
      '100 character limit, This field is required.'
    )

    //test with value more than 100
    cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`)
      .type('101 {enter}')
      .should('have.value', '101')
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="content-box"] [data-cy="hintError"]`,
      'The total fabric content percentage must be 100%, 100 character limit, Cannot exceed 100'
    )

    //test with value 3 decimal
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`
    ).clear()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`)
      .type('20.001 {enter}')
      .should('have.value', '20.001')
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="content-box"] [data-cy="hintError"]`,
      'The total fabric content percentage must be 100%, 100 character limit, Enter with 2 decimal places only'
    )

    //test with value -1
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`
    ).clear()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`)
      .type('-1 {enter}')
      .should('have.value', '-1')
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="content-box"] [data-cy="hintError"]`,
      'The total fabric content percentage must be 100%, 100 character limit, Must be greater than 0'
    )

    //test with value 0
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`
    ).clear()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`)
      .type('0 {enter}')
      .should('have.value', '0')
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="content-box"] [data-cy="hintError"]`,
      'The total fabric content percentage must be 100%, 100 character limit, Must be greater than 0'
    )

    //test with empty content
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`
    ).clear()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`)
      .type('100 {enter}')
      .should('have.value', '100')
    cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text"]`).click()
    cy.get(`[data-cy="tab-item-1"]`).last().click()
    cy.get('[data-cy="f-popper-body"] .ease-out svg').click()
    cy.get('body').click()
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="content-box"] [data-cy="hintError"]`,
      MANDATORY_FIELD
    )

    //test with empty content value
    cy.get(
      `[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`
    ).clear()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text"]`).click()
    cy.get(`[data-cy="tab-item-1"]`).last().click()
    cy.get('[data-cy="f-popper-body"] input')
      .type(contentText)
      .should('have.value', contentText)
      .type('{enter}')
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="content-box"] [data-cy="hintError"]`,
      MANDATORY_FIELD
    )
    //test with max value for content and content value
    cy.get(`[data-cy="${selectedSide}"] [data-cy="content-text-value"] input`)
      .type('100')
      .should('have.value', '100')

    if (checkWidthSection) {
      verifyWidthSection(selectedSide)
    }

    //verify finish info
    cy.get(`[data-cy="${selectedSide}"] [data-cy="finish-info"]`).click()
    cy.get('[data-cy="f-popper-body"] input')
      .type(finishInfo)
      .should('have.value', finishInfo.slice(0, 500))
      .type('{enter}')
    cy.get('body').click(1, 1)

    //verify color info
    colorInfo = generateRandomString(101)
    cy.get(`[data-cy="${selectedSide}"] [data-cy="color-info"] input`)
      .type(colorInfo)
      .should('have.value', colorInfo)
      .type('{enter}')
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="color-info"] [data-cy="hintError"]`,
      '100 character limit'
    )

    //empty value
    cy.get(`[data-cy="${selectedSide}"] [data-cy="color-info"]`).click()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="color-info"] input`).clear()

    //max length
    colorInfo = generateRandomString(100)
    cy.get(`[data-cy="${selectedSide}"] [data-cy="color-info"] input`)
      .type(colorInfo)
      .should('have.value', colorInfo)
      .type('{enter}')

    //verify pattern info
    patternInfo = generateRandomString(101)
    cy.get(`[data-cy="${selectedSide}"] [data-cy="pattern-info"] input`)
      .type(patternInfo)
      .should('have.value', patternInfo)
      .type('{enter}')
    cy.checkErrorMessages(
      `[data-cy="${selectedSide}"] [data-cy="pattern-info"] [data-cy="hintError"]`,
      '100 character limit'
    )

    //empty value
    cy.get(`[data-cy="${selectedSide}"] [data-cy="pattern-info"]`).click()
    cy.get(`[data-cy="${selectedSide}"] [data-cy="pattern-info"] input`).clear()

    //max length
    patternInfo = generateRandomString(100)
    cy.get(`[data-cy="${selectedSide}"] [data-cy="pattern-info"] input`)
      .type(patternInfo)
      .should('have.value', patternInfo)
      .type('{enter}')
  }

  function verifyMiddleSide() {
    featuresInput = generateRandomString(501)
    cy.get(
      '[data-cy="middle-side-specification"] [data-cy="features-input"]'
    ).click()
    cy.get('[data-cy="f-popper-body"] input')
      .type(featuresInput, { parseSpecialCharSequences: false })
      .should('have.value', featuresInput.slice(0, 500))
      .type('{enter}')
    cy.get('body').click(0, 0)

    // verify finish info
    featuresInput = generateRandomString(501)
    cy.get(
      '[data-cy="middle-side-specification"] [data-cy="finish-info"]'
    ).click()
    cy.get('[data-cy="f-popper-body"] input')
      .type(featuresInput, { parseSpecialCharSequences: false })
      .should('have.value', featuresInput.slice(0, 500))
      .type('{enter}')
    cy.get('body').click(1, 1)
  }

  function saveAndDelete() {
    // click save
    cy.get('[data-cy="save-button"]').click()

    // check is success for upload
    cy.get('[data-cy="modal-how-to-scan-header"]').should('have.text', 'Great')
    // click done button
    cy.get('[data-cy="modal-behavior_primary"]').click()

    cy.waitLoadingDissmissed()
    //search the new created material
    cy.get('[data-cy="search-box"] input')
      .should('not.be.disabled')
      .and('be.visible')
      .type(`${itemNumber} {enter}`)

    cy.get('[data-cy="assets-item-grid"]')
      .should('be.visible')
      .trigger('mouseover')

    cy.get('[data-cy="assets-item-grid"] [data-cy="tooltip"]')
      .first()
      .click({ force: true })

    cy.get('[data-cy="f-context-menu"]').should('be.visible')

    //delete the new created material
    cy.get('[data-cy="delete-material"]').click({ force: true })

    cy.get('[data-cy="modal-confirm-primary"]').click({ force: true })
  }
  function selectMaterialSide(side: string) {
    cy.get('[data-cy="select-material-side"]')
      .should('exist')
      .and('be.visible')
      .click()
    cy.get(`[data-cy="${side}"]`).should('exist').and('be.visible').click()
  }
  it('verify create assets with 2 sides in one creation', () => {
    cy.get('[data-cy="upload-page"]').click({ force: true })

    // Face side - Manual Upload
    cy.get('[data-cy="manual-upload"]').click()
    //choose 2 sides
    cy.get('[data-cy="create-material-side-information-selecter"]').click()
    cy.get('[data-cy="2-sides"]').click()

    //check the composite checkbox
    cy.get(
      '[data-cy="create-material-check-box"] input[type="checkbox"]'
    ).check({ force: true })

    //verify item number field
    verifyItemNumber()

    //verify season field
    verifySeason()

    //verify face side
    verifyOneSide('face-side-specification', true)

    // middle side----------
    // select middle side
    cy.get('[data-cy="side-select"]>div').eq(1).click()
    verifyMiddleSide()

    // back side----------
    // select back side
    cy.get('[data-cy="side-select"]>div').eq(2).click()
    verifyOneSide('back-side-specification', false)

    //save and delete the material
    saveAndDelete()
  })

  it('Verify one side, back side only', () => {
    cy.get('[data-cy="upload-page"]').click({ force: true })
    cy.get('[data-cy="manual-upload"]').click()

    //choose 1 sides
    cy.get('[data-cy="create-material-side-information-selecter"]').click()
    cy.get('[data-cy="1-side"]').click()

    // select on back to face to back again
    selectMaterialSide('material-side-2')
    selectMaterialSide('material-side-1')
    selectMaterialSide('material-side-2')

    //check the composite checkbox
    cy.get(
      '[data-cy="create-material-check-box"] input[type="checkbox"]'
    ).check({ force: true })

    // verify back side
    //verify item number field
    verifyItemNumber()

    //verify season field
    verifySeason()

    verifyOneSide('back-side-specification', true)
    // middle side----------
    // select middle side
    cy.get('[data-cy="side-select"]>div').eq(1).click()
    verifyMiddleSide()

    //save and delete the material
    saveAndDelete()
  })

  it('Verify one side, face side only', () => {
    cy.get('[data-cy="upload-page"]').click({ force: true })
    cy.get('[data-cy="manual-upload"]').click()

    //choose 1 sides
    cy.get('[data-cy="create-material-side-information-selecter"]').click()
    cy.get('[data-cy="1-side"]').click()

    // select on back to face to back again
    selectMaterialSide('material-side-2')
    selectMaterialSide('material-side-1')
    selectMaterialSide('material-side-2')
    selectMaterialSide('material-side-1')

    //check the composite checkbox
    cy.get(
      '[data-cy="create-material-check-box"] input[type="checkbox"]'
    ).check({ force: true })

    // verify face side
    //verify item number field
    verifyItemNumber()

    //verify season field
    verifySeason()

    verifyOneSide('face-side-specification', true)
    // middle side----------
    // select middle side
    cy.get('[data-cy="side-select"]>div').eq(1).click()
    verifyMiddleSide()

    //save and delete the material
    saveAndDelete()
  })
})
