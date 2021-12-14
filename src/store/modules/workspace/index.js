import WorkspaceNode from '@/store/reuseModules/workspaceNode'
import workspaceApi from '@/apis/workspace'
import { NODE_LOCATION } from '@/utils/constants'

export default {
  namespaced: true,
  state: WorkspaceNode.state,
  getters: WorkspaceNode.getters,
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
    async createCollectionForModal (_, { id, workspaceNodeLocation, workspaceNodeId, collectionName }) {
      if (Number(workspaceNodeLocation) === NODE_LOCATION.ORG) {
        await workspaceApi.org.createCollection({ orgId: id, workspaceNodeId, collectionName })
      } else {
        await workspaceApi.group.createCollection({ groupId: id, workspaceNodeId, collectionName })
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
    }
  }
}
