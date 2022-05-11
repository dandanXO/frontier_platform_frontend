import assetsApi from '@/apis/assets'

export default {
  namespaced: true,
  state: () => ({
    progressList: []
  }),
  getters: {
    progressList: state => state.progressList
  },
  mutations: {
    SET_progressList (state, progressList) {
      state.progressList = progressList
    }
  },
  actions: {
    async getMaterialUploadProgress ({ rootGetters, commit }, params) {
      params.startDate = params.startDate.split('-').join('/')
      params.endDate = params.endDate.split('-').join('/')
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getMaterialUploadProgress({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.getMaterialUploadProgress({ groupId: rootGetters['group/groupId'], ...params })

      commit('SET_progressList', data.result.materialProgressList)
      return data.result
    },
    async getU3mUploadProgress ({ rootGetters, commit }, params) {
      params.startDate = params.startDate.split('-').join('/')
      params.endDate = params.endDate.split('-').join('/')
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getU3mUploadProgress({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.getU3mUploadProgress({ groupId: rootGetters['group/groupId'], ...params })

      commit('SET_progressList', data.result.u3mProgressList)
      return data.result
    },
    async getExcelUploadProgress ({ rootGetters, commit }, params) {
      params.startDate = params.startDate.split('-').join('/')
      params.endDate = params.endDate.split('-').join('/')
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getExcelUploadProgress({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.getExcelUploadProgress({ groupId: rootGetters['group/groupId'], ...params })

      commit('SET_progressList', data.result.excelProgressList)
      return data.result
    },
    async cancelMaterialUploadProgress ({ rootGetters }, { materialProgressId }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.cancelMaterialUploadProgress({ orgId: rootGetters['organization/orgId'], materialProgressId })
        : await assetsApi.group.cancelMaterialUploadProgress({ groupId: rootGetters['group/groupId'], materialProgressId })
    },
    async cancelU3mUploadProgress ({ rootGetters }, { u3mProgressId }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.cancelU3mUploadProgress({ orgId: rootGetters['organization/orgId'], u3mProgressId })
        : await assetsApi.group.cancelU3mUploadProgress({ groupId: rootGetters['group/groupId'], u3mProgressId })
    },
    async cancelExcelUploadProgress ({ rootGetters }, { excelProgressId }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.cancelExcelUploadProgress({ orgId: rootGetters['organization/orgId'], excelProgressId })
        : await assetsApi.group.cancelExcelUploadProgress({ groupId: rootGetters['group/groupId'], excelProgressId })
    },
    async getExcelUploadMaterialList ({ rootGetters }, { excelProgressId }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getExcelUploadMaterialList({ orgId: rootGetters['organization/orgId'], excelProgressId })
        : await assetsApi.group.getExcelUploadMaterialList({ groupId: rootGetters['group/groupId'], excelProgressId })

      return data.result
    }
  }
}
