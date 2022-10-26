import codeApi from '@/apis/code'
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
    finishList: [],
  },
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
  getRoleName: (state) => (roleId) =>
    state.roleList.find((role) => role.roleId === roleId).name,
  roleLimit: (state) => state.roleLimit,
  orgRoleLimitList: (state) =>
    state.roleList.filter((role) => role.roleId !== ROLE_ID.OWNER),
  getGroupRoleLimitList: (state, getters) => (orgRoleId) => {
    if (!orgRoleId) {
      return []
    }
    return state.roleLimit
      .find((item) => item.orgRoleId === orgRoleId)
      .groupRoleIdList.map((roleId) => ({
        name: getters.getRoleName(roleId),
        roleId,
      }))
  },
  orgCategoryList: (state) => state.orgCategoryList,
  filterOptionList: (state) => state.filter,
}

const mutations = {
  SET_countryList(state, countryList) {
    state.countryList = countryList
  },
  SET_orgCategoryList(state, orgCategoryList) {
    state.orgCategoryList = orgCategoryList
  },
  SET_roleList(state, roleList) {
    state.roleList = roleList
  },
  SET_roleLimit(state, roleLimit) {
    state.roleLimit = roleLimit
  },
  SET_filter(state, filter) {
    state.filter = filter
  },
}

const actions = {
  fetchCode({ dispatch }) {
    dispatch('getRoleList')
    dispatch('getOrgCategoryList')
    dispatch('getRoleLimitTable')
    dispatch('getCountryList')
    dispatch('getFilterOptions')
  },
  async getCountryList({ commit }) {
    const { data } = await codeApi.getCountryList()
    commit('SET_countryList', data.result.code.countryList)
  },
  async getOrgCategoryList({ commit }) {
    const { data } = await codeApi.getOrgCategoryList()
    commit('SET_orgCategoryList', data.result.code.orgCategoryList)
  },
  async getRoleList({ commit }) {
    const { data } = await codeApi.getRoleList()
    commit('SET_roleList', data.result.code.roleList)
  },
  async getRoleLimitTable({ commit }) {
    const { data } = await codeApi.getRoleLimitTable()
    commit('SET_roleLimit', data.result.code.roleLimit)
  },
  async getFilterOptions({ commit }) {
    const { data } = await codeApi.getFilterOptions()
    commit('SET_filter', data.result.code.filter)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
