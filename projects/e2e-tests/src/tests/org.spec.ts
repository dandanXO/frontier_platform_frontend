import { expect } from '@playwright/test'
import test from '@/domain/test'
import { initialOrg, createOrgReq } from '@/domain/org'
import { urls } from '@/domain/routes'

// test.describe.configure({ mode: "parallel" })

test.beforeEach(async ({ orgPage }) => {
  await orgPage.goto()
})

test.describe('Create Organization', () => {
  test.describe('Case 1: Successful', () => {
    test('Case 1-1: Create Organization Successfully', async ({
      page,
      orgPage,
    }) => {
      const { orgName, uploadMaterialEmail: orgEmail } = createOrgReq()

      await orgPage.clickCreateOrgBtn()
      await expect(orgPage.modalPrimaryBtnElement()).toBeDisabled()

      await orgPage.fillOrgNameInput(orgName)
      await orgPage.clickCountryDropdown()
      await orgPage.clickFirstCountry()
      await orgPage.clickFirstCategory()
      await orgPage.clickModalPrimaryBtn()
      await expect(orgPage.modalPrimaryBtnElement()).toBeDisabled()

      await orgPage.fillOrgEmailInput(orgEmail)
      await Promise.all([
        orgPage.clickModalPrimaryBtn(),
        page.waitForNavigation({ waitUntil: 'networkidle' }),
      ])

      await expect(page).not.toHaveURL(urls.index)
      await expect(page).toHaveURL(/\/public-library/)
    })
  })

  test.describe('Case 2: Failed', () => {
    test('Case 2-1: E-mail already registered', async ({ orgPage }) => {
      const { orgName } = createOrgReq()

      await orgPage.clickCreateOrgBtn()
      await expect(orgPage.modalPrimaryBtnElement()).toBeDisabled()

      await orgPage.fillOrgNameInput(orgName)
      await orgPage.clickCountryDropdown()
      await orgPage.clickFirstCountry()
      await orgPage.clickFirstCategory()
      await orgPage.clickModalPrimaryBtn()
      await expect(orgPage.modalPrimaryBtnElement()).toBeDisabled()

      await orgPage.fillOrgEmailInput(initialOrg.uploadMaterialEmail)
      await orgPage.clickModalPrimaryBtn()
      await expect(orgPage.modalConfirmElement()).toBeVisible()
    })

    test('Case 2-2: Organization name already exists', async ({ orgPage }) => {
      await orgPage.clickCreateOrgBtn()
      await orgPage.fillOrgNameInput(initialOrg.orgName)
      await orgPage.clickCountryDropdown()

      await expect(orgPage.errorMsgElement()).toBeVisible()
      await expect(orgPage.modalPrimaryBtnElement()).toBeDisabled()
    })
  })
})

test.describe('Edit Organization', () => {
  test.describe('Case 1: Successful', () => {
    test('Case 1-1: Edit Organization Successfully @debug', async ({
      loginPage,
      orgPage,
    }) => {
      const orgReq = createOrgReq()
      const token = await loginPage.getToken()
      if (!token) throw new Error('token expired')
      const originOrg = await orgPage.createOrgApi(orgReq, token)
      await orgPage.goto()
      const newOrgName = createOrgReq().orgName

      await orgPage.clickOrgByName(originOrg.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.fillAboutOrgNameInput('')
      await expect(orgPage.orgAboutSaveBtnElement()).toBeDisabled()

      await orgPage.fillAboutOrgNameInput(newOrgName)
      await orgPage.clickAboutOrgFirstCategory()
      await orgPage.clickAboutOrgCountryDropdown()
      await orgPage.clickNthCountry(1)
      await orgPage.clickOrgAboutSaveBtn()

      await expect(orgPage.orgMenuElement()).toHaveText(newOrgName)
    })
  })

  test.describe('Case 2: Failed', () => {
    test('Case 2-1: Organization name already exists', async ({
      orgPage,
      loginPage,
    }) => {
      const token = await loginPage.getToken()
      if (!token) throw new Error('token expired')
      const org = await orgPage.createOrgApi(createOrgReq(), token)
      await orgPage.goto()

      await orgPage.clickOrgByName(org.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.fillAboutOrgNameInput(initialOrg.orgName)
      await orgPage.clickOrgAboutSaveBtn()

      await expect(orgPage.errorMsgElement()).toBeVisible()
      await expect(orgPage.orgAboutSaveBtnElement()).toBeDisabled()
    })
  })
})

test.describe('Delete Organization', () => {
  test.describe('Case 1: Successful', () => {
    test('Case 1-1: Organization name is correct, delete organization', async ({
      page,
      loginPage,
      orgPage,
    }) => {
      const orgReq = createOrgReq()
      const token = await loginPage.getToken()
      if (!token) throw new Error('token expired')
      await orgPage.createOrgApi(orgReq, token)
      await orgPage.goto()

      await orgPage.clickOrgByName(orgReq.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickAboutOrgDeleteBtn()
      await orgPage.fillDeleteConfirmInput(orgReq.orgName)
      await orgPage.clickModalPrimaryBtn()
      await Promise.all([
        orgPage.clickModalConfirmPrimary(),
        page.waitForNavigation({ waitUntil: 'networkidle' }),
      ])

      await expect(page).toHaveURL(urls.index)
    })
  })

  test.describe('Case 2: Failed', () => {
    test('Case 2-1: Organization name is not correct', async ({
      loginPage,
      orgPage,
    }) => {
      const orgReq = createOrgReq()
      const token = await loginPage.getToken()
      if (!token) throw new Error('token expired')
      await orgPage.createOrgApi(orgReq, token)
      await orgPage.goto()
      const incorrectOrgName = 'incorrect org name'

      await orgPage.clickOrgByName(orgReq.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickAboutOrgDeleteBtn()
      await orgPage.fillDeleteConfirmInput(incorrectOrgName)
      await expect(orgPage.modalPrimaryBtnElement()).toBeDisabled()
    })
  })
})
