import { expect, Page } from '@playwright/test'
import test from '@/domain/test'
import { randomNumber, randomString } from '@/domain/utils'
import { urls } from '@/domain/routes'

/**
 *  Case 1: 初始狀態
 *
 *  Case 2: 新增成功
 *    Case 2-1: 填寫正確的格式並成功送出
 *    Case 2-2: 一開始填寫錯誤，經修正後成功送出
 *
 *  Case 3: 新增失敗
 *    Case 3-1 3-2 3-3: 沒有填寫必填項（值為null）
 *    Case 3-4 3-5 3-6: 必填項 Content 格式錯誤（值為0或空字串)
 *    Case 3-7: 沒有選擇 content
 *    Case 3-8: content percentage 全部相加不足 100
 */

const addChips = async (page: Page, target: string, total: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz------++++++//////      '
  const numOfTypeManually = randomNumber(0, total)
  const numOfSelectFromList = total - numOfTypeManually

  for (let i = 0; i < numOfTypeManually; i++) {
    await page
      .locator(`[data-cy="${target}"]`)
      .locator('[data-cy="input-chips"]')
      .click({ force: true })
    await page
      .locator(`[data-cy="${target}"]`)
      .locator('input')
      .fill(`${randomString(randomNumber(0, 10), characters)}{enter}`, {
        force: true,
      })
    await page.mouse.click(0, 0)
  }
  for (let i = 0; i < numOfSelectFromList; i++) {
    await page
      .locator(`[data-cy="${target}"]`)
      .locator('[data-cy="input-chips"]')
      .click({ force: true })
    await page
      .locator('[data-cy="list-item"]')
      .nth(randomNumber(0, 10))
      .click({ force: true })
    await page.mouse.click(0, 0)
  }
}

const addContent = async (page: Page, index = 0, percentage = 100) => {
  await page
    .locator('[data-cy="content"]')
    .locator('[data-cy="input-select"]')
    .nth(index)
    .click({ force: true })
  await page.locator('[data-cy="list-item"]').nth(index).click({ force: true })
  await page
    .locator('[data-cy="percentage"]')
    .locator('input')
    .nth(index)
    .fill(percentage.toString(), { force: true })
}

test.describe.configure({ mode: 'parallel' })

test.beforeEach(async ({ page, orgPage, assetPage }) => {
  await page.goto(urls.index)

  const org = await orgPage.getInitialOrg()
  await orgPage.clickOrgByName(org.orgName)
  await assetPage.clickFirstSideBarGroup()
  await assetPage.clickUploadPageIcon()
  await assetPage.clickManualUploadBtn()
})

test.describe('Create Material', () => {
  const characters = 'D01234567890123456789~!@#$%^&*()_+<>'
  const required = ['materialNo', 'weight', 'width']

  const material = {
    materialNo: 'e2e-test',
    descriptionList: [],
    weight: Math.floor(Math.random() * 10000),
    width: Math.floor(Math.random() * 100000),
    finishList: [],
    warpYarnCount: randomString(randomNumber(0, 6), characters),
    weftYarnCount: randomString(randomNumber(0, 6), characters),
    warpDensity: randomString(randomNumber(0, 6), characters),
    weftDensity: randomString(randomNumber(0, 6), characters),
  }

  test.describe('Case 1: Initial', () => {
    test('Case 1-1: Go to right page', async ({ page }) => {
      await expect(page).toHaveURL(/\/assets\/upload\/manual/)
    })
  })

  test.describe('Case 2: Success', () => {
    test.afterEach(async ({ page }) => {
      await expect(page.locator('[data-cy="modal-how-to-scan"]')).toBeVisible()
      await expect(page).toHaveURL(/\/assets\/upload\/manual/)
      await page.locator('[data-cy="modal-behavior_primary"]').click()
    })

    test('Case 2-1: Filled complete, direct to assets page', async ({
      page,
    }) => {
      for (const key in material) {
        await page.mouse.click(0, 0)
        if (Array.isArray(material[key])) {
          await addChips(page, key, randomNumber(0, 5))
        } else {
          await page
            .locator(`[data-cy="${key}"] input`)
            .fill(material[key].toString(), { force: true })
        }
      }

      await addContent(page, 0, 100)
      await page.locator('[data-cy="create-material"]').click({ force: true })
    })

    test('Case 2-2: After revising, submit and direct to assets page', async ({
      page,
    }) => {
      for (const key in material) {
        if (Array.isArray(material[key])) {
          await addChips(page, key, randomNumber(0, 5))
        } else {
          await page
            .locator(`[data-cy="${key}"] input`)
            .fill(material[key].toString(), { force: true })
        }
      }

      await page.locator('[data-cy="create-material"]').click({ force: true })
      await expect(page.locator('[data-cy="error-msg"]')).toBeVisible()
      await addContent(page, 0, 100)
      await page.locator('[data-cy="create-material"]').click({ force: true })
    })
  })

  test.describe('Case 3: Failed', () => {
    test.afterEach(async ({ page }) => {
      await page.locator('[data-cy="create-material"]').click({ force: true })
      await expect(page.locator('[data-cy="error-msg"]')).toBeVisible()
      await expect(page).toHaveURL(/\/assets\/upload\/manual/)
    })

    Object.keys(material).forEach((name) => {
      if (required.includes(name)) {
        test(`Case 3-${
          Object.keys(material).indexOf(name) + 1
        }: ${name} never filled, show error message`, async ({ page }) => {
          for (const key in material) {
            if (name !== key) {
              if (Array.isArray(material[key])) {
                await addChips(page, key, randomNumber(0, 5))
              } else {
                await page
                  .locator(`[data-cy="${key}"] input`)
                  .fill(material[key].toString(), { force: true })
              }
            }
          }
          await addContent(page, 0, 100)
        })
      }
    })

    Object.keys(material).forEach((name) => {
      if (required.includes(name)) {
        test(`Case 3-${
          Object.keys(material).indexOf(name) + 4
        }: ${name} value is invalid, show error message`, async ({ page }) => {
          for (const key in material) {
            if (name !== key) {
              if (Array.isArray(material[key])) {
                await addChips(page, key, randomNumber(0, 5))
              } else {
                await page
                  .locator(`[data-cy="${key}"] input`)
                  .fill(material[key].toString(), { force: true })
              }
            }
          }
          await page
            .locator(`[data-cy="${name}"] input`)
            .fill('', { force: true })
          await addContent(page, 0, 100)
        })
      }
    })

    test('Case 3-7: ContentList is Empty, show error message', async ({
      page,
    }) => {
      for (const key in material) {
        if (Array.isArray(material[key])) {
          await addChips(page, key, randomNumber(0, 5))
        } else {
          await page
            .locator(`[data-cy="${key}"] input`)
            .fill(material[key].toString(), { force: true })
        }
      }
    })

    test('Case 3-8: ContentList value is invalid, show error message', async ({
      page,
    }) => {
      for (const key in material) {
        if (Array.isArray(material[key])) {
          await addChips(page, key, randomNumber(0, 5))
        } else {
          await page
            .locator(`[data-cy="${key}"] input`)
            .fill(material[key].toString(), { force: true })
        }
      }

      for (let i = 0; i < randomNumber(1, 10); i++) {
        i !== 0 &&
          (await page.locator('[data-cy="add-content"]').click({ force: true }))
        await addContent(page, i, randomNumber(1, 1000))
      }
    })
  })
})
