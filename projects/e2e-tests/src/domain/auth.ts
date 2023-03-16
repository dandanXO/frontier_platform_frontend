import { Page } from '@playwright/test'
import { urls, apiUrl } from './routes'
import { makeId } from './utils'

export const initialUser = {
  email: 'tester@test.com',
  password: 'ab1234',
  lastName: 'e2e',
  firstName: 'test',
  locale: 'en-US',
  platform: 1,
  signupSourceType: 1,
}

export const signUpReq = () => {
  const id = makeId()
  return {
    firstName: 'test',
    lastName: `e2e_${id}`,
    email: `e2e_${id}@test.com`,
    password: 'ab1234',
  }
}

export class LoginPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async signUpApi(user: {
    email: string
    password: string
    lastName: string
    firstName: string
    locale: string
    platform: number
  }) {
    const res = await this.page.request.post(`${apiUrl}/sign-up/general`, {
      data: user,
    })
    return res.json()
  }

  async signInApi(user: { email: string; password: string; platform: number }) {
    const res = await this.page.request.post(`${apiUrl}/sign-in/general`, {
      data: user,
    })
    const body = await res.json()
    return body.result.accessToken
  }

  setInitToken(accessToken: string) {
    return this.page.addInitScript((accessToken: string) => {
      window.localStorage.setItem('accessToken', accessToken)
    }, accessToken)
  }

  getToken() {
    return this.page.evaluate(() => {
      return window.localStorage.getItem('accessToken')
    })
  }

  gotoSignInPage = () => this.page.goto(urls.signIn)
  gotoSignUpPage = () => this.page.goto(urls.signUp)
  fillFirstNameInput = (text: string) =>
    this.page.locator('[data-cy="firstName"] input').fill(text)
  fillLastNameInput = (text: string) =>
    this.page.locator('[data-cy="lastName"] input').fill(text)
  fillEmailInput = (text: string) =>
    this.page.locator('[data-cy="email"] input').fill(text)
  fillPasswordInput = (text: string) =>
    this.page.locator('[data-cy="password"] input').fill(text)
  clickLoginBtn = () => this.page.locator('[data-cy="login"]').click()
  clickAgreeBtn = () => this.page.locator('[data-cy="agree"]').click()
  clickGotoSignUpBtn = () =>
    this.page.locator('[data-cy="sign-up-page"]').click()
  clickSignUpBtn = () => this.page.locator('[data-cy="sign-up"]').click()
  clickNextBtn = () => this.page.locator('[data-cy="next"]').click()
  confirmModel = () => this.page.locator('[data-cy="modal-confirm"]')
  warningText = () => this.page.locator('.text-red-400')
}
