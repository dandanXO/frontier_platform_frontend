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
          extension: ''
        }
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
      }
    },
    moodboardOfferNode: {
      nodeId: 0,
      nodeType: NODE_TYPE.COLLECTION,
      locationList: [{
        nodeId: 0,
        name: ''
      }],
      childNodeList: [
        {
          nodeId: 0,
          nodeType: NODE_TYPE.COLLECTION,
          isPicked: false,
          creator: '',
          creatorLogo: '',
          properties: {
            /**
             * one of
             *  ->
             *    collectionId
             *    coverImgList
             *    itemCounts,
             *  ->
             *    #Material
             */
          }
        }
      ]
    },
    moodboardCommentList: [{
      name: '',
      logo: '',
      comment: '',
      updateDate: ''
    }],
    moodboardNodeMaterial: {
      nodeId: 0,
      nodeType: NODE_TYPE.MATERIAL,
      isPicked: false,
      material: Material.state()
    }
  }),
  getters: {
    moodboardList: state => moodboardType => {
      return state.moodboardList.filter(moodboard => moodboard.moodboardType === moodboardType)
    },
    moodboard: state => state.moodboard,
    moodboardOfferNode: state => state.moodboardOfferNode,
    moodboardCommentList: state => state.moodboardCommentList,
    moodboardNodeMaterial: state => state.moodboardNodeMaterial
  },
  mutations: {
    SET_moodboardList (state, moodboardList) {
      state.moodboardList = moodboardList
    },
    SET_moodboard (state, moodboard) {
      state.moodboard = moodboard
    },
    SET_moodboardOfferNode (state, moodboardOfferNode) {
      state.moodboardOfferNode = moodboardOfferNode
    },
    SET_moodboardCommentList (state, moodboardCommentList) {
      state.moodboardCommentList = moodboardCommentList
    },
    SET_moodboardNodeMaterial (state, moodboardNodeMaterial) {
      state.moodboardNodeMaterial = moodboardNodeMaterial
    }
  },
  actions: {
    async getMoodboardList ({ rootGetters, commit }) {
      const { data } = await moodboardApi.getMoodboardList(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'])
      commit('SET_moodboardList', data.result.moodboardList)
    },
    async getMoodboard ({ rootGetters, commit }, params) {
      const { data } = await moodboardApi.getMoodboard(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
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
    async createMoodboard ({ rootGetters, dispatch }, params) {
      const { trendBoardFile, attachmentFileList } = params
      const trendBoard = !!trendBoardFile && await dispatch('uploadFileToS3', { fileName: trendBoardFile.name, file: trendBoardFile }, { root: true })
      const attachmentList = await Promise.all(attachmentFileList.map(attachment => dispatch('uploadFileToS3', { fileName: attachment.name, attachment }, { root: true })))

      const tempParams = { ...params, trendBoard, attachmentList }
      delete tempParams.trendBoardFile
      delete tempParams.attachmentFileList

      await moodboardApi.createMoodboard(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], tempParams)
    },

    /**
     * @param {object} context
     * @param {object} params 
     * @param {number} params.moodboardId
     * @param {string} params.moodboardName
     * @param {string} params.description
     * @param {object} params.trendBoardFile - file object
     * @param {object[]} params.attachmentFileList - file object of array
     * @param {number[]} params.deleteAttachmentIdList
     * @param {boolean} params.isDeleteTrendBoard
     */
    async updateMoodboard ({ rootGetters, dispatch }, params) {
      const { trendBoardFile, attachmentFileList } = params
      const newTrendBoard = !!trendBoardFile && await dispatch('uploadFileToS3', { fileName: trendBoardFile.name, file: trendBoardFile }, { root: true })
      const newAttachmentList = await Promise.all(attachmentFileList.map(attachment => dispatch('uploadFileToS3', { fileName: attachment.name, attachment }, { root: true })))

      const tempParams = { ...params, newTrendBoard, newAttachmentList }
      delete tempParams.trendBoardFile
      delete tempParams.attachmentFileList

      await moodboardApi.updateMoodboard(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], tempParams)
    },
    async deleteMoodboard ({ rootGetters, commit }, params) {
      const { data } = await moodboardApi.deleteMoodboard(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      commit('SET_moodboardList', data.result.moodboardList)
    },
    async getMoodboardNode ({ rootGetters, commit }, params) {
      const { data } = await moodboardApi.getMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      commit('SET_moodboardOfferNode', data.result.moodboardOfferNode)
    },
    async deleteMoodboardNode ({ rootGetters }, params) {
      await moodboardApi.deleteMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
    },
    async pickMoodboardNode ({ rootGetters }, params) {
      await moodboardApi.pickMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
    },
    async unpickMoodboardNode ({ rootGetters }, params) {
      await moodboardApi.unpickMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
    },
    async getPickedMoodboardNode ({ rootGetters, commit }, params) {
      const { data } = await moodboardApi.getPickedMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      commit('SET_moodboardOfferNode', data.result.moodboardOfferNode)
    },
    async cloneCheckMoodboardNode ({ rootGetters }, params) {
      const { data } = await moodboardApi.cloneCheckMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      return data.result.estimatedQuota
    },
    async cloneMoodboardNode ({ rootGetters }, params) {
      await moodboardApi.cloneMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
    },
    async exportMoodboardNode ({ rootGetters }, params) {
      const { data } = await moodboardApi.exportMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      const { extension, file, fileName } = data?.result
      downloadBase64File(file, extension, fileName)
    },
    async massExportMoodboardNode ({ rootGetters }, params) {
      await moodboardApi.massExportMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
    },
    async getMoodboardComment ({ rootGetters, commit }, params) {
      const { data } = await moodboardApi.getMoodboardComment(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      commit('SET_moodboardCommentList', data.result.moodboardCommentList)
    },
    async createMoodboardComment ({ rootGetters, commit }, params) {
      const { data } = await moodboardApi.createMoodboardComment(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      commit('SET_moodboardCommentList', data.result.moodboardCommentList)
    },
    async getMoodboardShareTarget ({ rootGetters }, params) {
      const { data } = await moodboardApi.getMoodboardShareTarget(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      return data.result.target
    },
    async shareMoodboard ({ rootGetters, commit }, params) {
      const { data } = await moodboardApi.shareMoodboard(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      commit('SET_moodboard', data.result.moodboard)
    },
    async removeMoodboardShare ({ rootGetters, commit }, params) {
      const { data } = await moodboardApi.removeMoodboardShare(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      commit('SET_moodboard', data.result.moodboard)
    },
    async getMoodboardNodeMaterial ({ rootGetters, commit }, params) {
      const { data } = await moodboardApi.getMoodboardNodeMaterial(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
      commit('SET_moodboardNodeMaterial', data.result.moodboardOfferNodeMaterial)
    },
    async addMaterialToMoodboardNode ({ rootGetters }, params) {
      await moodboardApi.addMaterialToMoodboardNode(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
    },
    async createMoodboardNodeCollection ({ rootGetters }, params) {
      await moodboardApi.createMoodboardNodeCollection(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
    },
    async updateMoodboardNodeCollection ({ rootGetters }, params) {
      await moodboardApi.updateMoodboardNodeCollection(rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
    }
  }
}
