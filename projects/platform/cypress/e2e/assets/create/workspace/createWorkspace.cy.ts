import { ERROR_MESSAGES } from '../../../../constants'
import { generateRandomString } from '../../../../utils/string'

context('Verify create workspace and collection', () => {
  beforeEach(() => {
    cy.login()
    //verify item 1 exist
    checkAssetCreatedOrNot(asset1)
    //verify item 2 exist
    cy.get('[data-cy="child-sidebar-org-1-6-workspace"]').click({ force: true })
    cy.waitLoadingDissmissed()
    checkAssetCreatedOrNot(asset2)
    //click workspace menu on sidebar
    cy.get('[data-cy="child-sidebar-org-1-6-workspace"]').click({ force: true })
  })
  const { MANDATORY_FIELD } = ERROR_MESSAGES
  let collectionName = generateRandomString(101)
  const asset1 = 'asset qa-test-e2e'
  const asset2 = 'asset qa-test-material'
  let description = generateRandomString(1001)
  function deleteAssetFromCollection(selectedAsset: string) {
    //click the tooltip
    cy.get(`[data-cy="${selectedAsset}"] [data-cy="tooltip"]`)
      .first()
      .click({ force: true })
    cy.get('[data-cy="f-context-menu"]').should('be.visible')
    //delete the selected material
    cy.get('[data-cy="delete-material-inside-collection"]').click({
      force: true,
    })
    //confirm
    cy.get('[data-cy="modal-confirm-primary"]').click({ force: true })
  }

  function addAssetToCollection(selectedAsset: string) {
    //click add asset button
    cy.get('[data-cy="add-asset-inside-workspace"]').click()
    cy.get('[data-cy="asset-item-workspace-0"]').should('exist')
    //verify cancel and add button
    cy.get('[data-cy="modal-add-asset-in-collection"]')
      .find('[data-cy="modal-behavior_primary"]')
      .should('be.disabled')
    cy.get('[data-cy="modal-add-asset-in-collection"]')
      .find('[data-cy="modal-behavior_secondary"]')
      .should('not.be.disabled')
    //add one asset
    cy.get('[data-cy="modal-add-asset-in-collection"]')
      .find('[data-cy="search-table-inside-workspace"] input')
      .type(`${selectedAsset}{enter}`)
    //check the searched item
    cy.get('[data-cy="modal-add-asset-in-collection"]')
      .find('[data-cy="asset-item-workspace-0"]')
      .should('exist')
      .find('input[type="checkbox"]')
      .check({ force: true })
    //click add
    cy.get('[data-cy="modal-add-asset-in-collection"]')
      .find('[data-cy="modal-behavior_primary"]')
      .should('not.be.disabled')
      .click({ force: true })
    cy.waitLoadingDissmissed()
  }
  function verifyMaterialExists(dataCyAttribute: string, materialId: string) {
    cy.get(`[data-cy="${dataCyAttribute}"]`)
      .contains('p', materialId)
      .should('exist')
      .should('have.text', materialId)
  }
  function checkAssetCreatedOrNot(assetName: string) {
    cy.get('[data-cy="child-sidebar-org-1-6-assets-library"]').click({
      force: true,
    })
    cy.waitLoadingDissmissed()
    cy.get('[data-cy="search-box"] input')
      .should('not.be.disabled')
      .and('be.visible')
      .type(`${assetName} {enter}`)
    cy.waitLoadingDissmissed()
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="assets-item-grid"]').length > 0) {
        cy.get('[data-cy="assets-item-grid"]')
          .first()
          .find('p')
          .invoke('text')
          .then((text) => {
            const trimmedText = text.trim()
            if (trimmedText === assetName) {
              cy.log('item already exist, will use existing item')
            } else {
              cy.createAsset(assetName, true, true)
            }
          })
      } else {
        cy.createAsset(assetName, true, true)
      }
    })
  }
  it('Verify can create workspace', () => {
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
    cy.get('[data-cy="input-collection-name"] input').type(`${collectionName}`)
    cy.get('[data-cy="input-collection-name"] input').should(
      'have.value',
      collectionName
    )

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
    cy.get('[data-cy="input-collection-name"] input').type(`${collectionName}`)
    cy.get('[data-cy="input-collection-name"] input').should(
      'have.value',
      collectionName
    )

    //verify can hit the button submit after already input for all mandatory value
    cy.get('[data-cy="modal-behavior_primary"]')
      .should('be.visible')
      .should('not.be.disabled')

    //verify description
    cy.get('[data-cy="input-description-collection"] [contenteditable="true"]')
      .type(`${description}`)
      .and('contain', description)

    cy.get('[data-cy="modal-how-to-scan-header"]')
      .closest('.absolute.w-min.rounded.card-show.pt-5.shadow-32.bg-grey-0')
      .find('.os-viewport')
      .scrollTo('bottom')

    cy.checkErrorMessages(
      '[data-cy="input-description-collection"] [data-cy="hintError"]',
      'Do not exceed 1000 characters.'
    )

    cy.get(
      '[data-cy="input-description-collection"] [contenteditable="true"]'
    ).clear()
    description = generateRandomString(1000)
    cy.get('[data-cy="input-description-collection"] [contenteditable="true"]')
      .type(`${description}`)
      .and('contain', description)

    //verify can hit the button submit button
    cy.get('[data-cy="modal-behavior_primary"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click()

    cy.waitLoadingDissmissed()
    Cypress.env('collectionName', collectionName)
  })
  it('verify can add item to workspace and delete the added item', () => {
    const updatedCollectionName = Cypress.env('collectionName')

    cy.waitLoadingDissmissed()
    //search the new created workspace
    cy.get('[data-cy="search-box"] input')
      .should('not.be.disabled')
      .and('be.visible')
      .type(`${updatedCollectionName} {enter}`)

    cy.get('[data-cy="workspace-item-0"]').should('be.visible').click()

    cy.get('[data-cy="workspace-name-header"]')
      .contains('p', updatedCollectionName)
      .should('exist')
      .should('have.class', 'font-bold')

    //add asset to collection
    addAssetToCollection(asset1)
    //verify successfully material added
    verifyMaterialExists('workspace-item-0', asset1)

    //add asset to collection
    addAssetToCollection(asset2)
    //verify successfully material added
    verifyMaterialExists('workspace-item-0', asset2)
    verifyMaterialExists('workspace-item-1', asset1)

    //add duplicated asset to collection
    addAssetToCollection(asset1)
    //verify duplicated asset will not be duplicated
    verifyMaterialExists('workspace-item-0', asset2)
    verifyMaterialExists('workspace-item-1', asset1)
    cy.get('[data-cy="workspace-item-2"]').should('not.exist')

    //delete
    deleteAssetFromCollection('workspace-item-0')
    cy.waitLoadingDissmissed()
    deleteAssetFromCollection('workspace-item-0')
  })
  it('Verify can delete workspace', () => {
    const updatedCollectionName = Cypress.env('collectionName')
    //search the new created workspace
    cy.get('[data-cy="search-box"] input')
      .should('not.be.disabled')
      .and('be.visible')
      .type(`${updatedCollectionName} {enter}`)

    cy.get('[data-cy="workspace-item-0"]')
      .should('be.visible')
      .trigger('mouseover')

    cy.get('[data-cy="workspace-item-0"] [data-cy="tooltip"]')
      .first()
      .click({ force: true })

    cy.get('[data-cy="f-context-menu"]').should('be.visible')

    //delete the new workspace
    cy.get('[data-cy="delete-collection"]').click({ force: true })

    cy.get('[data-cy="modal-confirm-primary"]').click({ force: true })
  })
})
