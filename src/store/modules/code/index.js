import codeApi from '@/apis/code'
import setVuexState from '@/utils/set-vuex-state'
import { ROLE_ID, FILTER_COMPLETE } from '@/utils/constants'
import i18n from '@/utils/i18n'

const filterCompleteList = Object
  .keys(FILTER_COMPLETE)
  .map(key => ({ ...FILTER_COMPLETE[key] }))

const state = () => ({
  countryList: [],
  orgCategoryList: [],
  roleList: [],
  roleLimit: [],
  filter: {
    categoryList: [],
    contentList: [],
    patternList: [],
    colorList: [],
    finishList: [],
    completeList: filterCompleteList,
    priceList: [
      {
        text: i18n.global.t('RR0096'),
        value: true
      },
      {
        text: i18n.global.t('RR0097'),
        value: false
      }
    ]
  }
})

const getters = {
  countryList: (state) => state.countryList,
  roleList: (state) => state.roleList,
  getRoleName: (state) => (roleId) => state.roleList.find(role => role.roleId === roleId).name,
  roleLimit: (state) => state.roleLimit,
  orgRoleLimitList: (state) => state.roleList.filter(role => role.roleId !== ROLE_ID.OWNER),
  getGroupRoleLimitList: (state, getters) => (orgRoleId) => {
    if (!orgRoleId) {
      return []
    }
    return state.roleLimit
      .find(item => item.orgRoleId === orgRoleId).groupRoleIdList
      .map(roleId => ({
        name: getters.getRoleName(roleId),
        roleId
      }))
  },
  orgCategoryList: (state) => state.orgCategoryList,
  filterOptionList: (state) => state.filter
}

const actions = {
  setCode ({ state }, data) {
    setVuexState(state, data)
  },
  async getCountryList ({ dispatch }) {
    const { data } = await codeApi.getCountryList()
    dispatch('handleResponseData', { data }, { root: true })
  },
  async getOrgCategoryList ({ dispatch }) {
    const { data } = await codeApi.getOrgCategoryList()
    dispatch('handleResponseData', { data }, { root: true })
  },
  async getRoleList ({ dispatch }) {
    const { data } = await codeApi.getRoleList()
    dispatch('handleResponseData', { data }, { root: true })
  },
  async getRoleLimitTable ({ dispatch }) {
    const { data } = await codeApi.getRoleLimitTable()
    dispatch('handleResponseData', { data }, { root: true })
  },
  async getFilterOptions ({ dispatch }) {
    const { data } = await codeApi.getFilterOptions()
    dispatch('handleResponseData', { data }, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
