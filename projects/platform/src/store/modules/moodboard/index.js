import moodboardApi from '@/apis/moodboard'
import { downloadBase64File } from '@/utils/fileOperator'
import { MOODBOARD_TYPE, NODE_TYPE } from '@/utils/constants'
import Material from '@/store/reuseModules/material.js'

export default {
  namespaced: true,
  state: () => ({
    moodboardList: [],
    moodboard: {
      moodboardId: 0,
      moodboardType: MOODBOARD_TYPE.DEMANDER,
      moodboardName: '',
      description: '',
      trendBoardCoverImg: '',
      trendBoardFileName: '',
      trendBoardUrl: '',
      hasNewUpdate: false,
      creator: '',
      creatorLogo: '',
      createDate: 1608905630674,
      updateDate: 1608905630674,
      attachmentList: [
        {
          attachmentId: 0,
          fileName: '',
          fileSize: 0,
          url: '',
          extension: '',
        },
      ],
      properties: {
        /**
         * one of
         *  ->
         *    myOfferId
         *    myRootNodeId
         *    hasNewComment
         *  ->
         *    shareList: [
         *     {
         *       shareId,
         *       name,
         *       logo,
         *       itemCounts
         *     }
         *   ]
         *    offerList: [
         *     {
         *       offerId,
         *       rootNodeId,
         *       name,
         *       logo,
         *       itemCounts,
         *       hasNewUpdate,
         *       lastUpdateTime,
         *       hasNewComment
         *     }
         *   ]
         */
      },
    },
    moodboardOfferNodeCollection: {
      nodeId: 0,
      nodeType: NODE_TYPE.COLLECTION,
      description: '',
      trendBoardCoverImg: '',
      trendBoardFileName: '',
      trendBoardUrl: '',
      locationList: [
        {
          nodeId: 0,
          name: '',
        },
      ],
      childNodeList: [
        {
          nodeId: 0,
          nodeType: NODE_TYPE.MATERIAL,
          isPicked: false,
          creator: '',
          creatorLogo: '',
          properties: {
            /**
             * one of
             *  ->
             *    collectionId
             *    name
             *    coverImgList
             *    itemCounts,
             *  ->
             *    #Material
             */
            ...Material.state(),
          },
        },
      ],
    },
    moodboardCommentList: [
      {
        name: '',
        logo: '',
        comment: '',
        updateDate: '',
      },
    ],
    moodboardNodeMaterial: {
      nodeId: 0,
      nodeType: NODE_TYPE.MATERIAL,
      isPicked: false,
      material: Material.state(),
    },
  }),
  getters: {
    moodboardList: (state) => (moodboardType) => {
      return state.moodboardList.filter(
        (moodboard) => moodboard.moodboardType === moodboardType
      )
    },
    moodboard: (state) => state.moodboard,
    moodboardId: (state) => state.moodboard.moodboardId,
    moodboardShareList: (state) => state.moodboard.properties?.shareList || [],
    moodboardOfferList: (state) => state.moodboard.properties?.offerList || [],
    moodboardOfferNodeCollection: (state) => state.moodboardOfferNodeCollection,
    moodboardCommentList: (state) => state.moodboardCommentList,
    moodboardNodeMaterial: (state) => state.moodboardNodeMaterial,
  },
  mutations: {
    SET_moodboardList(state, moodboardList) {
      state.moodboardList = moodboardList
    },
    SET_moodboard(state, moodboard) {
      state.moodboard = moodboard
    },
    SET_moodboardOfferNodeCollection(state, moodboardOfferNodeCollection) {
      state.moodboardOfferNodeCollection = moodboardOfferNodeCollection
    },
    SET_moodboardCommentList(state, moodboardCommentList) {
      state.moodboardCommentList = moodboardCommentList
    },
    SET_moodboardNodeMaterial(state, moodboardNodeMaterial) {
      state.moodboardNodeMaterial = moodboardNodeMaterial
    },
  },
  actions: {
    async callMoodboardApi({ rootGetters }, { func, params = {} }) {
      return await moodboardApi[func](
        rootGetters['helper/routeLocation'],
        rootGetters['helper/routeLocationId'],
        params
      )
    },
    async getMoodboardList({ dispatch, commit }) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'getMoodboardList',
      })
      commit('SET_moodboardList', data.result.moodboardList)
    },
    async getMoodboard({ dispatch, commit }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'getMoodboard',
        params,
      })
      commit('SET_moodboard', data.result.moodboard)
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {string} params.moodboardName
     * @param {string} params.description
     * @param {object} params.trendBoardFile - file object
     * @param {object[]} params.attachmentFileList - file object of array
     */
    async createMoodboard({ dispatch }, params) {
      const { trendBoardFile, attachmentFileList } = params

      let trendBoard = null
      if (trendBoardFile) {
        trendBoard = await dispatch(
          'uploadFileToS3',
          { fileName: trendBoardFile.name, file: trendBoardFile },
          { root: true }
        )
      }

      const attachmentList = await Promise.all(
        attachmentFileList.map((attachment) =>
          dispatch(
            'uploadFileToS3',
            { fileName: attachment.name, file: attachment },
            { root: true }
          )
        )
      )

      const tempParams = { ...params, trendBoard, attachmentList }
      delete tempParams.trendBoardFile
      delete tempParams.attachmentFileList

      const { data } = await dispatch('callMoodboardApi', {
        func: 'createMoodboard',
        params: tempParams,
      })
      return data.result
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {number} params.moodboardId
     * @param {string} params.moodboardName
     * @param {string} params.description
     * @param {object?} params.trendBoardFile - file object
     * @param {object[]?} params.attachmentFileList - file object of array
     * @param {number[]?} params.deleteAttachmentIdList
     * @param {boolean} params.isDeleteTrendBoard
     */
    async updateMoodboard({ dispatch, commit }, params) {
      const { trendBoardFile, attachmentFileList } = params

      let newTrendBoard = null
      if (trendBoardFile) {
        newTrendBoard = await dispatch(
          'uploadFileToS3',
          { fileName: trendBoardFile.name, file: trendBoardFile },
          { root: true }
        )
      }

      const newAttachmentList = await Promise.all(
        attachmentFileList.map((attachment) =>
          dispatch(
            'uploadFileToS3',
            { fileName: attachment.name, file: attachment },
            { root: true }
          )
        )
      )

      const tempParams = { ...params, newTrendBoard, newAttachmentList }
      delete tempParams.trendBoardFile
      delete tempParams.attachmentFileList

      const { data } = await dispatch('callMoodboardApi', {
        func: 'updateMoodboard',
        params: tempParams,
      })
      commit('SET_moodboard', data.result.moodboard)
    },
    async deleteMoodboard({ dispatch, commit }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'deleteMoodboard',
        params,
      })
      commit('SET_moodboardList', data.result.moodboardList)
    },
    async getMoodboardNodeCollection({ dispatch, commit }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'getMoodboardNodeCollection',
        params,
      })
      commit(
        'SET_moodboardOfferNodeCollection',
        data.result.moodboardOfferNodeCollection
      )
    },
    async getMoodboardNodeCollectionForModal({ dispatch, getters }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'getMoodboardNodeCollection',
        params: {
          nodeId: params.nodeId,
          moodboardId: getters.moodboardId,
          keyword: null,
        },
      })
      return data.result.moodboardOfferNodeCollection
    },
    async deleteMoodboardNode({ dispatch }, params) {
      await dispatch('callMoodboardApi', {
        func: 'deleteMoodboardNode',
        params,
      })
    },
    async pickMoodboardNode({ dispatch }, params) {
      await dispatch('callMoodboardApi', { func: 'pickMoodboardNode', params })
    },
    async unpickMoodboardNode({ dispatch }, params) {
      await dispatch('callMoodboardApi', {
        func: 'unpickMoodboardNode',
        params,
      })
    },
    async getPickedMoodboardNode({ dispatch, commit }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'getPickedMoodboardNode',
        params,
      })
      commit(
        'SET_moodboardOfferNodeCollection',
        data.result.moodboardOfferNodeCollection
      )
    },
    async cloneCheckMoodboardNode({ dispatch }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'cloneCheckMoodboardNode',
        params,
      })
      return data.result.estimatedQuota
    },
    async cloneMoodboardNode({ dispatch }, params) {
      await dispatch('callMoodboardApi', { func: 'cloneMoodboardNode', params })
    },
    async exportMoodboardNode({ dispatch }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'exportMoodboardNode',
        params,
      })
      const { extension, file, fileName } = data?.result
      downloadBase64File(file, extension, fileName)
    },
    async massExportMoodboardNode({ dispatch }, params) {
      await dispatch('callMoodboardApi', {
        func: 'massExportMoodboardNode',
        params,
      })
    },
    async getMoodboardComment({ dispatch, commit }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'getMoodboardComment',
        params,
      })
      commit('SET_moodboardCommentList', data.result.moodboardCommentList)
    },
    async createMoodboardComment({ dispatch, commit }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'createMoodboardComment',
        params,
      })
      commit('SET_moodboardCommentList', data.result.moodboardCommentList)
    },
    async getMoodboardShareTarget({ dispatch, getters }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'getMoodboardShareTarget',
        params: { moodboardId: getters.moodboardId, ...params },
      })
      return data.result?.target
    },
    async shareMoodboard({ dispatch, commit, getters }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'shareMoodboard',
        params: { moodboardId: getters.moodboardId, ...params },
      })
      commit('SET_moodboard', data.result.moodboard)
    },
    async removeMoodboardShare({ dispatch, commit }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'removeMoodboardShare',
        params,
      })
      commit('SET_moodboard', data.result.moodboard)
    },
    async getMoodboardNodeMaterial({ dispatch, commit }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'getMoodboardNodeMaterial',
        params,
      })
      commit(
        'SET_moodboardNodeMaterial',
        data.result.moodboardOfferNodeMaterial
      )
    },
    async addMaterialToMoodboardNode({ dispatch, commit }, params) {
      const { data } = await dispatch('callMoodboardApi', {
        func: 'addMaterialToMoodboardNode',
        params,
      })
      commit(
        'SET_moodboardOfferNodeCollection',
        data.result.moodboardOfferNodeCollection
      )
    },
    /**
     * @param {object} context
     * @param {object} params
     * @param {number} params.nodeId
     * @param {string} params.name
     * @param {string} params.description
     * @param {object} params.trendBoardFile - file object
     */
    async createMoodboardNodeCollection({ dispatch, commit }, params) {
      const { trendBoardFile } = params

      let trendBoard = null
      if (trendBoardFile) {
        trendBoard = await dispatch(
          'uploadFileToS3',
          { fileName: trendBoardFile.name, file: trendBoardFile },
          { root: true }
        )
      }

      const tempParams = { ...params, trendBoard }
      delete tempParams.trendBoardFile

      const { data } = await dispatch('callMoodboardApi', {
        func: 'createMoodboardNodeCollection',
        params: tempParams,
      })
      commit(
        'SET_moodboardOfferNodeCollection',
        data.result.moodboardOfferNodeCollection
      )
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {number} params.nodeId
     * @param {string} params.name
     * @param {string} params.description
     * @param {object?} params.trendBoardFile - file object
     * @param {boolean} params.isDeleteTrendBoard
     */
    async updateMoodboardNodeCollection({ dispatch }, params) {
      const { trendBoardFile } = params

      let newTrendBoard = null
      if (trendBoardFile) {
        newTrendBoard = await dispatch(
          'uploadFileToS3',
          { fileName: trendBoardFile.name, file: trendBoardFile },
          { root: true }
        )
      }

      const tempParams = { ...params, newTrendBoard }
      delete tempParams.trendBoardFile

      await dispatch('callMoodboardApi', {
        func: 'updateMoodboardNodeCollection',
        params: tempParams,
      })
    },
    async getMoodboardReceivedShare(_, params) {
      const { data } = await moodboardApi.getMoodboardReceivedShare(params)
      return data.result
    },
    async saveMoodboardReceivedShare(_, params) {
      await moodboardApi.saveMoodboardReceivedShare(params)
    },
  },
}
