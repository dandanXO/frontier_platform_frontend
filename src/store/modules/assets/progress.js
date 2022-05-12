import assetsApi from '@/apis/assets'

export default {
  namespaced: true,
  state: () => ({
    materialProgressList: [],
    u3mProgressList: [],
    excelProgressList: []
  }),
  getters: {
    materialProgressList: state => state.materialProgressList,
    u3mProgressList: state => state.u3mProgressList,
    excelProgressList: state => state.excelProgressList
  },
  mutations: {
    SET_materialProgressList (state, materialProgressList) {
      state.materialProgressList = materialProgressList
    },
    SET_u3mProgressList (state, u3mProgressList) {
      state.u3mProgressList = u3mProgressList
    },
    SET_excelProgressList (state, excelProgressList) {
      state.excelProgressList = excelProgressList
    },
  },
  actions: {
    async getMaterialUploadProgress ({ rootGetters, commit }, params) {
      params.startDate = params.startDate.split('-').join('/')
      params.endDate = params.endDate.split('-').join('/')
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getMaterialUploadProgress({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.getMaterialUploadProgress({ groupId: rootGetters['group/groupId'], ...params })

      commit('SET_materialProgressList', data.result.materialProgressList)
      return data.result
    },
    async getU3mUploadProgress ({ rootGetters, commit }, params) {
      params.startDate = params.startDate.split('-').join('/')
      params.endDate = params.endDate.split('-').join('/')
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getU3mUploadProgress({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.getU3mUploadProgress({ groupId: rootGetters['group/groupId'], ...params })

      commit('SET_u3mProgressList', data.result.u3mProgressList)
      return data.result
    },
    async getExcelUploadProgress ({ rootGetters, commit }, params) {
      params.startDate = params.startDate.split('-').join('/')
      params.endDate = params.endDate.split('-').join('/')
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getExcelUploadProgress({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.getExcelUploadProgress({ groupId: rootGetters['group/groupId'], ...params })

      commit('SET_excelProgressList', data.result.excelProgressList)
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
