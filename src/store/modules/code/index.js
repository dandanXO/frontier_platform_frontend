import codeApi from '@/apis/code'
import setVuexState from '@/utils/set-vuex-state'
import { ROLE_ID } from '@/utils/constants'

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
    finishList: []
  }
})

const getters = {
  countryList: (state) => {
    const countryList = state.countryList
    countryList.sort((a, b) => {
      if (a.name > b.name) {
        return 1
      } else if (a.name < b.name) {
        return -1
      }
      return 0
    })
    return countryList
  },
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
