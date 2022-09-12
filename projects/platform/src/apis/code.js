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
  }),
  getFilterOptions: () => axios('/code/filter-option', {
    method: 'GET'
  }),
  getAITags: ({ searchKeyword }) => axios('/search/get-ai-tags', {
    method: 'POST',
    data: { searchKeyword }
  })
}
