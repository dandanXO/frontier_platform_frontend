import { expect } from "@playwright/test"
import test from './domain/test'
import { urls } from "./domain/routes"
import { initialUser } from "./domain/auth"

test.describe.configure({ mode: "parallel" })

test.describe("User Login", () => {
  test.describe("Case 1: Request Page Successful", () => {
    test("Case 1-1: Request with token, get page data", async ({ page, loginPage }) => {
      const user = initialUser
      test.info().annotations.push({ type: 'user', description: JSON.stringify(user) })

      const accessToken = await loginPage.signInApi(initialUser)
      await loginPage.setInitToken(accessToken)
      await page.goto(urls.index)
      await page.waitForTimeout(3000)

      await expect(page).toHaveURL(urls.index)
    })
  })

  test.describe("Case 2: Request Page Failed", () => {
    test("Case 2-1: Request without token, redirect to sign-in page", async ({
      page,
    }) => {
      await page.goto(urls.index)
      await page.waitForTimeout(3000)

      await expect(page).toHaveURL(urls.signIn)
    })
  })
})
