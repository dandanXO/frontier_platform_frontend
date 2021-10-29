import setVuexState from '@/utils/set-vuex-state'
import assetsApi from '@/apis/assets'

const state = () => ({
  materialList: [],
  addedMaterialList: []
})

const getters = {
  materialList: state => state.materialList.slice(0, 10),
  addedMaterialList: state => state.addedMaterialList
}

const mutations = {
  CLEAR_addedMaterialList (state) {
    state.addedMaterialList.length = 0
  },
  SET_addedMaterialList (state, value) {
    state.addedMaterialList = value
  }
}

const actions = {
  setAssets ({ state }, data) {
    setVuexState(state, data)
  },
  async getMaterialList ({ rootGetters, dispatch }, { location, targetPage = 1 }) {
    const pagination = {
      perPageCount: 40,
      targetPage
    }
    const { data } = location === 'org'
      ? await assetsApi.org.getMaterialList({
        orgId: rootGetters['organization/orgId'],
        pagination
      })
      : await assetsApi.group.getMaterialList({
        groupId: rootGetters['group/groupId'],
        pagination
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
