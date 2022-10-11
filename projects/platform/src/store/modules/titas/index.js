import titasApi from '@/apis/titas.js'
import { PublicCollection } from '@/store/reuseModules/collection'
import Material from '@/store/reuseModules/material.js'
import NodePublishState from '@/store/reuseStates/nodePublishState.js'

export default {
  namespaced: true,
  modules: {
    collection: PublicCollection,
    material: Material
  },
  state: () => ({
    titasInfo: {
      orgList: [
        // {
        //   orgId: 0,
        //   logo: "http://logo",
        //   orgName: 'org',
        //   contactEmail: 'org@gmail.com'
        // }
      ],
      collectionCoverImgList: [
        // ['http://logo',]
      ]
    },
    materialBreadcrumbList: [],
    materialPublish: NodePublishState()
  }),
  getters: {
    titasInfo: state => state.titasInfo,
    materialBreadcrumbList: state => state.materialBreadcrumbList
      .map(({ name, workspaceNodeId, workspaceNodeLocation }) => ({ name, nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}` })),
    materialPublish: state => state.materialPublish
  },
  mutations: {
    SET_titasInfo (state, titasInfo) {
      state.titasInfo = titasInfo
    },
    SET_materialBreadcrumbList (state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_materialPublish (state, materialPublish) {
      state.materialPublish = materialPublish
    }
  },
  actions: {
    async getTitasInfo ({ commit }) {
      const { data } = await titasApi.getTitasInfo()

      commit('SET_titasInfo', data.result)
    },
    async getTitasShowroomList ({ rootGetters, dispatch, commit }, { targetPage = 1, nodeKey }) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey?.split('-') || [null, null]
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        workspaceNodeId,
        workspaceNodeLocation,
        ...searchParams
      }

      const { data } = await titasApi.getTitasShowroomList(params)
      const { publicCollection, pagination } = data.result

      commit('SET_collection', publicCollection)
      dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getTitasMaterial ({ rootGetters, commit }, { nodeKey }) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey?.split('-') || [null, null]
      const { data } = await titasApi.getTitasMaterial({ orgId: rootGetters['organization/orgId'], workspaceNodeId, workspaceNodeLocation })
      const { breadcrumbList, material, publish } = data.result
      commit('SET_material', material)
      commit('SET_materialBreadcrumbList', breadcrumbList)
      commit('SET_materialPublish', publish)
    },
    async contactTitasOrg (_, params) {
      await titasApi.contactTitasOrg(params)
    }
  }
}
