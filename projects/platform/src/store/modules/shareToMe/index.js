import { ShareCollection } from '@/store/reuseModules/collection'
import NodeShareState from '@/store/reuseStates/nodeShareState.js'
import Material from '@/store/reuseModules/material.js'
import shareToMeApi from '@/apis/shareToMe'

export default {
  namespaced: true,
  modules: {
    collection: ShareCollection,
    material: Material,
  },
  state: () => ({
    materialBreadcrumbList: [],
    materialShare: NodeShareState(),
  }),
  getters: {
    materialBreadcrumbList: (state) =>
      state.materialBreadcrumbList.map(
        ({ name, workspaceNodeId, workspaceNodeLocation }) => ({
          name,
          nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
        })
      ),
    materialShare: (state) => state.materialShare,
  },
  mutations: {
    SET_materialBreadcrumbList(state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_materialShare(state, materialShare) {
      state.materialShare = materialShare
    },
  },
  actions: {
    async callShareToMeApi({ rootGetters }, { func, params = {} }) {
      return await shareToMeApi[func](
        rootGetters['helper/routeLocation'],
        rootGetters['helper/routeLocationId'],
        params
      )
    },
    setShareToMeModule({ commit, dispatch }, data) {
      const { shareCollection, material, share, pagination, breadcrumbList } =
        data

      !!shareCollection && commit('SET_collection', shareCollection)
      !!material && commit('SET_material', material)
      !!breadcrumbList && commit('SET_materialBreadcrumbList', breadcrumbList)
      !!share && commit('SET_materialShare', share)
      !!pagination &&
        dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getShareToMeList(
      { rootGetters, dispatch },
      { targetPage = 1, sharingId, nodeKey }
    ) {
      const searchParams =
        rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        sharingId,
        workspaceNodeId: nodeKey?.split('-')[1] || null,
        ...searchParams,
      }

      const { data } = await dispatch('callShareToMeApi', {
        func: 'getShareToMeList',
        params,
      })
      dispatch('setShareToMeModule', data.result)
    },
    async getShareToMeMaterial(
      { rootGetters, dispatch },
      { sharingId, nodeKey, rank }
    ) {
      const workspaceNodeId = nodeKey.split('-')[1]
      const params = {
        sharingId,
        workspaceNodeId,
      }
      const keyword = rootGetters['helper/search/keyword']
      if (keyword) {
        params['keyword'] = keyword
        params['rank'] = rank
      }
      const { data } = await dispatch('callShareToMeApi', {
        func: 'getShareToMeMaterial',
        params,
      })
      dispatch('setShareToMeModule', data.result)
    },
    async cloneCheckShareToMe({ dispatch }, { nodeKeyList }) {
      const workspaceNodeList = nodeKeyList.map((nodeKey) => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation),
        }
      })
      const { data } = await dispatch('callShareToMeApi', {
        func: 'cloneCheckShareToMe',
        params: { workspaceNodeList },
      })
      return data.result.estimatedQuota
    },
    async cloneShareToMe({ dispatch }, params) {
      const { nodeKeyList, sharingId, targetLocationList, optional } = params
      const workspaceNodeList = nodeKeyList.map((nodeKey) => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation),
        }
      })
      const tempParams = {
        sharingId,
        workspaceNodeList,
        targetLocationList,
        optional,
      }
      await dispatch('callShareToMeApi', {
        func: 'cloneShareToMe',
        params: tempParams,
      })
    },
    async deleteShareToMe({ dispatch }, { nodeKeyList }) {
      const workspaceNodeList = nodeKeyList.map((nodeKey) => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation),
        }
      })
      await dispatch('callShareToMeApi', {
        func: 'deleteShareToMe',
        params: { workspaceNodeList },
      })
    },
  },
}
