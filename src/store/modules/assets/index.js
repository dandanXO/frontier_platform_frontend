import setVuexState from '@/utils/set-vuex-state'
import assetsApi from '@/apis/assets'

const state = () => ({
  materialList: [],
  addedMaterialList: []
})

const getters = {
  materialList: state => state.materialList,
  addedMaterialList: state => state.addedMaterialList
}

const mutations = {
  CLEAR_addedMaterialList (state) {
    state.addedMaterialList.length = 0
  },
  SET_addedMaterialList (state, list) {
    const ids = new Set(state.addedMaterialList.map(org => org.materialId))
    state.addedMaterialList = [...state.addedMaterialList, ...list.filter(newAdd => !ids.has(newAdd.materialId))]
  }
}

const actions = {
  setAssets ({ state }, data) {
    setVuexState(state, data)
  },
  async getMaterialList ({ rootGetters, dispatch }, { location, search, filter, targetPage = 1 }) {
    const params = {
      pagination: {
        perPageCount: rootGetters['helper/pagination'].perPageCount,
        targetPage
      },
      filter
    }

    if (!(search.keyword === '' && search.tagList.length === 0)) {
      params.search = search
    }

    const { data } = location === 'org'
      ? await assetsApi.org.getMaterialList({
        orgId: rootGetters['organization/orgId'],
        ...params
      })
      : await assetsApi.group.getMaterialList({
        groupId: rootGetters['group/groupId'],
        ...params
      })

    dispatch('handleResponseData', { data }, { root: true })
  },
  async mergeMaterial ({ rootGetters, dispatch }, { location, mergedList }) {
    const { data } = location === 'org'
      ? await assetsApi.org.mergeMaterial({
        orgId: rootGetters['organization/orgId'],
        mergedList
      })
      : await assetsApi.group.mergeMaterial({
        groupId: rootGetters['group/groupId'],
        mergedList
      })

    dispatch('handleResponseData', { data }, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
