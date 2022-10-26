import { Page } from '@playwright/test'

export class AssetPage {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  clickFirstOrg = () => this.page.locator('[data-cy="org"]').first().click()
  clickFirstSideBarGroup = () =>
    this.page.locator('[data-cy="sidebar_location"]').first().click()
  clickUploadPageIcon = () =>
    this.page.locator('[data-cy="upload-page"]').click()
  clickMassUploadBtn = () =>
    this.page.locator('[data-cy="mass-upload"]').click()
  clickSmartUploadBtn = () =>
    this.page.locator('[data-cy="smart-upload"]').click()
  clickManualUploadBtn = () =>
    this.page.locator('[data-cy="manual-upload"]').click()
  clickBrowseFileBtn = () =>
    this.page.locator('[data-cy="input-text-btn"]').click()
  clickUploadBtn = () => this.uploadBtnElement().click()
  uploadBtnElement = () =>
    this.page.locator('[data-cy="modal-behavior_primary"]')
  attachInputFile = (filePath: string) =>
    this.page.locator('[data-cy="upload-btn"]').setInputFiles(filePath)
  uploadErrorElement = () =>
    this.page.locator('[data-cy="modal-mass-upload_error"]')
  uploadFailedMessageElement = () =>
    this.page.locator('[data-cy="modal-mass-upload_failed"]')
  howToScanElement = () => this.page.locator('[data-cy="modal-how-to-scan"]')
}
