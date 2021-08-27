import { rest } from 'msw'
import mockUser from '@/mocks/resolvers/mockUser'
import mockOrg from '@/mocks/resolvers/mockOrg'
import mockCode from '@/mocks/resolvers/mockCode'
import deserializeUser from './middleware/deserialize-user'

const BASE_URL = process.env.VUE_APP_API_ENDPOINT

export const handlers = [
  rest.get(BASE_URL + '/code/country', mockCode.getCountryList),
  rest.get(BASE_URL + '/code/org-category-list', mockCode.getOrgCategoryList),
  rest.get(BASE_URL + '/code/role-list', mockCode.getRoleList),
  rest.get(BASE_URL + '/code/role-limit-table', mockCode.getRoleLimitTable),
  rest.post(BASE_URL + '/sign-in/general', mockUser.generalLogin),
  rest.get(BASE_URL + '/user', deserializeUser(mockUser.getUser)),
  rest.post(BASE_URL + '/user/check-email-exist', mockUser.checkEmailExist),
  rest.post(BASE_URL + '/user/change-password', mockUser.changePassword),
  rest.post(BASE_URL + '/user/forgot-password/send-email', mockUser.sendForgotPasswordEmail),
  rest.post(BASE_URL + '/user/forgot-password/verify', mockUser.verifyForgotPasswordCode),
  rest.post(BASE_URL + '/user/forgot-password/reset-password', mockUser.resetPassword),
  rest.post(BASE_URL + '/org/get', mockOrg.getOrg),
  rest.post(BASE_URL + '/org/user/get', deserializeUser(mockOrg.getOrgUser)),
  rest.post(BASE_URL + '/org/check-name-exist', deserializeUser(mockOrg.checkOrgNameExist)),
  rest.post(BASE_URL + '/org/update', deserializeUser(mockOrg.updateOrg)),
  rest.post(BASE_URL + '/org/member/change-role', deserializeUser(mockOrg.changeOrgMemberRole)),
  rest.post(BASE_URL + '/org/member/delete', deserializeUser(mockOrg.removeOrgMember)),
  rest.post(BASE_URL + '/org/member/cancel-invitation', deserializeUser(mockOrg.cancelOrgInvitation))
]
