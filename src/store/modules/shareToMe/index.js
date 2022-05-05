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
    materialBreadcrumbList: state => state.materialBreadcrumbList
      .map(({ name, workspaceNodeId, workspaceNodeLocation }) => ({ name, nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}` })),
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
    async getShareToMeList ({ rootGetters, dispatch }, { targetPage = 1, sharingId, nodeKey }) {
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        sharingId,
        workspaceNodeId: nodeKey?.split('-')[1] || null,
        ...searchParams
      }
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.getShareToMeList({ orgId: rootGetters['organization/orgId'], ...params })
        : await shareToMeApi.group.getShareToMeList({ groupId: rootGetters['group/groupId'], ...params })
      dispatch('setShareToMeModule', data.result)
    },
    async getShareToMeMaterial ({ rootGetters, dispatch }, { sharingId, nodeKey }) {
      const workspaceNodeId = nodeKey.split('-')[1]
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.getShareToMeMaterial({ orgId: rootGetters['organization/orgId'], sharingId, workspaceNodeId })
        : await shareToMeApi.group.getShareToMeMaterial({ groupId: rootGetters['group/groupId'], sharingId, workspaceNodeId })
      dispatch('setShareToMeModule', data.result)
    },
    async cloneCheckShareToMe ({ rootGetters }, { nodeKeyList }) {
      const workspaceNodeList = nodeKeyList.map(nodeKey => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation)
        }
      })
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.cloneCheckShareToMe({ orgId: rootGetters['organization/orgId'], workspaceNodeList })
        : await shareToMeApi.group.cloneCheckShareToMe({ groupId: rootGetters['group/groupId'], workspaceNodeList })

      return data.result.estimatedQuota
    },
    async cloneShareToMe ({ rootGetters }, { sharingId, nodeKeyList, targetLocationList, optional }) {
      const workspaceNodeList = nodeKeyList.map(nodeKey => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation)
        }
      })
      rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.cloneShareToMe({ orgId: rootGetters['organization/orgId'], sharingId, workspaceNodeList, targetLocationList, optional })
        : await shareToMeApi.group.cloneShareToMe({ groupId: rootGetters['group/groupId'], sharingId, workspaceNodeList, targetLocationList, optional })
    },
    async deleteShareToMe ({ rootGetters }, { nodeKeyList }) {
      const workspaceNodeList = nodeKeyList.map(nodeKey => {
        const [workspaceNodeLocation, workspaceNodeId] = nodeKey.split('-')
        return {
          id: Number(workspaceNodeId),
          location: Number(workspaceNodeLocation)
        }
      })
      rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.deleteShareToMe({ orgId: rootGetters['organization/orgId'], workspaceNodeList })
        : await shareToMeApi.group.deleteShareToMe({ groupId: rootGetters['group/groupId'], workspaceNodeList })
    }
  }
}
