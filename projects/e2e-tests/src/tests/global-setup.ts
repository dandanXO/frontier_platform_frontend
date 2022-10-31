// global-setup.ts
import { chromium } from '@playwright/test'
import { initialUser, LoginPage } from '@/domain/auth'
import { OrgPage } from '@/domain/org'

async function globalSetup() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const loginPage = new LoginPage(page)
  const orgPage = new OrgPage(page)
  await loginPage.signUpApi(initialUser)
  await orgPage.cleanUp()
  await orgPage.init()
}

export default globalSetup
