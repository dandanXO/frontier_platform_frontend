import { WorkspaceCollection } from '@/store/reuseModules/collection'
import NodeShareState from '@/store/reuseStates/nodeShareState.js'
import Material from '@/store/reuseModules/material.js'
import receivedShareApi from '@/apis/receivedShare'

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
    setReceivedShareModule({ commit, dispatch }, data) {
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
    async getShareReceivedInfo({ dispatch }, { sharingKey }) {
      const { data } = await receivedShareApi.getShareReceivedInfo({
        sharingKey,
      })

      dispatch('setReceivedShareModule', data.result)
    },
    async getShareReceivedList(
      { rootGetters, dispatch },
      { targetPage = 1, sharingKey, nodeKey }
    ) {
      const searchParams =
        rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        sharingKey,
        workspaceNodeId: nodeKey?.split('-')[1] || null,
        ...searchParams,
      }

      const { data } = await receivedShareApi.getShareReceivedList(params)

      dispatch('setReceivedShareModule', data.result)
    },
    async getShareReceivedMaterial({ dispatch }, { sharingKey, nodeKey }) {
      const { data } = await receivedShareApi.getShareReceivedMaterial({
        sharingKey,
        workspaceNodeId: nodeKey.split('-')[1],
      })
      dispatch('setReceivedShareModule', data.result)
    },
    async checkShareReceivedPermission({ getters }, { type }) {
      const { data } = await receivedShareApi.checkShareReceivedPermission({
        sharingKey: getters.share.sharingKey,
        type,
      })
      const { success, result } = data

      if (success) {
        return result.allow
      }
    },
    async saveShareReceived({ getters }, { orgId, groupId }) {
      await receivedShareApi.saveShareReceived({
        sharingKey: getters.share.sharingKey,
        orgId,
        groupId,
      })
    },
    async cloneCheckShareReceived(_, { orgId, nodeKeyList }) {
      const workspaceNodeList = nodeKeyList.map((nodeKey) => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation),
        }
      })
      const { data } = await receivedShareApi.cloneCheckShareReceived({
        orgId,
        workspaceNodeList,
      })
      return data.result.estimatedQuota
    },
    async cloneShareReceived(
      { getters },
      { orgId, nodeKeyList, targetLocationList, optional }
    ) {
      const workspaceNodeList = nodeKeyList.map((nodeKey) => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation),
        }
      })
      await receivedShareApi.cloneShareReceived({
        sharingKey: getters.share.sharingKey,
        orgId,
        workspaceNodeList,
        targetLocationList,
        optional,
      })
    },
  },
}
