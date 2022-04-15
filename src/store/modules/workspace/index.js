import { WorkspaceCollection } from '@/store/reuseModules/collection'
import Material from '@/store/reuseModules/material.js'
import workspaceApi from '@/apis/workspace'
import { NODE_LOCATION, SHARE_TARGET_TYPE } from '@/utils/constants'

export default {
  namespaced: true,
  modules: {
    collection: WorkspaceCollection,
    material: Material
  },
  state: {
    materialBreadcrumbList: [],
    shareInfo: {
      shareList: [],
      isCanShared: false,
      embed: {
        key: '',
        isCanDownloadU3M: false
      }
    }
  },
  getters: {
    materialBreadcrumbList: state => state.materialBreadcrumbList,
    shareInfo: state => state.shareInfo,
    defaultWorkspaceNodeKey: (state, getters, rootState, rootGetters) => {
      return rootGetters['helper/routeLocation'] === 'org'
        ? `${NODE_LOCATION.ORG}-${rootGetters['organization/organization'].workspaceNodeId}`
        : `${NODE_LOCATION.GROUP}-${rootGetters['group/group'].workspaceNodeId}`
    }
  },
  mutations: {
    SET_materialBreadcrumbList (state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_shareInfo (state, shareInfo) {
      Object.assign(state.shareInfo, shareInfo)
    }
  },
  actions: {
    setWorkspaceModule ({ commit, dispatch }, data) {
      const { workspaceCollection, material, shareInfo, pagination, breadcrumbList } = data

      !!workspaceCollection && commit('SET_collection', workspaceCollection)
      !!material && commit('SET_material', material)
      !!breadcrumbList && commit('SET_materialBreadcrumbList', breadcrumbList)
      !!shareInfo && commit('SET_shareInfo', shareInfo)
      !!pagination && dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getWorkspace ({ rootGetters, dispatch }, { targetPage = 1, workspaceNodeId }) {
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        workspaceNodeId,
        ...searchParams
      }

      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.getWorkspace({ orgId: rootGetters['organization/orgId'], ...params })
        : await workspaceApi.group.getWorkspace({ groupId: rootGetters['group/groupId'], ...params })

      dispatch('setWorkspaceModule', data.result)
    },
    async getWorkspaceForModal ({ rootGetters }, { keyword, sort, targetPage = 1, workspaceNodeId, workspaceNodeLocation }) {
      const params = {
        workspaceNodeId,
        workspaceNodeLocation,
        search: {
          keyword,
          tagList: []
        },
        pagination: {
          perPageCount: 40,
          isShowMatch: false,
          sort: Number(sort),
          targetPage: Number(targetPage)
        }
      }

      if (!keyword) {
        params.search = null
      }

      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.getWorkspaceForModal({ orgId: rootGetters['organization/orgId'], ...params })
        : await workspaceApi.group.getWorkspaceForModal({ groupId: rootGetters['group/groupId'], ...params })
      return data.result
    },
    async getCollection ({ rootGetters }, { workspaceNodeId }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.getCollection({ orgId: rootGetters['organization/orgId'], workspaceNodeId })
        : await workspaceApi.group.getCollection({ groupId: rootGetters['group/groupId'], workspaceNodeId })
      return data.result.workspaceCollection
    },
    async getWorkspaceMaterial ({ rootGetters, dispatch }, { workspaceNodeId }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.getWorkspaceMaterial({ orgId: rootGetters['organization/orgId'], workspaceNodeId })
        : await workspaceApi.group.getWorkspaceMaterial({ groupId: rootGetters['group/groupId'], workspaceNodeId })
      dispatch('setWorkspaceModule', data.result)
    },
    async createCollectionForModal (_, { id, workspaceNodeLocation, workspaceNodeId, collectionName }) {
      const { data } = Number(workspaceNodeLocation) === NODE_LOCATION.ORG
        ? await workspaceApi.org.createCollection({ orgId: id, workspaceNodeId, collectionName })
        : await workspaceApi.group.createCollection({ groupId: id, workspaceNodeId, collectionName })

      const { success, message } = data

      if (!success) {
        throw message.content
      }
    },
    async createCollection ({ rootGetters }, { workspaceNodeId, collectionName, trendBoard = null, description = null }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.createCollection({ orgId: rootGetters['organization/orgId'], workspaceNodeId, collectionName, trendBoard, description })
        : await workspaceApi.group.createCollection({ groupId: rootGetters['group/groupId'], workspaceNodeId, collectionName, trendBoard, description })

      const { success, message } = data

      if (!success) {
        throw message.content
      }
    },
    async updateCollection ({ rootGetters }, { collectionId, collectionName, trendBoard = null, description = null }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.updateCollection({ orgId: rootGetters['organization/orgId'], collectionId, collectionName, trendBoard, description })
        : await workspaceApi.group.updateCollection({ groupId: rootGetters['group/groupId'], collectionId, collectionName, trendBoard, description })

      const { success, message } = data

      if (!success) {
        throw message.content
      }
    },
    async removeTrendBoard ({ rootGetters }, { collectionId }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.removeTrendBoard({ orgId: rootGetters['organization/orgId'], collectionId })
        : await workspaceApi.group.removeTrendBoard({ groupId: rootGetters['group/groupId'], collectionId })
    },
    async duplicateNode ({ rootGetters }, { workspaceNodeId, targetWorkspaceNodeList }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.duplicateNode({ orgId: rootGetters['organization/orgId'], workspaceNodeId, targetWorkspaceNodeList })
        : await workspaceApi.group.duplicateNode({ groupId: rootGetters['group/groupId'], workspaceNodeId, targetWorkspaceNodeList })
    },
    async moveNode ({ rootGetters }, { workspaceNodeId, targetWorkspaceNodeId }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.moveNode({ orgId: rootGetters['organization/orgId'], workspaceNodeId, targetWorkspaceNodeId })
        : await workspaceApi.group.moveNode({ groupId: rootGetters['group/groupId'], workspaceNodeId, targetWorkspaceNodeId })
    },
    async deleteNode ({ rootGetters }, { workspaceNodeIdList }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.deleteNode({ orgId: rootGetters['organization/orgId'], workspaceNodeIdList })
        : await workspaceApi.group.deleteNode({ groupId: rootGetters['group/groupId'], workspaceNodeIdList })
    },
    async publishNode ({ rootGetters }, { workspaceNodeId, isPublic, isCanClone, isCanDownloadU3M }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.publishNode({ orgId: rootGetters['organization/orgId'], workspaceNodeId, isPublic, isCanClone, isCanDownloadU3M })
        : await workspaceApi.group.publishNode({ groupId: rootGetters['group/groupId'], workspaceNodeId, isPublic, isCanClone, isCanDownloadU3M })
    },
    async getShareInfo ({ rootGetters, commit }, { workspaceNodeId }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.getShareInfo({ orgId: rootGetters['organization/orgId'], workspaceNodeId })
        : await workspaceApi.group.getShareInfo({ groupId: rootGetters['group/groupId'], workspaceNodeId })
      commit('SET_shareInfo', data.result)
    },
    async getShareTarget ({ rootGetters }, { workspaceNodeId, target }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.getShareTarget({ orgId: rootGetters['organization/orgId'], workspaceNodeId, target })
        : await workspaceApi.group.getShareTarget({ groupId: rootGetters['group/groupId'], workspaceNodeId, target })

      const { success, result, message } = data
      if (!success) {
        throw message.content
      }
      return result.target
    },
    async assignedShare ({ rootGetters, commit }, { workspaceNodeId, targetList, isCanClone, isCanDownloadU3M, messages }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.assignedShare({ orgId: rootGetters['organization/orgId'], workspaceNodeId, targetList, isCanClone, isCanDownloadU3M, messages })
        : await workspaceApi.group.assignedShare({ groupId: rootGetters['group/groupId'], workspaceNodeId, targetList, isCanClone, isCanDownloadU3M, messages })
      commit('SET_shareInfo', { shareList: data.result.shareList })
    },
    async updatedAssignedShare ({ rootGetters, dispatch }, { workspaceNodeId, type, id, isCanClone, isCanDownloadU3M }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.updatedAssignedShare({ orgId: rootGetters['organization/orgId'], workspaceNodeId, type, id, isCanClone, isCanDownloadU3M })
        : await workspaceApi.group.updatedAssignedShare({ groupId: rootGetters['group/groupId'], workspaceNodeId, type, id, isCanClone, isCanDownloadU3M })
      dispatch('getShareInfo', { workspaceNodeId })
    },
    async removeAssignedShare ({ rootGetters, dispatch }, { workspaceNodeId, type, id }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.removeAssignedShare({ orgId: rootGetters['organization/orgId'], workspaceNodeId, type, id })
        : await workspaceApi.group.removeAssignedShare({ groupId: rootGetters['group/groupId'], workspaceNodeId, type, id })
      await dispatch('getShareInfo', { workspaceNodeId })
    },
    async toggleCopyLink ({ rootGetters }, { workspaceNodeId, isCanShared }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.toggleCopyLink({ orgId: rootGetters['organization/orgId'], workspaceNodeId, isCanShared })
        : await workspaceApi.group.toggleCopyLink({ groupId: rootGetters['group/groupId'], workspaceNodeId, isCanShared })
    },
    async generateCopyLink ({ rootGetters }, { workspaceNodeId }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.generateCopyLink({ orgId: rootGetters['organization/orgId'], workspaceNodeId })
        : await workspaceApi.group.generateCopyLink({ groupId: rootGetters['group/groupId'], workspaceNodeId })
      return data.result.key
    },
    async generateSocialMedia ({ rootGetters }, { workspaceNodeId, type }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await workspaceApi.org.generateSocialMedia({ orgId: rootGetters['organization/orgId'], workspaceNodeId, type })
        : await workspaceApi.group.generateSocialMedia({ groupId: rootGetters['group/groupId'], workspaceNodeId, type })
      return data.result.key
    }
  }
}
