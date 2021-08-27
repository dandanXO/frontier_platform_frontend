import axios from '@/apis'

export default {
  getCountryList: () => axios('/code/country', {
    method: 'GET'
  }),
  getOrgCategoryList: () => axios('/code/org-category-list', {
    method: 'GET'
  }),
  getRoleList: () => axios('/code/role-list', {
    method: 'GET'
  }),
  getRoleLimitTable: () => axios('/code/role-limit-table', {
    method: 'GET'
  })
}
