import { test, Page, APIResponse } from '@playwright/test'
import { makeId } from './utils'
import { LoginPage, initialUser } from './auth'
import { apiUrl, urls } from './routes'

export interface OrgReq {
  orgName: string
  orgCategoryId: number
  countryCode: string
  uploadMaterialEmail: string
}

export interface Org extends OrgReq {
  orgId: number
}

interface Group {
  orgId: number
  groupName: string
  labelColor: string
  description: string
  uploadMaterialEmail: string
}

export const createOrgReq = () => {
  const id = makeId() + '_org'
  return {
    orgName: `e2e_${id}`,
    orgCategoryId: 1,
    countryCode: 'TW',
    uploadMaterialEmail: `e2e.org.${id}`,
    signupSourceType: 1,
  }
}

export const createGroupReq = (orgId: number) => {
  const id = makeId() + '_group'
  return {
    orgId,
    groupName: `e2e_${id}`,
    labelColor: '#139613',
    description: 'For E2E Test',
    uploadMaterialEmail: `e2e.group.${id}`,
  }
}

export const initialOrg = {
  orgName: 'e2e_initial_org',
  orgCategoryId: 1,
  countryCode: 'TW',
  uploadMaterialEmail: 'e2e.org.initial',
  signupSourceType: 1,
}

export const initialGroup = {
  groupName: 'e2e_initial_group',
  labelColor: '#139613',
  description: 'For E2E Test',
  uploadMaterialEmail: 'e2e.group.initial',
}

const apiAnnotation = async (name: string, req: object, res: APIResponse) => {
  try {
    const body = await res.json()
    const status = res.status()
    const headers = res.headers()
    test.info().annotations.push({
      type: name,
      description: JSON.stringify({
        request: req,
        status: status,
        headers,
        body,
      }),
    })
    // eslint-disable-next-line no-empty
  } catch {
    // WORKAROUND: Because test.info() should only be called during tests running.
    // So use empty catch here to prevent global-setup, global-teardown throw exception.
  }
}

export class OrgPage {
  readonly page: Page
  readonly loginPage: LoginPage

  constructor(page: Page) {
    this.page = page
    this.loginPage = new LoginPage(page)
  }

  init = async () => {
    const loginPage = new LoginPage(this.page)
    const accessToken = await loginPage.signInApi(initialUser)
    const { organizationList } = await this.getCurrentUserInfo(accessToken)
    let org = organizationList.find((o) => o.orgName === initialOrg.orgName)
    if (!org) {
      org = await this.createOrgApi(initialOrg, accessToken)
      await this.createGroupApi(
        { orgId: org.orgId, ...initialGroup },
        accessToken
      )
    }
  }

  restore = async () => {
    const loginPage = new LoginPage(this.page)
    const accessToken = await loginPage.signInApi(initialUser)
    const { organizationList } = await this.getCurrentUserInfo(accessToken)
    const org = organizationList.find((o) => o.orgName === initialOrg.orgName)
    if (!org) throw new Error('Initial Org Not Existed.')

    const group = { orgId: org.orgId, ...initialGroup }
    await this.loginPage.setInitToken(accessToken)
    await this.page.addInitScript(
      ({ org, group }: { org: Org; group: Group }) => {
        window.localStorage.setItem('organization', JSON.stringify(org))
        window.localStorage.setItem('group', JSON.stringify(group))
      },
      { org, group }
    )
  }

  cleanUp = async () => {
    const loginPage = new LoginPage(this.page)
    const accessToken = await loginPage.signInApi(initialUser)
    if (!accessToken) return

    const { organizationList } = await this.getCurrentUserInfo(accessToken)
    for (const o of organizationList) {
      if (o.orgName !== initialOrg.orgName)
        await this.deleteOrgApi(o.orgId, o.orgName, accessToken)
    }
  }

  getInitialOrg = async (): Promise<Org> =>
    this.page.evaluate(() => {
      const orgStr = window.localStorage.getItem('organization')
      return orgStr ? JSON.parse(orgStr) : null
    })

  getInitialGroup = async (): Promise<Group> =>
    this.page.evaluate(() => {
      const groupStr = window.localStorage.getItem('group')
      return groupStr ? JSON.parse(groupStr) : null
    })

