import { expect } from '@playwright/test'
import test from './domain/test'
import { urls } from './domain/routes'
import { initialOrg } from './domain/org'

test.describe.configure({ mode: 'parallel' })

test.beforeEach(async ({ page, orgPage, assetPage }) => {
  await page.goto(urls.index)

  await orgPage.clickOrgByName(initialOrg.orgName)
  await assetPage.clickFirstSideBarGroup()
  await assetPage.clickUploadPageIcon()
  await assetPage.clickMassUploadBtn()
})

test.describe('Mass Upload', () => {
  test.describe('Case 1: Show Error Note', () => {
    test('Case 1-1: Not support file format', async ({ assetPage }) => {
      await assetPage.clickBrowseFileBtn()
      await assetPage.attachInputFile('tests/files/pdf/demoImage1.pdf') // 非 xlsx 檔案

      await expect(assetPage.uploadErrorElement()).toBeVisible()
      await expect(assetPage.uploadBtnElement()).toBeDisabled()
    })

    test('Case 1-2: File size exceed the limit', async ({ assetPage }) => {
      await assetPage.clickBrowseFileBtn()
      await assetPage.attachInputFile('tests/files/image/over20mbImage.jpeg') // 超過20mb檔案

      await expect(assetPage.uploadErrorElement()).toBeVisible()
      await expect(assetPage.uploadBtnElement()).toBeDisabled()
    })
  })

  test.describe('Case 2: Create Successfully', () => {
    test('Case 2-1: Successfully upload excel to server and reaching progress page.', async ({
      page,
      assetPage,
    }) => {
      await assetPage.clickBrowseFileBtn()
      await assetPage.attachInputFile('tests/files/excel/all-correct.xlsx') // 正常檔案
      await assetPage.clickUploadBtn()
      await expect(assetPage.howToScanElement()).toBeVisible()

      await assetPage.clickUploadBtn()
      await expect(page).toHaveURL(/\/progress\/excel/)
    })
  })

  test.describe('Case 3: Create Failed', () => {
    test('Case 3-1: Required field not filled', async ({ assetPage }) => {
      await assetPage.clickBrowseFileBtn()
      await assetPage.attachInputFile(
        'tests/files/excel/required-not-filled.xlsx'
      ) // 必填未填
      await assetPage.clickUploadBtn()

      await expect(assetPage.uploadFailedMessageElement()).toBeVisible()
      await expect(assetPage.uploadBtnElement()).toBeDisabled()
    })

    test('Case 3-2: ContentList value is invalid, show error message', async ({
      assetPage,
    }) => {
      await assetPage.clickBrowseFileBtn()
      await assetPage.attachInputFile('tests/files/excel/content-not-100.xlsx') // content 相加不是 100
      await assetPage.clickUploadBtn()
      await expect(assetPage.uploadFailedMessageElement()).toBeVisible()
      await expect(assetPage.uploadBtnElement()).toBeDisabled()
    })
  })
})
