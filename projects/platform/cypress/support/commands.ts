/* eslint-disable cypress/unsafe-to-chain-command */
import { TEST_DATA } from '../constants'
import { generateRandomString } from '../utils/string'
import { createMiddleSide, createOneSide } from './helper'

const LOCAL_STORAGE_MEMORY: Record<string, string> = {}
const timeout = 60000

Cypress.Commands.add('checkErrorMessages', (selector, errorMessage) => {
  cy.get(selector)
    .should('have.text', errorMessage)
    .should('be.visible')
    .and('have.css', 'color', 'rgb(224, 74, 75)')
})

Cypress.Commands.add('waitLoadingDissmissed', () => {
  cy.get('[data-cy="loading-indicator"]', { timeout }).should('exist')
  cy.get('[data-cy="loading-indicator"]', { timeout }).should('not.exist')
})

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key]
  })
  cy.task(
    'info',
    `save current local storage with value: ${JSON.stringify(
      LOCAL_STORAGE_MEMORY
    )}`
  )
})

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
  cy.task('info', 'restore previous local storage data')
})

Cypress.Commands.add('chooseOrganization', () => {
  const { SELECTED_ORG } = TEST_DATA
  // select fabric Pro
  cy.get('[data-cy="org"]', { timeout }).each(($el) => {
    const value = $el.text().trim()
    if (value.includes(SELECTED_ORG)) {
      cy.wrap($el).click()
      return false
    }
  })
  cy.get('[data-cy="sidebar"]', { timeout }).should('exist')
  cy.waitLoadingDissmissed()
})

Cypress.Commands.add('login', () => {
  cy.visit('/sign-in')
  cy.get('[data-cy="email"]').type('demo_tester@frontier.cool')
  cy.get('[data-cy="email"] input').should(
    'have.value',
    'demo_tester@frontier.cool'
  )
  // typing password
  cy.get('[data-cy="password"]').type('qweasdzxc')
  cy.get('[data-cy="password"] input').should('have.value', 'qweasdzxc')
  cy.get('[data-cy="login"]').click()

  cy.chooseOrganization()
})

Cypress.Commands.add('accessPage', () => {
  cy.intercept(`${Cypress.env('CYPRESS_API_ENDPOINT')}/user`).as('userData')
  cy.viewport(1920, 1080)
  cy.visit('/')
  cy.wait('@userData')
    .its('response.statusCode')
    .then((statusCode) => {
      switch (statusCode) {
        case 401:
          cy.login()

          break

        case 200:
          cy.chooseOrganization()
          break
        default:
          break
      }
    })
})

Cypress.Commands.add('shouldNotCrash', () => {
  cy.get('[data-cy="modal-confirm-crash"]').should('not.exist')
})
Cypress.Commands.add(
  'createAsset',
  (
    itemNumber: string,
    twoSides: boolean,
    middleSide: boolean,
    side: string = 'face-side'
  ) => {
    const seasonInput = generateRandomString(10)
    //precondition enter upload page menu
    cy.get('[data-cy="upload-page"]').click({ force: true })
    cy.get('[data-cy="manual-upload"]').click()

    // choose 2 sides if twoFace set to true
    if (twoSides) {
      cy.get('[data-cy="create-material-side-information-selecter"]').click()
      cy.get('[data-cy="2-sides"]').click()
    }

    // check composite if middleSide set to true
    if (middleSide) {
      cy.get(
        '[data-cy="create-material-check-box"] input[type="checkbox"]'
      ).check({ force: true })
    }

    // Enter the item number
    cy.get('[data-cy="item-number"]').type(itemNumber, {
      parseSpecialCharSequences: false,
    })
    cy.get('[data-cy="item-number"]').click()
    cy.get('[data-cy="item-number"] input').should('have.value', itemNumber)

    // Enter season input and season input year
    cy.get('[data-cy="season-input"] [data-cy="f-popper"]').click()
    cy.get('[data-cy="f-popper-body"] input')
      .type(seasonInput, {
        parseSpecialCharSequences: false,
      })
      .should('have.value', seasonInput.slice(0, 10))
      .type('{enter}')

    cy.get('[data-cy="season-input-year"]').type(`9999 {enter}`)
    cy.get('[data-cy="item-number"]').click()
    cy.get('[data-cy="season-input-year"] input').should('have.value', '9999')

    if (twoSides) {
      createOneSide('face-side-specification', true)
      if (middleSide) {
        cy.get('[data-cy="side-select"]>div').eq(1).click()
        createMiddleSide()
        cy.get('[data-cy="side-select"]>div').eq(2).click()
        createOneSide('back-side-specification', false)
      } else {
        cy.get('[data-cy="side-select"]>div').eq(1).click()
        createOneSide('back-side-specification', false)
      }
    } else {
      createOneSide(side, true)
      if (middleSide) {
        cy.get('[data-cy="side-select"]>div').eq(1).click()
        createMiddleSide()
      }
    }

    //upload image
    cy.get('[data-cy="tab-item-upload-files"]').click()
    // click smart-upload
    cy.get('[data-cy="upload-button"]').click()
    // path（ref cypress/fixtures ）
    const filePath = 'cypress/fixtures/testImage.jpg'
    cy.get('[data-cy="modal-smart-upload_browse"]').click({ force: true })
    // mean select file on OS API
    cy.get('[data-cy="upload-btn"]').selectFile(filePath, { force: true })

    cy.get('[data-cy="modal-behavior_primary"]').click()
    cy.get('[data-cy="star-button"]').find('svg').click()

    // click save
    cy.get('[data-cy="save-button"]').click()

    // check is success for upload
    cy.get('[data-cy="modal-how-to-scan-header"]').should('have.text', 'Great')
    // click done button
    cy.get('[data-cy="modal-behavior_primary"]').click()
  }
)
