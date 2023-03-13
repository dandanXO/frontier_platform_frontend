import { WorkspaceCollection } from '@/store/reuseModules/collection'
import NodeShareState from '@/store/reuseStates/nodeShareState.js'
import Material from '@/store/reuseModules/material.js'
import embedApi from '@/apis/embed'

export default {
  namespaced: true,
  modules: {
    collection: WorkspaceCollection,
    material: Material,
  },
  state: () => ({
    materialBreadcrumbList: [],
    share: NodeShareState(),
  }),
  getters: {
    materialBreadcrumbList: (state) =>
      state.materialBreadcrumbList.map(
        ({ name, workspaceNodeId, workspaceNodeLocation }) => ({
          name,
          nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
        })
      ),
    share: (state) => state.share,
    logo: (state) => state.share.logo,
  },
  mutations: {
    SET_materialBreadcrumbList(state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_share(state, share) {
      state.share = share
    },
  },
  actions: {
    setEmbedModule({ commit, dispatch }, data) {
      const {
        workspaceCollection,
        material,
        share,
        pagination,
        breadcrumbList,
      } = data

      !!workspaceCollection && commit('SET_collection', workspaceCollection)
      !!material && commit('SET_material', material)
      !!breadcrumbList && commit('SET_materialBreadcrumbList', breadcrumbList)
      !!share && commit('SET_share', share)
      !!pagination &&
        dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getEmbedInfo({ dispatch }, { sharingKey }) {
      const { data } = await embedApi.getEmbedInfo({ sharingKey })

      dispatch('setEmbedModule', data.result)
    },
    async getEmbedList(
      { rootGetters, dispatch },
      { targetPage = 1, sharingKey, nodeKey }
    ) {
      const searchParams =
        rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        ...searchParams,
        sharingKey,
        workspaceNodeId: nodeKey?.split('-')[1] || null,
      }

      const { data } = await embedApi.getEmbedList(params)

      dispatch('setEmbedModule', data.result)
    },
    async getEmbedMaterial(
      { rootGetters, dispatch },
      { sharingKey, nodeKey, rank }
    ) {
      const params = {
        sharingKey,
        workspaceNodeId: nodeKey.split('-')[1],
      }
      const keyword = rootGetters['helper/search/keyword']
      if (keyword) {
        params['keyword'] = keyword
        params['rank'] = rank
      }
      const { data } = await embedApi.getEmbedMaterial(params)
      dispatch('setEmbedModule', data.result)
    },
  },
}
