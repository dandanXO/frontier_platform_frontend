import { nextTick } from 'vue'
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
    hasSelectedStickerAddFromOG: false,
    isReload: true,
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
    isReload: (state) => state.isReload,
    hasSelectedStickerAddFromOG: (state) => state.hasSelectedStickerAddFromOG,
  },
  mutations: {
    SET_materialBreadcrumbList(state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_share(state, share) {
      state.share = share
    },
    SET_isReload(state, bool) {
      state.isReload = bool
    },
    SET_hasSelectedStickerAddFromOG(state, hasSelectedStickerAddFromOG) {
      state.hasSelectedStickerAddFromOG = hasSelectedStickerAddFromOG
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
      { rootGetters, getters, dispatch },
      { targetPage = 1, sharingKey, nodeKey }
    ) {
      const searchParams =
        rootGetters['helper/search/getSearchParams'](targetPage)
      const orgId = getters['hasSelectedStickerAddFromOG']
        ? rootGetters['organization/orgId']
        : undefined
      const params = {
        ...searchParams,
        orgId,
        sharingKey,
        workspaceNodeId: nodeKey?.split('-')[1] || null,
      }

      const { data } = await embedApi.getEmbedList(params)

      dispatch('setEmbedModule', data.result)
    },
    async getEmbedMaterial(
      { rootGetters, getters, dispatch },
      { sharingKey, nodeKey, rank }
    ) {
      const orgId = getters['hasSelectedStickerAddFromOG']
        ? rootGetters['organization/orgId']
        : undefined
      const params = {
        orgId,
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
    async reload({ commit }) {
      commit('SET_isReload', false)
      await nextTick()
      commit('SET_isReload', true)
    },
  },
}
