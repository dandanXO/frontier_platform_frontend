import { test as baseTest } from '@playwright/test'
import { LoginPage, initialUser } from './auth'
import { OrgPage } from './org'
import { AssetPage } from './asset'

type FrontierFixtures = {
  loginPage: LoginPage
  orgPage: OrgPage
  assetPage: AssetPage
}

const test = baseTest.extend<FrontierFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },
  orgPage: async ({ page }, use) => {
    const orgPage = new OrgPage(page)
    await orgPage.restore()
    await use(orgPage)
  },
  assetPage: async ({ page }, use) => {
    const assetPage = new AssetPage(page)
    await use(assetPage)
  },
})

export default test
