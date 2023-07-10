import assetsApi from '@/apis/assets'

export default {
  namespaced: true,
  state: () => ({
    materialProgressList: [],
    u3mProgressList: [],
    excelProgressList: [],
  }),
  getters: {
    materialProgressList: (state) => state.materialProgressList,
    u3mProgressList: (state) => state.u3mProgressList,
    excelProgressList: (state) => state.excelProgressList,
  },
  mutations: {
    SET_materialProgressList(state, materialProgressList) {
      state.materialProgressList = materialProgressList
    },
    SET_u3mProgressList(state, u3mProgressList) {
      state.u3mProgressList = u3mProgressList
    },
    SET_excelProgressList(state, excelProgressList) {
      state.excelProgressList = excelProgressList
    },
  },
  actions: {
    async callAssetsApi({ rootGetters }, { func, params = {} }) {
      return await assetsApi[func](
        rootGetters['helper/routeLocation'],
        rootGetters['helper/routeLocationId'],
        params
      )
    },
    async getMaterialUploadProgress({ dispatch, commit }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'getMaterialUploadProgress',
        params,
      })
      commit('SET_materialProgressList', data.result.materialProgressList)
      return data.result
    },
    async getU3mUploadProgress({ dispatch, commit }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'getU3mUploadProgress',
        params,
      })
      commit('SET_u3mProgressList', data.result.u3mProgressList)
      return data.result
    },
    async getExcelUploadProgress({ dispatch, commit }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'getExcelUploadProgress',
        params,
      })
      commit('SET_excelProgressList', data.result.excelProgressList)
      return data.result
    },
    async cancelMaterialUploadProgress({ dispatch }, params) {
      await dispatch('callAssetsApi', {
        func: 'cancelMaterialUploadProgress',
        params,
      })
    },
    async cancelU3mUploadProgress({ dispatch }, params) {
      await dispatch('callAssetsApi', {
        func: 'cancelU3mUploadProgress',
        params,
      })
    },
    async cancelExcelUploadProgress({ dispatch }, params) {
      await dispatch('callAssetsApi', {
        func: 'cancelExcelUploadProgress',
        params,
      })
    },
    async getExcelUploadMaterialList({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'getExcelUploadMaterialList',
        params,
      })
      return data.result
    },
  },
}
