import { expect, Page } from '@playwright/test'
import test from './domain/test'
import { urls } from './domain/routes'

/**
 *  Case 1: 上傳成功
 * 		Case 1-1: Step1 點擊 Browse 按鈕，上傳任意大小符合規定的圖片
 * 							Step2 透過 ui 刪除其中1張
 * 							Step3 確定上傳總數正確，點擊 Upload 按鈕
 * 							Step4 確定上傳總數正確，點擊 View Upload Progress 按鈕
 *
 *  Case 2: 上傳失敗
 *    Case 2-1: 點擊 Browse 按鈕上傳任意圖片時，其中有圖片大小超過 20mb，顯示錯誤訊息
 * 		Case 2-2: 透過 Drag & Drop 上傳任意圖片時，其中有圖片大小超過 20mb，顯示錯誤訊息
 *    Case 2-3: 透過 Drag & Drop 上傳任意圖片時，其中有檔案格式不支援，顯示錯誤訊息
 *
 * 請注意！上傳 dpi 不合規格的圖片時，屬於 2-1 的測試範疇（即使到了 Progress page 該布片最後的狀態是 Unsuccessful）
 *
 */

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const withFileFolder = (fileName: string) => 'tests/files/' + fileName

const correctFileList = [
  'image/demoImage1.jpeg',
  'image/demoImage2.jpeg',
  'image/demoImage3.png',
].map(withFileFolder)
const oversizeFileList = [
  'image/demoImage1.jpeg',
  'image/over20mbImage.jpeg',
].map(withFileFolder)
const formatNotSupportFileList = [
  'image/demoImage1.jpeg',
  'pdf/demoImage1.pdf',
].map(withFileFolder)

test.beforeEach(async ({ page, orgPage, assetPage }) => {
  await orgPage.init()
  await page.goto(urls.index)

  const org = await orgPage.getInitialOrg()
  await orgPage.clickOrgByName(org.orgName)
  await assetPage.clickFirstSideBarGroup()
  await assetPage.clickUploadPageIcon()
  await assetPage.clickSmartUploadBtn()
})

test.describe.configure({ mode: 'parallel' })

test.describe('Upload Material Image ', () => {
  test.setTimeout(60 * 1000)

  test.describe('Case 1: Success', () => {
    test('Case 1-1: Successfully upload material to server and reaching progress page', async ({
      page,
    }) => {
      // Step1 點擊 Browse 按鈕，上傳任意大小符合規定的圖片
      await page.locator('[data-cy="modal-smart-upload_browse"]').click()
      await page
        .locator('[data-cy="upload-btn"]')
        .setInputFiles(correctFileList)

      // Step2 透過 ui 刪除其中1張
      await page
        .locator('[data-cy="modal-smart-upload_remove"]')
        .nth(randomNumber(0, 2))
        .click({ force: true })

      const expectCount = correctFileList.length - 1

      // Step3 確定上傳總數正確，點擊 Upload 按鈕
      await expect(
        page.locator('[data-cy="modal-smart-upload_item"]')
      ).toHaveCount(expectCount)
      await page.locator('[data-cy="modal-behavior_primary"]').click()
      await expect(
        page.locator('[data-cy="modal-behavior_primary"]')
      ).not.toBeVisible()

      // Step4 所有檔案上傳到S3後，點擊 View Upload Progress 按鈕
      await expect(
        page.locator('[data-cy="modal-behavior_primary"]')
      ).toBeEnabled({ timeout: 30 * 1000 })
      await expect(
        page.locator('[data-cy=modal-smart-upload_done]')
      ).toHaveCount(expectCount)

      await page.locator('[data-cy="modal-behavior_primary"]').click()
      await page.waitForNavigation({ waitUntil: 'networkidle' })
      await expect(page).toHaveURL(/\/progress\/material/)
    })
  })

  test.describe('Case 2: Failed', () => {
    test('Case 2-1: Click button and choose over limited size files', async ({
      page,
    }) => {
      await page.locator('[data-cy="modal-smart-upload_browse"]').click()
      await page
        .locator('[data-cy="upload-btn"]')
        .setInputFiles(oversizeFileList)
      await expect(
        page.locator('[data-cy="modal-smart-upload_error"]')
      ).toBeVisible()
      await expect(
        page.locator('[data-cy="modal-behavior_primary"]')
      ).toBeDisabled()
    })

    test('Case 2-2: Drag&Drop over limited size files', async ({ page }) => {
      await page.locator('[data-cy="modal-smart-upload_browse"]').click()
      await page
        .locator('[data-cy="upload-btn"]')
        .setInputFiles(oversizeFileList)
      await expect(
        page.locator('[data-cy="modal-smart-upload_error"]')
      ).toBeVisible()
      await expect(
        page.locator('[data-cy="modal-behavior_primary"]')
      ).toBeDisabled()
    })

    test('Case 2-3: Drag&Drop files that format not support.', async ({
      page,
    }) => {
      await page.locator('[data-cy="modal-smart-upload_browse"]').click()
      await page
        .locator('[data-cy="upload-btn"]')
        .setInputFiles(formatNotSupportFileList)
      await expect(
        page.locator('[data-cy="modal-smart-upload_error"]')
      ).toBeVisible()
      await expect(
        page.locator('[data-cy="modal-behavior_primary"]')
      ).toBeDisabled()
    })
  })
})
