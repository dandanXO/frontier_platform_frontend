import { PublicCollection } from '@/store/reuseModules/collection'
import Material from '@/store/reuseModules/material.js'
import NodePublishState from '@/store/reuseStates/nodePublishState.js'
import publicLibraryApi from '@/apis/publicLibrary'

export default {
  namespaced: true,
  modules: {
    collection: PublicCollection,
    material: Material,
  },
  state: () => ({
    materialBreadcrumbList: [],
    materialPublish: NodePublishState(),
  }),
  getters: {
    materialBreadcrumbList: (state) =>
      state.materialBreadcrumbList.map(
        ({ name, workspaceNodeId, workspaceNodeLocation }) => ({
          name,
          nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
        })
      ),
    materialPublish: (state) => state.materialPublish,
  },
  mutations: {
    SET_materialBreadcrumbList(state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_materialPublish(state, materialPublish) {
      state.materialPublish = materialPublish
    },
  },
  actions: {
    setPublicLibraryModule({ commit, dispatch }, data) {
      const {
        publicCollection,
        material,
        publish,
        pagination,
        breadcrumbList,
      } = data

      !!publicCollection && commit('SET_collection', publicCollection)
      !!material && commit('SET_material', material)
      !!breadcrumbList && commit('SET_materialBreadcrumbList', breadcrumbList)
      !!publish && commit('SET_materialPublish', publish)
      !!pagination &&
        dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getPublicList(
      { rootGetters, dispatch },
      { targetPage = 1, nodeKey }
    ) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey?.split('-') || [
        null,
        null,
      ]
      const searchParams =
        rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        workspaceNodeId,
        workspaceNodeLocation,
        ...searchParams,
      }

      const { data } = await publicLibraryApi.getPublicList(params)

      dispatch('setPublicLibraryModule', data.result)
    },
    async getPublicMaterial({ rootGetters, dispatch }, { nodeKey, rank }) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey?.split('-') || [
        null,
        null,
      ]
      const params = {
        orgId: rootGetters['organization/orgId'],
        workspaceNodeId,
        workspaceNodeLocation,
      }
      const keyword = rootGetters['helper/search/keyword']
      if (keyword) {
        params['keyword'] = keyword
        params['rank'] = rank
      }
      const { data } = await publicLibraryApi.getPublicMaterial(params)
      dispatch('setPublicLibraryModule', data.result)
    },
    async cloneCheck({ rootGetters }, { nodeKeyList }) {
      const workspaceNodeList = nodeKeyList.map((nodeKey) => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation),
        }
      })
      const { data } = await publicLibraryApi.cloneCheck({
        orgId: rootGetters['organization/orgId'],
        workspaceNodeList,
      })
      return data.result.estimatedQuota
    },
    async cloneNode(
      { rootGetters },
      { nodeKeyList, targetLocationList, optional }
    ) {
      const workspaceNodeList = nodeKeyList.map((nodeKey) => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation),
        }
      })
      await publicLibraryApi.cloneNode({
        orgId: rootGetters['organization/orgId'],
        workspaceNodeList,
        targetLocationList,
        optional,
      })
    },
    async getShareTarget(_, { nodeKey, target }) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
      const { data } = await publicLibraryApi.getShareTarget({
        workspaceNodeLocation,
        workspaceNodeId,
        target,
      })

      const { success, result, message } = data
      if (!success) {
        throw message.content
      }
      return result.target
    },
    async assignedShare({ rootGetters }, { nodeKey, targetList }) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
      await publicLibraryApi.assignedShare({
        orgId: rootGetters['organization/orgId'],
        workspaceNodeLocation,
        workspaceNodeId,
        targetList,
      })
    },
    async generateCopyLink(_, { nodeKey }) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
      const { data } = await publicLibraryApi.generateCopyLink({
        workspaceNodeLocation,
        workspaceNodeId,
      })
      return data.result.key
    },
    async generateSocialMedia(_, { nodeKey, type }) {
      const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
      const { data } = await publicLibraryApi.generateSocialMedia({
        workspaceNodeLocation,
        workspaceNodeId,
        type,
      })
      return data.result.key
    },
  },
}
