import assetsApi from '@/apis/assets'
import { downloadBase64File } from '@/utils/fileOperator'
import {
  OG_TYPE,
  INVENTORY_UNIT,
  MATERIAL_PRICING_CURRENCY,
  NOTIFY_TYPE,
} from '@/utils/constants'
import putBinaryData from '@/utils/put-binary-data'
import Material from '@/store/reuseModules/material.js'
import progress from './progress'
import { useNotifyStore } from '@/stores/notify'
import i18n from '@/utils/i18n'

export default {
  namespaced: true,
  modules: {
    material: Material,
    progress,
  },
  state: {
    materialList: [],
    uploadingU3mMaterialIdList: [],
    code: {
      contentList: [],
      descriptionList: [],
      finishList: [],
      certificateList: [],
    },
  },
  getters: {
    materialList: (state) => state.materialList,
    code: (state) => state.code,
    uploadingU3mMaterialIdList: (state) => state.uploadingU3mMaterialIdList,
  },
  mutations: {
    SET_materialList(state, materialList) {
      state.materialList = materialList
    },
    SET_code(state, code) {
      Object.assign(state.code, code)
    },
    PUSH_uploadingU3mMaterialIdList(state, materialId) {
      state.uploadingU3mMaterialIdList.push(materialId)
    },
    REMOVE_uploadingU3mMaterialIdList(state, materialId) {
      state.uploadingU3mMaterialIdList =
        state.uploadingU3mMaterialIdList.filter((mId) => mId !== materialId)
    },
  },
  actions: {
    async callAssetsApi({ rootGetters }, { func, params = {} }) {
      return await assetsApi[func](
        rootGetters['helper/routeLocation'],
        rootGetters['helper/routeLocationId'],
        params
      )
    },
    setAssetsModule({ commit, dispatch }, data) {
      const { assets, material, pagination } = data

      !!assets?.materialList && commit('SET_materialList', assets.materialList)
      !!material && dispatch('setMaterial', material)
      !!pagination &&
        dispatch('helper/search/setPagination', pagination, { root: true })
    },
    setMaterial({ commit }, material) {
      commit('SET_material', material)

      // set default value for Asset Create/Edit page
      const { contentList, inventoryList, publicPrice, privatePrice } = material
      if (contentList && contentList.length === 0) {
        commit('ADD_content_item')
      }
      if (inventoryList && inventoryList.length === 0) {
        commit('ADD_inventory_item')
      }
      const properties = [
        'unit',
        'minimumOrderQuantityUnit',
        'minimumContainerQuantityUnit',
      ]
      properties.forEach((property) => {
        publicPrice[property] = publicPrice[property] || INVENTORY_UNIT.Y
        privatePrice[property] = privatePrice[property] || INVENTORY_UNIT.Y
      })
      privatePrice.currency =
        privatePrice.currency || MATERIAL_PRICING_CURRENCY.USD
    },
    resetMaterial({ commit }) {
      commit('RESET_material')
    },
    async getMaterialOptions({ dispatch, commit }) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'getMaterialOptions',
      })
      commit('SET_code', data.result.code)
    },
    async getMaterial({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'getMaterial',
        params,
      })
      dispatch('setAssetsModule', data.result)
    },
    async getMaterialList({ rootGetters, dispatch }, { targetPage = 1 }) {
      const params = rootGetters['helper/search/getSearchParams'](targetPage)
      const { data } = await dispatch('callAssetsApi', {
        func: 'getMaterialList',
        params,
      })
      dispatch('setAssetsModule', data.result)
    },
    async createMaterial(
      { getters, dispatch },
      {
        tempMaterialId,
        hasCustomU3mUploading = false,
        u3mFile,
        needToGeneratePhysical,
      }
    ) {
      const material = Object.fromEntries(
        Object.entries(getters.material).filter(([key]) =>
          [
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
            'privatePrice',
          ].includes(key)
        )
      )
      material['certificateIdList'] = getters.material.certificateList.map(
        ({ certificateId }) => certificateId
      )

      material['hasCustomU3mUploading'] = hasCustomU3mUploading

      const { data } = await dispatch('callAssetsApi', {
        func: 'createMaterial',
        params: { tempMaterialId, material },
      })
      dispatch('setAssetsModule', data.result)

      hasCustomU3mUploading &&
        dispatch('customU3mUpload', {
          materialId: data.result.material.materialId,
          u3mFile,
          needToGeneratePhysical,
        })
    },
    async updateMaterial(
      { getters, dispatch },
      { hasCustomU3mUploading = false, u3mFile, needToGeneratePhysical }
    ) {
      const materialId = getters.material.materialId
      const material = Object.fromEntries(
        Object.entries(getters.material).filter(([key]) =>
          [
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
            'privatePrice',
          ].includes(key)
        )
      )
      material['certificateIdList'] = getters.material.certificateList.map(
        ({ certificateId }) => certificateId
      )

      material['hasCustomU3mUploading'] = hasCustomU3mUploading

      await dispatch('callAssetsApi', {
        func: 'updateMaterial',
        params: { materialId, material },
      })

      hasCustomU3mUploading &&
        dispatch('customU3mUpload', {
          materialId,
          u3mFile,
          needToGeneratePhysical,
        })
    },
    async updateMaterialSimpleSpec({ getters, dispatch }) {
      const materialId = getters.material.materialId
      const material = Object.fromEntries(
        Object.entries(getters.material).filter(([key]) =>
          [
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
          ].includes(key)
        )
      )
      await dispatch('callAssetsApi', {
        func: 'updateMaterialSimpleSpec',
        params: { materialId, material },
      })
    },
    async updateMaterialSimpleInventory({ getters, dispatch }) {
      const materialId = getters.material.materialId
      const material = Object.fromEntries(
        Object.entries(getters.material).filter(([key]) =>
          [
            'sampleCardsRemainingQty',
            'sampleCardsLocation',
            'hangersRemainingQty',
            'hangersLocation',
            'inventoryList',
            'isPublicInventory',
          ].includes(key)
        )
      )
      await dispatch('callAssetsApi', {
        func: 'updateMaterialSimpleInventory',
        params: { materialId, material },
      })
    },
    async updateMaterialSimplePublicPrice({ getters, dispatch }) {
      const materialId = getters.material.materialId
      const material = Object.fromEntries(
        Object.entries(getters.material).filter(([key]) =>
          ['publicPrice'].includes(key)
        )
      )
      await dispatch('callAssetsApi', {
        func: 'updateMaterialSimplePublicPrice',
        params: { materialId, material },
      })
    },
    async updateMaterialSimpleTag({ getters, dispatch }) {
      const materialId = getters.material.materialId
      const material = Object.fromEntries(
        Object.entries(getters.material).filter(([key]) =>
          ['publicTagList', 'privateTagList', 'aiTagList'].includes(key)
        )
      )
      await dispatch('callAssetsApi', {
        func: 'updateMaterialSimpleTag',
        params: { materialId, material },
      })
    },
    async addPantone({ getters, dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'addPantone',
        params: { ...params, materialId: getters.material.materialId },
      })
      dispatch('setAssetsModule', data.result)
    },
    async removePantone({ getters, dispatch }, { materialPantoneId }) {
      const params = {
        materialPantoneId,
        materialId: getters.material.materialId,
      }
      const { data } = await dispatch('callAssetsApi', {
        func: 'removePantone',
        params,
      })
      dispatch('setAssetsModule', data.result)
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {string} params.tempMaterialId
     * @param {object} params.file - file object
     * @param {string} params.displayFileName
     */
    async uploadAttachmentWhenCreate({ commit, dispatch }, params) {
      const { file } = params

      let attachment = null
      if (file) {
        attachment = await dispatch(
          'uploadFileToS3',
          { fileName: file.name, file },
          { root: true }
        )
      }

      const tempParams = {
        ...params,
        tempUploadId: attachment.tempUploadId,
        attachmentFileName: attachment.fileName,
      }
      delete tempParams.file

      const { data } = await dispatch('callAssetsApi', {
        func: 'uploadAttachmentWhenCreate',
        params: tempParams,
      })
      commit('UPDATE_attachmentList', data.result.attachmentList)
    },
    async removeAttachmentWhenCreate({ commit, dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'removeAttachmentWhenCreate',
        params,
      })
      commit('UPDATE_attachmentList', data.result.attachmentList)
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {object} params.file - file object
     * @param {string} params.displayFileName
     */
    async uploadAttachmentWhenUpdate({ getters, dispatch, commit }, params) {
      const { file } = params

      let attachment = null
      if (file) {
        attachment = await dispatch(
          'uploadFileToS3',
          { fileName: file.name, file },
          { root: true }
        )
      }

      const tempParams = {
        ...params,
        materialId: getters.material.materialId,
        tempUploadId: attachment.tempUploadId,
        attachmentFileName: attachment.fileName,
      }
      delete tempParams.file

      const { data } = await dispatch('callAssetsApi', {
        func: 'uploadAttachmentWhenUpdate',
        params: tempParams,
      })
      commit('UPDATE_attachmentList', data.result.material.attachmentList)
    },
    async removeAttachmentWhenUpdate(
      { getters, dispatch, commit },
      { materialAttachmentId }
    ) {
      const params = {
        materialId: getters.material.materialId,
        materialAttachmentId,
      }
      const { data } = await dispatch('callAssetsApi', {
        func: 'removeAttachmentWhenUpdate',
        params,
      })
      commit('UPDATE_attachmentList', data.result.material.attachmentList)
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {number} params.coverMode
     * @param {number} params.materialAttachmentId
     * @param {object} params.attachmentCropImg - file object
     */
    async changeCoverImg({ getters, dispatch }, params) {
      const { attachmentCropImg } = params
      const tempParams = {
        ...params,
        materialId: getters.material.materialId,
      }

      if (attachmentCropImg) {
        const { tempUploadId, fileName } = await dispatch(
          'uploadFileToS3',
          { fileName: attachmentCropImg.name, file: attachmentCropImg },
          { root: true }
        )
        tempParams.tempUploadId = tempUploadId
        tempParams.attachmentCropImgFileName = fileName
      }

      delete tempParams.attachmentCropImg

      const { data } = await dispatch('callAssetsApi', {
        func: 'changeCoverImg',
        params: tempParams,
      })
      dispatch('setAssetsModule', data.result)
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {boolean} params.isExchange
     * @param {object} params.faceSideCropImg - file object
     * @param {object} params.backSideCropImg - file object
     * @param {object} params.faceSideCropImageRecord
     * @param {object} params.backSideCropImageRecord
     *
     */
    async updateScannedImage({ getters, dispatch }, params) {
      const { faceSideCropImg, backSideCropImg } = params
      const faceSideCropImgFileName = faceSideCropImg?.name || null
      const backSideCropImgFileName = backSideCropImg?.name || null
      let id = null

      if (faceSideCropImg || backSideCropImg) {
        const {
          data: {
            result: {
              tempUploadId,
              faceSideCropImgUploadUrl,
              backSideCropImgUploadUrl,
            },
          },
        } = await dispatch('callAssetsApi', {
          func: 'getUploadUrlUpdateScannedImage',
          params: { faceSideCropImgFileName, backSideCropImgFileName },
        })

        id = tempUploadId
        !!faceSideCropImg &&
          (await putBinaryData(faceSideCropImgUploadUrl, faceSideCropImg))
        !!backSideCropImg &&
          (await putBinaryData(backSideCropImgUploadUrl, backSideCropImg))
      }

      const tempParams = {
        ...params,
        materialId: getters.material.materialId,
        tempUploadId: id,
        faceSideCropImgFileName,
        backSideCropImgFileName,
      }
      delete tempParams.faceSideCropImg
      delete tempParams.backSideCropImg

      const { data } = await dispatch('callAssetsApi', {
        func: 'updateScannedImage',
        params: tempParams,
      })
      dispatch('setAssetsModule', data.result)
    },

    /**
     * @param {object} context
     * @param {object} params
     * @param {number} params.isAutoRepeat
     * @param {object} params.faceSideCropImg - file object
     * @param {object} params.backSideCropImg - file object
     * @param {string?} params.faceSideCropImageRecord
     * @param {string?} params.backSideCropImageRecord
     */
    async generateU3m({ getters, dispatch }, params) {
      const { faceSideCropImg, backSideCropImg } = params
      const faceSideCropImgFileName = faceSideCropImg?.name || null
      const backSideCropImgFileName = backSideCropImg?.name || null
      let id = null

      if (faceSideCropImg || backSideCropImg) {
        const {
          data: {
            result: {
              tempUploadId,
              faceSideCropImgUploadUrl,
              backSideCropImgUploadUrl,
            },
          },
        } = await dispatch('callAssetsApi', {
          func: 'getUploadUrlGenerateU3m',
          params: { faceSideCropImgFileName, backSideCropImgFileName },
        })

        id = tempUploadId
        !!faceSideCropImg &&
          (await putBinaryData(faceSideCropImgUploadUrl, faceSideCropImg))
        !!backSideCropImg &&
          (await putBinaryData(backSideCropImgUploadUrl, backSideCropImg))
      }

      const tempParams = {
        ...params,
        materialId: getters.material.materialId,
        tempUploadId: id,
        faceSideCropImgFileName,
        backSideCropImgFileName,
      }
      delete tempParams.faceSideCropImg
      delete tempParams.backSideCropImg

      const { data } = await dispatch('callAssetsApi', {
        func: 'generateU3m',
        params: tempParams,
      })
      dispatch('setAssetsModule', data.result)
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
    async getMaterialListForModal(_, params) {
      const { id, keyword, targetPage, sort, nodeLocation } = params
      const tempParams = {
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
        tempParams.search = null
      }

      const { data } = await assetsApi.getMaterialList(
        Number(nodeLocation) === OG_TYPE.ORG ? 'org' : 'group',
        id,
        tempParams
      )
      return data.result
    },
    async mergeMaterial({ dispatch }, params) {
      await dispatch('callAssetsApi', { func: 'mergeMaterial', params })
    },
    async deleteMaterial({ dispatch }, params) {
      await dispatch('callAssetsApi', { func: 'deleteMaterial', params })
    },
    async deleteCheckMaterial({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'deleteCheckMaterial',
        params,
      })
      return data.result
    },
    async exportMaterial({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'exportMaterial',
        params,
      })
      const { extension, file, fileName } = data?.result
      downloadBase64File(file, extension, fileName)
    },
    async massExportMaterial({ dispatch }, params) {
      await dispatch('callAssetsApi', { func: 'massExportMaterial', params })
    },
    async cloneCheck({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'cloneCheck',
        params,
      })
      return data.result.estimatedQuota
    },
    async cloneMaterial({ dispatch }, params) {
      await dispatch('callAssetsApi', { func: 'cloneMaterial', params })
    },
    async addToWorkspace({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'addToWorkspace',
        params,
      })
      return data.result.failMaterialList
    },
    async batchUpload({ dispatch }, params) {
      const { xlsxFile } = params
      const { tempUploadId, fileName } = await dispatch(
        'uploadFileToS3',
        { fileName: xlsxFile.name, file: xlsxFile },
        { root: true }
      )
      const tempParams = {
        tempUploadId,
        xlsxFileName: fileName,
      }
      const { data } = await dispatch('callAssetsApi', {
        func: 'batchUpload',
        params: tempParams,
      })
      return data
    },

    /**
     * @param {object} params
     * @param {number} params.materialId
     * @param {File} params.u3mFile
     * @param {boolean} params.needToGeneratePhysical
     */
    async customU3mUpload(
      { getters, dispatch, commit },
      { materialId, u3mFile, needToGeneratePhysical }
    ) {
      const { showNotifyBanner, closeNotifyBanner } = useNotifyStore()

      showNotifyBanner({
        notifyType: NOTIFY_TYPE.INFO,
        title: i18n.global.t('EE0176'),
        messageText: i18n.global.t('EE0177'),
      })
      commit('PUSH_uploadingU3mMaterialIdList', materialId)

      const { tempUploadId, fileName } = await dispatch(
        'uploadFileToS3',
        { fileName: u3mFile.name, file: u3mFile },
        { root: true }
      )
      await dispatch('callAssetsApi', {
        func: 'customU3mUpload',
        params: {
          materialId,
          tempUploadId,
          fileName,
          needToGeneratePhysical,
        },
      })
      commit('REMOVE_uploadingU3mMaterialIdList', materialId)
      if (getters.uploadingU3mMaterialIdList.length === 0) {
        closeNotifyBanner()
      }
    },
    async smartUpload({ dispatch }, params) {
      const { data } = await dispatch('callAssetsApi', {
        func: 'smartUpload',
        params,
      })
      return data
    },
  },
}
