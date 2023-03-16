import { expect } from '@playwright/test'
import test from '@/domain/test'
import { urls } from '@/domain/routes'
import { initialUser, signUpReq } from '@/domain/auth'

test.describe.configure({ mode: 'parallel' })

test.beforeEach(async ({ loginPage }) => {
  await loginPage.gotoSignInPage()
})

test.describe('User Login', () => {
  test.describe('Case 1: Sign-in Successful', () => {
    test('Case 1-1: Go to right page', async ({ page, loginPage }) => {
      const user = initialUser
      test.info().annotations.push({
        type: 'user',
        description: JSON.stringify(user, null, 2),
      })

      await loginPage.fillEmailInput(initialUser.email)
      await loginPage.fillPasswordInput(initialUser.password)
      await Promise.all([
        loginPage.clickLoginBtn(),
        await page.waitForTimeout(1000),
        page.waitForNavigation({ waitUntil: 'networkidle' }),
      ])

      await expect(page).toHaveURL(/public-library/)
    })
  })

  test.describe('Case 2: Sign-in Failed', () => {
    test('Case 2-1: Wrong email or password, stay at sign-in page', async ({
      page,
      loginPage,
    }) => {
      const user = { ...initialUser, password: 'wrong-password' }
      test
        .info()
        .annotations.push({ type: 'user', description: JSON.stringify(user) })

      await loginPage.fillEmailInput(user.email)
      await loginPage.fillPasswordInput(user.password)
      await loginPage.clickLoginBtn()

      await expect(loginPage.confirmModel()).toBeVisible()
      await expect(page).toHaveURL(urls.signIn)
    })

    test('Case 2-2: Email never register, stay at sign-in page', async ({
      page,
      loginPage,
    }) => {
      const user = { email: 'abc123@gmail.com', password: 'wrong-password' }
      test
        .info()
        .annotations.push({ type: 'user', description: JSON.stringify(user) })

      await loginPage.fillEmailInput(user.email)
      await loginPage.fillPasswordInput(user.password)
      await loginPage.clickLoginBtn()

      await expect(loginPage.confirmModel()).toBeVisible()
      await expect(page).toHaveURL(urls.signIn)
    })
  })

  test.describe('Case 3: Sign-up Successful', () => {
    test('Case 3-1: Go to right page', async ({ page, loginPage }) => {
      const newUser = signUpReq()
      test.info().annotations.push({
        type: 'user',
        description: JSON.stringify(newUser),
      })

      await loginPage.clickGotoSignUpBtn()
      await loginPage.fillFirstNameInput(newUser.firstName)
      await loginPage.fillLastNameInput(newUser.lastName)
      await loginPage.fillEmailInput(newUser.email)
      await loginPage.fillPasswordInput(newUser.password)
      await loginPage.clickAgreeBtn()
      await loginPage.clickSignUpBtn()
      await Promise.all([
        loginPage.clickNextBtn(),
        page.waitForNavigation({ waitUntil: 'networkidle' }),
      ])
      await page.waitForTimeout(1000)

      await expect(page).toHaveURL(urls.index)
    })
  })

  test.describe('Case 4: Sign-up Failed', () => {
    test('Case 4-1: Email already registered', async ({ page, loginPage }) => {
      const user = initialUser
      test
        .info()
        .annotations.push({ type: 'user', description: JSON.stringify(user) })

      await loginPage.clickGotoSignUpBtn()
      await loginPage.fillFirstNameInput(initialUser.firstName)
      await loginPage.fillLastNameInput(initialUser.lastName)
      await loginPage.fillEmailInput(initialUser.email)
      await loginPage.fillPasswordInput(initialUser.password)
      await loginPage.clickAgreeBtn()
      await loginPage.clickSignUpBtn()

      await expect(loginPage.warningText()).toContainText(
        'email address already exists'
      )
      await expect(page).toHaveURL(urls.signUp)
    })
  })
})
