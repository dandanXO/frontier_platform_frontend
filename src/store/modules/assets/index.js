import axios from '@/apis'
import assetsApi from '@/apis/assets'
import { downloadBase64File } from '@/utils/fileOperator'
import { NODE_LOCATION } from '@/utils/constants'
import putBinaryData from '@/utils/put-binary-data'
import Material from '@/store/reuseModules/material.js'
import progress from './progress'

export default {
  namespaced: true,
  modules: {
    material: Material,
    progress
  },
  state: {
    materialList: [],
    code: {
      contentList: [],
      descriptionList: [],
      finishList: [],
      certificateList: []
    }
  },
  getters: {
    materialList: state => state.materialList,
    code: (state) => state.code
  },
  mutations: {
    SET_materialList (state, materialList) {
      state.materialList = materialList
    },
    SET_code (state, code) {
      Object.assign(state.code, code)
    }
  },
  actions: {
    async callAssetsApi ({ rootGetters }, { func, params = {} }) {
      return await assetsApi[func](rootGetters['helper/routeLocation'], rootGetters['helper/routeLocationId'], params)
    },
    setAssetsModule ({ commit, dispatch }, data) {
      const { assets, material, pagination } = data

      !!assets?.materialList && commit('SET_materialList', assets.materialList)
      !!material && dispatch('setMaterial', material)
      !!pagination && dispatch('helper/search/setPagination', pagination, { root: true })
    },
    setMaterial ({ commit }, material) {
      commit('SET_material', material)

      if (material.contentList && material.contentList.length === 0) {
        commit('ADD_content_item')
      }
      if (material.inventoryList && material.inventoryList.length === 0) {
        commit('ADD_inventory_item')
      }
    },
    resetMaterial ({ commit }) {
      commit('RESET_material')
    },
    async getMaterialOptions ({ dispatch, commit }) {
      const { data } = await dispatch('callAssetsApi', { func: 'getMaterialOptions' })
      commit('SET_code', data.result.code)
    },
    async getMaterial ({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', { func: 'getMaterial', params })
      dispatch('setAssetsModule', data.result)
    },
    async getMaterialList ({ rootGetters, dispatch }, { targetPage = 1 }) {
      const params = rootGetters['helper/search/getSearchParams'](targetPage)
      const { data } = await dispatch('callAssetsApi', { func: 'getMaterialList', params })
      dispatch('setAssetsModule', data.result)
    },
    async createMaterial ({ getters, dispatch }, { tempMaterialId }) {
      const material = Object.fromEntries(
        Object.entries(getters.material)
          .filter(([key]) => [
            'isDoubleSideMaterial',
            'sideType',
            'materialNo',
            'descriptionList',
            'weight',
            'weightUnit',
            'weightGy',
            'width',
            'contentList',
            'finishList',
            'warpYarnCount',
            'weftYarnCount',
            'warpDensity',
            'weftDensity',
            'pattern',
            'color',
            'publicTagList',
            'privateTagList',
            'aiTagList',
            'remark',
            'materialSeq',
            'sampleCardsRemainingQty',
            'sampleCardsLocation',
            'hangersRemainingQty',
            'hangersLocation',
            'inventoryList',
            'isPublicInventory',
            'publicPrice',
            'privatePrice'
          ].includes(key))
      )
      material['certificateIdList'] = getters.material.certificateList.map(({ certificateId }) => certificateId)
      const { data } = await dispatch('callAssetsApi', { func: 'createMaterial', params: { tempMaterialId, material } })
      dispatch('setAssetsModule', data.result)
    },
    async updateMaterial ({ getters, dispatch }) {
      const materialId = getters.material.materialId
      const material = Object.fromEntries(
        Object.entries(getters.material)
          .filter(([key]) => [
            'isDoubleSideMaterial',
            'sideType',
            'materialNo',
            'descriptionList',
            'weight',
            'weightUnit',
            'weightGy',
            'width',
            'contentList',
            'finishList',
            'warpYarnCount',
            'weftYarnCount',
            'warpDensity',
            'weftDensity',
            'pattern',
            'color',
            'publicTagList',
            'privateTagList',
            'aiTagList',
            'remark',
            'materialSeq',
            'sampleCardsRemainingQty',
            'sampleCardsLocation',
            'hangersRemainingQty',
            'hangersLocation',
            'inventoryList',
            'isPublicInventory',
            'publicPrice',
            'privatePrice'
          ].includes(key))
      )
      material['certificateIdList'] = getters.material.certificateList.map(({ certificateId }) => certificateId)
      await dispatch('callAssetsApi', { func: 'updateMaterial', params: { materialId, material } })
    },
    async addPantone ({ getters, dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', { func: 'addPantone', params: { ...params, materialId: getters.material.materialId } })
      dispatch('setAssetsModule', data.result)
    },
    async removePantone ({ getters, dispatch }, { materialPantoneId }) {
      const params = {
        materialPantoneId,
        materialId: getters.material.materialId
      }
      const { data } = await dispatch('callAssetsApi', { func: 'removePantone', params })
      dispatch('setAssetsModule', data.result)
    },

    /**
     * @param {object} context
     * @param {object} params 
     * @param {string} params.tempMaterialId
     * @param {object} params.file - file object
     * @param {string} params.displayFileName
     */
    async uploadAttachmentWhenCreate ({ commit, dispatch }, params) {
      const { file } = params

      let attachment = null
      if (!!file) {
        attachment = await dispatch('uploadFileToS3', { fileName: file.name, file }, { root: true })
      }

      const tempParams = { ...params, tempUploadId: attachment.tempUploadId, attachmentFileName: attachment.fileName }
      delete tempParams.file

      const { data } = await dispatch('callAssetsApi', { func: 'uploadAttachmentWhenCreate', params: tempParams })
      commit('UPDATE_attachmentList', data.result.attachmentList)
    },
    async removeAttachmentWhenCreate ({ commit, dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', { func: 'removeAttachmentWhenCreate', params })
      commit('UPDATE_attachmentList', data.result.attachmentList)
    },

    /**
     * @param {object} context
     * @param {object} params 
     * @param {object} params.file - file object
     * @param {string} params.displayFileName
     */
    async uploadAttachmentWhenUpdate ({ getters, dispatch, commit }, params) {
      const { file } = params

      let attachment = null
      if (!!file) {
        attachment = await dispatch('uploadFileToS3', { fileName: file.name, file }, { root: true })
      }

      const tempParams = {
        ...params,
        materialId: getters.material.materialId,
        tempUploadId: attachment.tempUploadId,
        attachmentFileName: attachment.fileName
      }
      delete tempParams.file

      const { data } = await dispatch('callAssetsApi', { func: 'uploadAttachmentWhenUpdate', params: tempParams })
      commit('UPDATE_attachmentList', data.result.material.attachmentList)
    },
    async removeAttachmentWhenUpdate ({ getters, dispatch, commit }, { materialAttachmentId }) {
      const params = {
        materialId: getters.material.materialId,
        materialAttachmentId
      }
      const { data } = await dispatch('callAssetsApi', { func: 'removeAttachmentWhenUpdate', params })
      commit('UPDATE_attachmentList', data.result.material.attachmentList)
    },

    /**
     * @param {object} context
     * @param {object} params 
     * @param {number} params.coverMode
     * @param {number} params.materialAttachmentId
     * @param {object} params.attachmentCropImg - file object
     */
    async changeCoverImg ({ getters, dispatch }, params) {
      const { attachmentCropImg } = params

      let coverImg = null
      if (!!attachmentCropImg) {
        coverImg = await dispatch('uploadFileToS3', { fileName: file.name, file: attachmentCropImg }, { root: true })
      }

      const tempParams = {
        ...params,
        materialId: getters.material.materialId,
        tempUploadId: coverImg.tempUploadId,
        attachmentCropImgFileName: coverImg.fileName
      }
      delete tempParams.attachmentCropImg

      const { data } = await dispatch('callAssetsApi', { func: 'changeCoverImg', params: tempParams })
      dispatch('setAssetsModule', data.result)
    },

    /**
     * @param {object} context
     * @param {object} params 
     * @param {boolean} params.isExchange
     * @param {object} params.faceSideCropImg - file object
     * @param {object} params.backSideCropImg - file object
     */
    async updateScannedImage ({ getters, dispatch }, params) {
      const { faceSideCropImg, backSideCropImg } = params
      const faceSideCropImgFileName = faceSideCropImg?.name || null
      const backSideCropImgFileName = backSideCropImg?.name || null
      let id = null

      if (faceSideCropImg || backSideCropImg) {
        const { data: { result: { tempUploadId, faceSideCropImgUploadUrl, backSideCropImgUploadUrl } } } = await axios('/org/assets/material/update/scan-image/get-upload-url', {
          method: 'POST',
          data: { faceSideCropImgFileName, backSideCropImgFileName }
        })

        id = tempUploadId
        !!faceSideCropImg && await putBinaryData(faceSideCropImgUploadUrl, faceSideCropImg)
        !!backSideCropImg && await putBinaryData(backSideCropImgUploadUrl, backSideCropImg)
      }

      const tempParams = {
        ...params,
        materialId: getters.material.materialId,
        tempUploadId: id,
        faceSideCropImgFileName,
        backSideCropImgFileName
      }
      delete tempParams.faceSideCropImg
      delete tempParams.backSideCropImg

      const { data } = await dispatch('callAssetsApi', { func: 'updateScannedImage', params: tempParams })
      dispatch('setAssetsModule', data.result)
    },

    /**
     * @param {object} context
     * @param {object} params 
     * @param {number} params.isAutoRepeat
     * @param {object} params.faceSideCropImg - file object
     * @param {object} params.backSideCropImg - file object
     */
    async generateU3m ({ getters, dispatch }, params) {
      const { faceSideCropImg, backSideCropImg } = params
      const faceSideCropImgFileName = faceSideCropImg?.name || null
      const backSideCropImgFileName = backSideCropImg?.name || null
      let id = null

      if (faceSideCropImg || backSideCropImg) {
        const { data: { result: { tempUploadId, faceSideCropImgUploadUrl, backSideCropImgUploadUrl } } } = await axios('/org/assets/material/update/generate-u3m/get-upload-url', {
          method: 'POST',
          data: { faceSideCropImgFileName, backSideCropImgFileName }
        })

        id = tempUploadId
        !!faceSideCropImg && await putBinaryData(faceSideCropImgUploadUrl, faceSideCropImg)
        !!backSideCropImg && await putBinaryData(backSideCropImgUploadUrl, backSideCropImg)
      }

      const tempParams = {
        ...params,
        materialId: getters.material.materialId,
        tempUploadId: id,
        faceSideCropImgFileName,
        backSideCropImgFileName
      }
      delete tempParams.faceSideCropImg
      delete tempParams.backSideCropImg

      const { data } = await dispatch('callAssetsApi', { func: 'generateU3m', params: tempParams })
      const { u3m } = data.result.material
      dispatch('setAssetsModule', {
        material: {
          u3m
        }
      })
    },

    /**
     * @param {object} context
     * @param {object} params 
     * @param {object} params.nodeLocation
     * @param {string} params.id
     * @param {string} params.keyword
     * @param {string} params.targetPage
     * @param {string} params.sort
     */
    async getMaterialListForModal (_, params) {
      const { id, keyword, targetPage, sort, nodeLocation } = params
      const tempParams = {
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
        tempParams.search = null
      }

      const { data } = await assetsApi.getMaterialList(Number(nodeLocation) === NODE_LOCATION.ORG ? 'org' : 'group', id, tempParams)
      return data.result
    },
    async mergeMaterial ({ dispatch }, params) {
      await dispatch('callAssetsApi', { func: 'mergeMaterial', params })
    },
    async deleteMaterial ({ dispatch }, params) {
      await dispatch('callAssetsApi', { func: 'deleteMaterial', params })
    },
    async deleteCheckMaterial ({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', { func: 'deleteCheckMaterial', params })
      return data.result
    },
    async exportMaterial ({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', { func: 'exportMaterial', params })
      const { extension, file, fileName } = data?.result
      downloadBase64File(file, extension, fileName)
    },
    async massExportMaterial ({ dispatch }, params) {
      await dispatch('callAssetsApi', { func: 'massExportMaterial', params })
    },
    async cloneCheck ({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', { func: 'cloneCheck', params })
      return data.result.estimatedQuota
    },
    async cloneMaterial ({ dispatch }, params) {
      await dispatch('callAssetsApi', { func: 'cloneMaterial', params })
    },
    async addToWorkspace ({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', { func: 'addToWorkspace', params })
      return data.result.failMaterialList
    },
    async batchUpload ({ dispatch }, params) {
      const { xlsxFile } = params
      const { tempUploadId, fileName } = await dispatch('uploadFileToS3', { fileName: xlsxFile.name, file: xlsxFile }, { root: true })
      const tempParams = {
        tempUploadId,
        xlsxFileName: fileName
      }
      const { data } = await dispatch('callAssetsApi', { func: 'batchUpload', params: tempParams })
      return data
    },
    async smartUpload ({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', { func: 'smartUpload', params })
      return data
    }
  }
}
