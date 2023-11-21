import { CodeApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const codeApi = new CodeApi(config, undefined, axios)

export default {
  getPantoneList: codeApi.getPantoneList,
  getCountryList: () =>
    axios('/code/country', {
      method: 'GET',
    }),
  getOrgCategoryList: () =>
    axios('/code/org-category-list', {
      method: 'GET',
    }),
  getRoleList: () =>
    axios('/code/role-list', {
      method: 'GET',
    }),
  getRoleLimitTable: () =>
    axios('/code/role-limit-table', {
      method: 'GET',
    }),
}
