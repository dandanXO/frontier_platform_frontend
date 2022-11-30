import { WorkspaceCollection } from '@/store/reuseModules/collection'
import Material from '@/store/reuseModules/material.js'
import workspaceApi from '@/apis/workspace'
import { NODE_LOCATION } from '@/utils/constants'

export default {
  namespaced: true,
  modules: {
    collection: WorkspaceCollection,
    material: Material,
  },
  state: {
    materialBreadcrumbList: [],
    shareInfo: {
      shareList: [],
      isCanShared: false,
      embed: {
        key: '',
        isCanDownloadU3M: false,
      },
    },
  },
  getters: {
    materialBreadcrumbList: (state) =>
      state.materialBreadcrumbList.map(
        ({ name, workspaceNodeId, workspaceNodeLocation }) => ({
          name,
          nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
        })
      ),
    shareInfo: (state) => state.shareInfo,
    defaultWorkspaceNodeKey: (state, getters, rootState, rootGetters) => {
      return rootGetters['helper/routeLocation'] === 'org'
        ? `${NODE_LOCATION.ORG}-${rootGetters['organization/organization'].workspaceNodeId}`
        : `${NODE_LOCATION.GROUP}-${rootGetters['group/group'].workspaceNodeId}`
    },
  },
  mutations: {
    SET_materialBreadcrumbList(state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_shareInfo(state, shareInfo) {
      Object.assign(state.shareInfo, shareInfo)
    },
  },
  actions: {
    async callWorkspaceApi({ rootGetters }, { func, params = {} }) {
      return await workspaceApi[func](
        rootGetters['helper/routeLocation'],
        rootGetters['helper/routeLocationId'],
        params
      )
    },
    setWorkspaceModule({ commit, dispatch }, data) {
      const {
        workspaceCollection,
        material,
        shareInfo,
        pagination,
        breadcrumbList,
      } = data

      !!workspaceCollection && commit('SET_collection', workspaceCollection)
      !!material && commit('SET_material', material)
      !!breadcrumbList && commit('SET_materialBreadcrumbList', breadcrumbList)
      !!shareInfo && commit('SET_shareInfo', shareInfo)
      !!pagination &&
        dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getWorkspace({ rootGetters, dispatch }, { targetPage = 1, nodeKey }) {
      const searchParams =
        rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        workspaceNodeId: nodeKey.split('-')[1],
        ...searchParams,
      }

      const { data } = await dispatch('callWorkspaceApi', {
        func: 'getWorkspaceOrCollection',
        params,
      })
      dispatch('setWorkspaceModule', data.result)
    },
    async getWorkspaceForModal(
      { dispatch },
      { keyword, sort, targetPage = 1, workspaceNodeId, workspaceNodeLocation }
    ) {
      const params = {
        workspaceNodeId,
        workspaceNodeLocation,
        search: {
          keyword,
          tagList: [],
        },
        pagination: {
          perPageCount: 40,
          isShowMatch: false,
          sort: Number(sort),
          targetPage: Number(targetPage),
        },
      }

      if (!keyword) {
        params.search = null
      }

      const { data } = await dispatch('callWorkspaceApi', {
        func: 'getWorkspaceForModal',
        params,
      })
      return data.result
    },
    async getCollection({ dispatch }, params) {
      const tempParams = {
        search: null,
        filter: null,
        pagination: {
          perPageCount: 40,
          targetPage: 1,
        },
        ...params,
      }
      const { data } = await dispatch('callWorkspaceApi', {
        func: 'getWorkspaceOrCollection',
        params: tempParams,
      })
      return data.result.workspaceCollection
    },
    async getWorkspaceMaterial({ rootGetters, dispatch }, { nodeKey, rank }) {
      const workspaceNodeId = nodeKey.split('-')[1]
      const params = {
        workspaceNodeId,
      }
      const keyword = rootGetters['helper/search/keyword']
      if (keyword) {
        params['keyword'] = keyword
        params['rank'] = rank
      }
      const { data } = await dispatch('callWorkspaceApi', {
        func: 'getWorkspaceMaterial',
        params,
      })
      dispatch('setWorkspaceModule', data.result)
    },
    async createCollectionForModal(_, params) {
      const { id, workspaceNodeLocation } = params
      delete params.id
      await workspaceApi.createCollection(
        Number(workspaceNodeLocation) === NODE_LOCATION.ORG ? 'org' : 'group',
        id,
        params
      )
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {number} params.workspaceNodeId
     * @param {string} params.collectionName
     * @param {object?} params.trendBoardFile - file object
     * @param {string?} params.description
     */
    async createCollection({ dispatch }, params) {
      const { trendBoardFile } = params

      let trendBoard = null
      if (trendBoardFile) {
        trendBoard = await dispatch(
          'uploadFileToS3',
          { fileName: trendBoardFile.name, file: trendBoardFile },
          { root: true }
        )
      }

      if (trendBoard) {
        params.trendBoardFileName = trendBoard.fileName
        params.tempUploadId = trendBoard.tempUploadId
      }
      delete params.trendBoardFile

      await dispatch('callWorkspaceApi', { func: 'createCollection', params })
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {number} params.collectionId
     * @param {string} params.collectionName
     * @param {object?} params.trendBoardFile - file object
     * @param {string?} params.description
     */
    async updateCollection({ dispatch }, params) {
      const { trendBoardFile } = params

      let trendBoard = null
      if (!!trendBoardFile && typeof trendBoardFile === 'object') {
        trendBoard = await dispatch(
          'uploadFileToS3',
          { fileName: trendBoardFile.name, file: trendBoardFile },
          { root: true }
        )
      }

      const tempParams = {
        ...params,
        trendBoardFileName: trendBoard?.fileName || null,
        tempUploadId: trendBoard?.tempUploadId || null,
      }
      delete tempParams.trendBoardFile

      await dispatch('callWorkspaceApi', {
        func: 'updateCollection',
        params: tempParams,
      })
    },
    async removeTrendBoard({ dispatch }, params) {
      await dispatch('callWorkspaceApi', { func: 'removeTrendBoard', params })
    },
    async duplicateNode({ dispatch }, params) {
      await dispatch('callWorkspaceApi', { func: 'duplicateNode', params })
    },
    async moveNode({ dispatch }, params) {
      await dispatch('callWorkspaceApi', { func: 'moveNode', params })
    },
    async deleteNode({ dispatch }, params) {
      await dispatch('callWorkspaceApi', { func: 'deleteNode', params })
    },
    async publishNode({ dispatch }, params) {
      await dispatch('callWorkspaceApi', { func: 'publishNode', params })
    },
    async getShareInfo({ dispatch, commit }, params) {
      const { data } = await dispatch('callWorkspaceApi', {
        func: 'getShareInfo',
        params,
      })
      commit('SET_shareInfo', data.result)
    },
    async getShareTarget({ dispatch }, params) {
      const { data } = await dispatch('callWorkspaceApi', {
        func: 'getShareTarget',
        params,
      })
      return data.result.target
    },
    async assignedShare({ dispatch, commit }, params) {
      const { data } = await dispatch('callWorkspaceApi', {
        func: 'assignedShare',
        params,
      })
      commit('SET_shareInfo', { shareList: data.result.shareList })
    },
    async updateAssignedShare({ dispatch }, params) {
      await dispatch('callWorkspaceApi', {
        func: 'updateAssignedShare',
        params,
      })
    },
    async removeAssignedShare({ dispatch }, params) {
      await dispatch('callWorkspaceApi', {
        func: 'removeAssignedShare',
        params,
      })
    },
    async toggleCopyLink({ dispatch }, params) {
      await dispatch('callWorkspaceApi', { func: 'toggleCopyLink', params })
    },
    async generateCopyLink({ dispatch }, params) {
      const { data } = await dispatch('callWorkspaceApi', {
        func: 'generateCopyLink',
        params,
      })
      return data.result.key
    },
    async generateSocialMedia({ dispatch }, params) {
      const { data } = await dispatch('callWorkspaceApi', {
        func: 'generateSocialMedia',
        params,
      })
      return data.result.key
    },
    async updateEmbedDownloadPermission({ dispatch }, params) {
      await dispatch('callWorkspaceApi', {
        func: 'updateEmbedDownloadPermission',
        params,
      })
    },
  },
}
