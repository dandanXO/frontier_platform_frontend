// global-setup.ts
import { chromium, FullConfig } from '@playwright/test'
import { OrgPage } from '@/domain/org'

async function globalSetup(_config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const orgPage = new OrgPage(page)
  await orgPage.cleanUp()
}

export default globalSetup
