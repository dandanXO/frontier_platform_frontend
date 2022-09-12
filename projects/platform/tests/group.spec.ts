import { expect } from "@playwright/test"
import test from "./domain/test"
import { createGroupReq, createOrgReq, initialGroup, initialOrg } from "./domain/org"

test.beforeEach(async ({ orgPage }) => {
  await orgPage.goto()
})

test.setTimeout(90 * 1000)

test.describe("Create Group", () => {
  test.describe("Case 1: Successful", () => {
    test("Case 1-1: Create Group Successfully", async ({ page, orgPage }) => {
      const org = await orgPage.getInitialOrg()
      const { groupName, uploadMaterialEmail: groupEmail } = createGroupReq(org.orgId)

      await orgPage.clickOrgByName(org.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickCreateGroupBtn()
      await orgPage.fillGroupNameInput(groupName)
      await orgPage.clickModalPrimaryBtn()
      await orgPage.fillGroupEmailInput(groupEmail)
      await orgPage.clickModalPrimaryBtn()
      await Promise.all([
        page.waitForLoadState("networkidle"),
        page.waitForTimeout(3000)
      ])

      await expect(orgPage.aboutGroupNameInputElement()).toHaveValue(groupName)
    })
  })

  test.describe("Case 2: Failed", () => {
    test("Case 2-1: Required field not filled", async ({ orgPage }) => {
      const org = await orgPage.getInitialOrg()

      await orgPage.clickOrgByName(org.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickCreateGroupBtn()
      await orgPage.clickModalPrimaryBtn()
      await orgPage.clickModalPrimaryBtn()

      await expect(orgPage.modalConfirmElement()).toBeVisible()
    })

    test("Case 2-2: E-mail already registered", async ({ orgPage }) => {
      const org = await orgPage.getInitialOrg()
      const groupName = createGroupReq(org.orgId).groupName
      const groupEmail = initialGroup.uploadMaterialEmail

      await orgPage.clickOrgByName(org.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickCreateGroupBtn()
      await orgPage.fillGroupNameInput(groupName)
      await orgPage.clickModalPrimaryBtn()
      await orgPage.fillGroupEmailInput(groupEmail)
      await orgPage.clickModalPrimaryBtn()

      await expect(orgPage.modalConfirmElement()).toBeVisible()
    })

    test("Case 2-3: Group name already exists", async ({ orgPage }) => {
      const org = await orgPage.getInitialOrg()
      const group = await orgPage.getInitialGroup()
      const email = createGroupReq(org.orgId).uploadMaterialEmail

      await orgPage.clickOrgByName(org.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickCreateGroupBtn()
      await orgPage.fillGroupNameInput(group.groupName)
      await orgPage.clickModalPrimaryBtn()
      await orgPage.fillGroupEmailInput(email)
      await orgPage.clickModalPrimaryBtn()

      await expect(orgPage.modalConfirmElement()).toBeVisible()
    })
  })
})

test.describe("Edit Group", () => {
  test.describe("Case 1: Successful", () => {
    test("Case 1-1: Edit Group Successfully", async ({ page, loginPage, orgPage }) => {
      const initOrg = await orgPage.getInitialOrg()
      const token = await loginPage.getToken()
      if (!token) throw new Error('token expired.')
      const originGroup = createGroupReq(initOrg.orgId)
      await orgPage.createGroupApi(originGroup, token)
      const newGroupName = createOrgReq().orgName
      await orgPage.goto()

      await orgPage.clickOrgByName(initOrg.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickOrgGroupDropdown()
      await orgPage.clickOrgOrGroupByName(originGroup.groupName)
      await orgPage.fillAboutGroupNameInput("")
      await page.mouse.click(0, 0)
      await orgPage.fillAboutGroupNameInput(newGroupName)
      await orgPage.clickAboutSaveBtn()

      await expect(orgPage.aboutGroupNameInputElement()).toHaveValue(newGroupName)
    })
  })

  test.describe("Case 2: Failed", () => {
    test("Case 2-1: Group name already exists", async ({ page, loginPage, orgPage }) => {
      const initOrg = await orgPage.getInitialOrg()
      const initGroup = await orgPage.getInitialGroup()
      const token = await loginPage.getToken()
      if (!token) throw new Error('token expired.')
      const originGroup = createGroupReq(initOrg.orgId)
      await orgPage.createGroupApi(originGroup, token)
      await orgPage.goto()

      await orgPage.clickOrgByName(initOrg.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickOrgGroupDropdown()
      await orgPage.clickOrgOrGroupByName(originGroup.groupName)
      await orgPage.fillAboutGroupNameInput(initGroup.groupName)

      await expect(orgPage.errorMsgElement()).toBeVisible()
      await expect(orgPage.groupAboutSaveBtnElement()).toBeDisabled()
    })
  })
})

test.describe("Delete Group", () => {
  test.describe("Case 1: Successful", () => {
    test("Case 1-1: Choose organization as storage, delete group successfully", async ({
      page,
      loginPage,
      orgPage,
    }) => {
      const initOrg = await orgPage.getInitialOrg()
      const token = await loginPage.getToken()
      if (!token) throw new Error('token expired.')
      const group = createGroupReq(initOrg.orgId)
      await orgPage.createGroupApi(group, token)
      await orgPage.goto()

      await orgPage.clickOrgByName(initOrg.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickOrgGroupDropdown()
      await orgPage.clickOrgOrGroupByName(group.groupName)
      await orgPage.clickAboutGroupDeleteBtn()
      await orgPage.fillDeleteConfirmInput(group.groupName)
      await orgPage.clickModalPrimaryBtn()
      await orgPage.clickModalConfirmPrimary()
      await orgPage.clickStorageDropdown()
      await orgPage.clickOrgOrGroupByName(initOrg.orgName)
      await Promise.all([
        orgPage.clickModalPrimaryBtn(),
        page.waitForNavigation({ waitUntil: 'networkidle' })
      ])

      await expect(page).toHaveURL(/\public-library/)
    })

    test("Case 1-2: Type wrong group name, cannot delete group", async ({
      loginPage,
      orgPage
    }) => {
      const initOrg = await orgPage.getInitialOrg()
      const token = await loginPage.getToken()
      if (!token) throw new Error('token expired.')
      const group = createGroupReq(initOrg.orgId)
      await orgPage.createGroupApi(group, token)
      const incorrectGroupNameInput = "incorrect group name"
      await orgPage.goto()

      await orgPage.clickOrgByName(initOrg.orgName)
      await orgPage.clickManagementBtn()
      await orgPage.clickOrgGroupDropdown()
      await orgPage.clickOrgOrGroupByName(group.groupName)
      await orgPage.clickAboutGroupDeleteBtn()
      await orgPage.fillDeleteConfirmInput(incorrectGroupNameInput)

      await expect(orgPage.modalPrimaryBtnElement()).toBeDisabled()
    })
  })
})
