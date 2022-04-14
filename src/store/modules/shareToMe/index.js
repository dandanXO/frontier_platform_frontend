import { ShareCollection } from '@/store/reuseModules/collection'
import NodeShareState from '@/store/reuseStates/nodeShareState.js'
import Material from '@/store/reuseModules/material.js'
import shareToMeApi from '@/apis/shareToMe'

export default {
  namespaced: true,
  modules: {
    collection: ShareCollection,
    material: Material
  },
  state: () => ({
    materialBreadcrumbList: [],
    materialShare: NodeShareState()
  }),
  getters: {
    materialBreadcrumbList: state => state.materialBreadcrumbList,
    materialShare: state => state.materialShare
  },
  mutations: {
    SET_materialBreadcrumbList (state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_materialShare (state, materialShare) {
      state.materialShare = materialShare
    }
  },
  actions: {
    setShareToMeModule ({ commit, dispatch }, data) {
      const { shareCollection, material, share, pagination, breadcrumbList } = data

      !!shareCollection && commit('SET_collection', shareCollection)
      !!material && commit('SET_material', material)
      !!breadcrumbList && commit('SET_materialBreadcrumbList', breadcrumbList)
      !!share && commit('SET_materialShare', share)
      !!pagination && dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getShareToMeList ({ rootGetters, dispatch }, { targetPage = 1, sharingId, workspaceNodeId }) {
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        sharingId,
        workspaceNodeId,
        ...searchParams
      }
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.getShareToMeList({ orgId: rootGetters['organization/orgId'], ...params })
        : await shareToMeApi.group.getShareToMeList({ groupId: rootGetters['group/groupId'], ...params })
      dispatch('setShareToMeModule', data.result)
    },
    async getShareToMeMaterial ({ rootGetters, dispatch }, { sharingId, workspaceNodeId }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.getShareToMeMaterial({ orgId: rootGetters['organization/orgId'], sharingId, workspaceNodeId })
        : await shareToMeApi.group.getShareToMeMaterial({ groupId: rootGetters['group/groupId'], sharingId, workspaceNodeId })
      dispatch('setShareToMeModule', data.result)
    },
    async cloneShareToMe ({ rootGetters }, { workspaceNodeList, targetLocationList }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.cloneShareToMe({ orgId: rootGetters['organization/orgId'], workspaceNodeList, targetLocationList })
        : await shareToMeApi.group.cloneShareToMe({ groupId: rootGetters['group/groupId'], workspaceNodeList, targetLocationList })

      return data
    },
    async deleteShareToMe ({ rootGetters }, { workspaceNodeList }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.deleteShareToMe({ orgId: rootGetters['organization/orgId'], workspaceNodeList })
        : await shareToMeApi.group.deleteShareToMe({ groupId: rootGetters['group/groupId'], workspaceNodeList })
    }
  }
}
