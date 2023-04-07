import { nextTick } from 'vue'
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
    hasLogin: false,
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
    hasLogin: (state) => state.hasLogin,
    hasSelectedStickerAddFromOG: (state) => state.hasSelectedStickerAddFromOG,
    isReload: (state) => state.isReload,
  },
  mutations: {
    SET_materialBreadcrumbList(state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_share(state, share) {
      state.share = share
    },
    SET_hasLogin(state, hasLogin) {
      state.hasLogin = hasLogin
    },
    SET_hasSelectedStickerAddFromOG(state, hasSelectedStickerAddFromOG) {
      state.hasSelectedStickerAddFromOG = hasSelectedStickerAddFromOG
    },
    SET_isReload(state, bool) {
      state.isReload = bool
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
      // https://github.com/joeymalvinni/webrtc-ip
      const { data } = await receivedShareApi.getShareReceivedInfo({
        sharingKey,
      })

      dispatch('setReceivedShareModule', data.result)
    },
    async getShareReceivedList(
      { rootGetters, getters, dispatch },
      { targetPage = 1, sharingKey, nodeKey }
    ) {
      const searchParams =
        rootGetters['helper/search/getSearchParams'](targetPage)
      const orgId = getters['hasSelectedStickerAddFromOG']
        ? rootGetters['organization/orgId']
        : undefined
      const params = {
        sharingKey,
        workspaceNodeId: nodeKey?.split('-')[1] || null,
        orgId,
        ...searchParams,
      }

      const { data } = await receivedShareApi.getShareReceivedList(params)

      dispatch('setReceivedShareModule', data.result)
    },
    async getShareReceivedMaterial(
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
      const { data } = await receivedShareApi.getShareReceivedMaterial(params)
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
    async checkHasLogin({ commit, dispatch }) {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        return
      }

      const status = await dispatch(
        'checkTokenStatus',
        {
          accessToken,
        },
        { root: true }
      )

      commit('SET_hasLogin', status !== 1)
    },
    async reload({ commit }) {
      commit('SET_isReload', false)
      await nextTick()
      commit('SET_isReload', true)
    },
  },
}
