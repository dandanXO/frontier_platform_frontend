import setVuexState from '@/utils/set-vuex-state'
import assetsApi from '@/apis/assets'

const state = () => ({
  materialList: []
})

const getters = {
  materialList: state => state.materialList
}

const mutations = {
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