  getCurrentUserInfo = async (token: string) => {
    const res = await this.page.request.get(`${apiUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const body = await res.json()
    return body.result.user
  }

  checkOrgExist = async (orgName: string, token: string): Promise<boolean> => {
    const res = await this.page.request.post(`${apiUrl}/check-name-exist`, {
      data: { orgName, orgId: null },
      headers: { Authorization: `Bearer ${token}` },
    })
    const body = await res.json()
    return body.result.isExist
  }

  createOrgApi = async (orgReq: OrgReq, token: string): Promise<Org> => {
    const res = await this.page.request.post(`${apiUrl}/org/create`, {
      data: orgReq,
      headers: { Authorization: `Bearer ${token}` },
    })
    await apiAnnotation('createOrgApi', orgReq, res)
    const body = await res.json()
    return body.result.organization
  }

  deleteOrgApi = async (orgId: number, orgName: string, token: string) => {
    return this.page.request.post(`${apiUrl}/org/delete`, {
      data: { orgId, orgName },
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  createGroupApi = async (group: Group, token: string) => {
    const res = await this.page.request.post(`${apiUrl}/org/group/create`, {
      data: group,
      headers: { Authorization: `Bearer ${token}` },
    })
    await apiAnnotation('createOrgApi', group, res)
    return res
  }

  goto = () => this.page.goto(urls.index)

  modalPrimaryBtnElement = () =>
    this.page.locator('[data-cy="modal-behavior_primary"]')
  groupAboutSaveBtnElement = () =>
    this.page.locator('[data-cy="group-about_save"]')
  orgAboutSaveBtnElement = () => this.page.locator('[data-cy="org-about_save"]')
  aboutGroupNameInputElement = () =>
    this.page.locator('[data-cy="group-about_name"] input')
  fillOrgNameInput = (text: string) =>
    this.page.locator('[data-cy="modal-create-org_name"] input').type(text)
  fillOrgEmailInput = (text: string) =>
    this.page
      .locator('[data-cy="modal-create-mail-org_email"] input')
      .type(text)
  fillGroupNameInput = (text: string) =>
    this.page.locator('[data-cy="modal-create-group_name"] input').type(text)
  fillGroupEmailInput = (text: string) =>
    this.page
      .locator('[data-cy="modal-create-mail-group_email"] input')
      .type(text)
  fillAboutOrgNameInput = (text: string) =>
    this.page.locator('[data-cy="org-about_name"] input').fill(text)
  fillAboutGroupNameInput = (text: string) =>
    this.aboutGroupNameInputElement().fill(text)
  fillDeleteConfirmInput = (text: string) =>
    this.page
      .locator('[data-cy="modal-type-text-to-confirm_input"] input')
      .fill(text)
  clickOrgByName = (orgName: string) =>
    this.page.locator('[data-cy="org"]').locator(`text="${orgName}"`).click()
  clickOrgOrGroupByName = (name: string) =>
    this.page.locator('[data-cy="list-item"]').locator(`text="${name}"`).click()
  clickManagementBtn = () =>
    this.page.locator('[data-cy="sidebar_management"]').click()
  clickCreateOrgBtn = () =>
    this.page.locator('[data-cy="open-create-org-modal"]').click()
  clickCountryDropdown = () =>
    this.page
      .locator('[data-cy="modal-create-org_country"]')
      .locator('[data-cy="input-select"]')
      .click()
  clickModalPrimaryBtn = () => this.modalPrimaryBtnElement().click()
  clickCreateGroupBtn = () =>
    this.page.locator('[data-cy="open-create-group-modal"]').click()
  clickOrgGroupDropdown = () =>
    this.page.locator('[data-cy="management_select"]').click()
  clickAboutSaveBtn = () => this.groupAboutSaveBtnElement().click()
  clickAboutOrgDeleteBtn = () =>
    this.page.locator('[data-cy="org-about_delete"]').click()
  clickAboutGroupDeleteBtn = () =>
    this.page.locator('[data-cy="group-about_delete"]').click()
  clickModalConfirmPrimary = () =>
    this.page.locator('[data-cy="modal-confirm_primary"]').click()
  clickStorageDropdown = () =>
    this.page.locator('[data-cy="modal-choose-storage_select"]').click()
  clickFirstCountry = () =>
    this.page.locator('[data-cy="list-item"]').first().click()
  clickNthCountry = (nth: number) =>
    this.page.locator('[data-cy="list-item"]').nth(nth).click()
  clickFirstCategory = () =>
    this.page
      .locator('[data-cy="modal-create-org_category"]')
      .locator('[data-cy="input-radio"]')
      .first()
      .click()
  clickAboutOrgFirstCategory = () =>
    this.page
      .locator('[data-cy="org-about_category"]')
      .locator('[data-cy="input-radio"]')
      .first()
      .click()
  clickAboutOrgCountryDropdown = () =>
    this.page
      .locator('[data-cy="org-about_country"]')
      .locator('[data-cy="input-select"]')
      .click()
  clickOrgAboutSaveBtn = () => this.orgAboutSaveBtnElement().click()
  modalConfirmElement = () => this.page.locator('[data-cy="modal-confirm"]')
  errorMsgElement = () => this.page.locator('[data-cy="error-msg"]')
  orgMenuElement = () => this.page.locator('[data-cy="menu-org_name"]')
}
