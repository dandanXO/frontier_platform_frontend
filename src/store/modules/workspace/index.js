import WorkspaceNode from '@/store/reuseModules/workspaceNode'
import workspaceApi from '@/apis/workspace'
import { NODE_LOCATION, SHARE_TARGET_TYPE } from '@/utils/constants'

export default {
  namespaced: true,
  state: {
    ...WorkspaceNode.state(),
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
    ...WorkspaceNode.getters,
    shareInfo: state => state.shareInfo
  },
  mutations: {
    SET_shareInfo (state, shareInfo) {
      const { shareList } = shareInfo
      if (shareList) {
        shareInfo.shareList = shareList.map(target => {
          let logo = target.logo
          if (!logo) {
            if (target.type === SHARE_TARGET_TYPE.EMAIL) {
              logo = require('@/assets/images/default_user.png')
            } else {
              logo = require('@/assets/images/logo-default.png')
            }
          }
          return {
            ...target,
            logo
          }
        })
      }

      Object.assign(state.shareInfo, shareInfo)
    }
  },
  actions: {
    ...WorkspaceNode.actions,
    setWorkspace ({ state }, data) {
      Object.assign(state, data)
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

      dispatch('handleResponseData', { data }, { root: true })
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
      dispatch('handleResponseData', { data }, { root: true })
      return data.result
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
    }
  }
}
