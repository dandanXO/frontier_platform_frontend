import { PublicCollection } from '@/store/reuseModules/collection'
import Material from '@/store/reuseModules/material.js'
import NodePublishState from '@/store/reuseStates/nodePublishState.js'
import publicLibraryApi from '@/apis/publicLibrary'

export default {
  namespaced: true,
  modules: {
    collection: PublicCollection,
    material: Material
  },
  state: () => ({
    materialBreadcrumbList: [],
    materialPublish: NodePublishState()
  }),
  getters: {
    materialBreadcrumbList: state => state.materialBreadcrumbList,
    materialPublish: state => state.materialPublish
  },
  mutations: {
    SET_materialBreadcrumbList (state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_materialPublish (state, materialPublish) {
      state.materialPublish = materialPublish
    }
  },
  actions: {
    setPublicLibraryModule ({ commit, dispatch }, data) {
      const { publicCollection, material, publish, pagination, breadcrumbList } = data

      !!publicCollection && commit('SET_collection', publicCollection)
      !!material && commit('SET_material', material)
      !!breadcrumbList && commit('SET_materialBreadcrumbList', breadcrumbList)
      !!publish && commit('SET_materialPublish', publish)
      !!pagination && dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getPublicList ({ rootGetters, dispatch }, { targetPage = 1, workspaceNodeId, workspaceNodeLocation }) {
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        workspaceNodeId,
        workspaceNodeLocation,
        ...searchParams
      }

      const { data } = await publicLibraryApi.getPublicList(params)

      dispatch('setPublicLibraryModule', data.result)
    },
    async getPublicMaterial ({ dispatch }, { workspaceNodeId, workspaceNodeLocation }) {
      const { data } = await publicLibraryApi.getPublicMaterial({ workspaceNodeId, workspaceNodeLocation })
      dispatch('setPublicLibraryModule', data.result)
    },
    async cloneNode ({ rootGetters }, { workspaceNodeList, targetLocationList }) {
      await publicLibraryApi.cloneNode({ orgId: rootGetters['organization/orgId'], workspaceNodeList, targetLocationList })
    },
    async getShareTarget (_, { workspaceNodeLocation, workspaceNodeId, target }) {
      const { data } = await publicLibraryApi.getShareTarget({ workspaceNodeLocation, workspaceNodeId, target })

      const { success, result, message } = data
      if (!success) {
        throw message.content
      }
      return result.target
    },
    async assignedShare ({ rootGetters }, { workspaceNodeLocation, workspaceNodeId, targetList }) {
      await publicLibraryApi.assignedShare({ orgId: rootGetters['organization/orgId'], workspaceNodeLocation, workspaceNodeId, targetList })
    },
    async generateCopyLink (_, { workspaceNodeLocation, workspaceNodeId }) {
      const { data } = await publicLibraryApi.generateCopyLink({ workspaceNodeLocation, workspaceNodeId })
      return data.result.key
    },
    async generateSocialMedia (_, { workspaceNodeLocation, workspaceNodeId, type }) {
      const { data } = await publicLibraryApi.generateSocialMedia({ workspaceNodeLocation, workspaceNodeId, type })
      return data.result.key
    }
  }
}
