import assetsApi from '@/apis/assets'
import { downloadBase64File } from '@/utils/fileOperator'
import { NODE_LOCATION, DISPLAY_NODE } from '@/utils/constants'
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
    async getMaterialOptions ({ rootGetters, commit }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getMaterialOptions({ orgId: rootGetters['organization/orgId'] })
        : await assetsApi.group.getMaterialOptions({ groupId: rootGetters['group/groupId'] })

      commit('SET_code', data.result.code)
    },
    async getMaterial ({ rootGetters, dispatch }, { materialId }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getMaterial({ orgId: rootGetters['organization/orgId'], materialId })
        : await assetsApi.group.getMaterial({ groupId: rootGetters['group/groupId'], materialId })

      dispatch('setAssetsModule', data.result)
    },
    async getMaterialList ({ rootGetters, dispatch }, { targetPage = 1 }) {
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)

      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getMaterialList({ orgId: rootGetters['organization/orgId'], ...searchParams })
        : await assetsApi.group.getMaterialList({ groupId: rootGetters['group/groupId'], ...searchParams })

      dispatch('setAssetsModule', data.result)
    },
    async createMaterial ({ rootGetters, getters, dispatch }, { tempMaterialId }) {
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
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.createMaterial({ orgId: rootGetters['organization/orgId'], tempMaterialId, material })
        : await assetsApi.group.createMaterial({ groupId: rootGetters['group/groupId'], tempMaterialId, material })

      dispatch('setAssetsModule', data.result)
    },
    async updateMaterial ({ rootGetters, getters }) {
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
      rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.updateMaterial({ orgId: rootGetters['organization/orgId'], materialId, material })
        : await assetsApi.group.updateMaterial({ groupId: rootGetters['group/groupId'], materialId, material })
    },
    async addPantone ({ rootGetters, getters, dispatch }, { name }) {
      const params = {
        name,
        materialId: getters.material.materialId
      }
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.addPantone({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.addPantone({ groupId: rootGetters['group/groupId'], ...params })

      dispatch('setAssetsModule', data.result)
    },
    async removePantone ({ rootGetters, getters, dispatch }, { materialPantoneId }) {
      const params = {
        materialPantoneId,
        materialId: getters.material.materialId
      }
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.removePantone({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.removePantone({ groupId: rootGetters['group/groupId'], ...params })

      dispatch('setAssetsModule', data.result)
    },
    async uploadAttachmentWhenCreate ({ rootGetters, commit }, { tempMaterialId, file, displayFileName }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.createAttachment.upload({ orgId: rootGetters['organization/orgId'], tempMaterialId, file, displayFileName })
        : await assetsApi.group.createAttachment.upload({ groupId: rootGetters['group/groupId'], tempMaterialId, file, displayFileName })

      commit('UPDATE_attachmentList', data.result.attachmentList)
    },
    async removeAttachmentWhenCreate ({ rootGetters, commit }, { tempMaterialId, tempMaterialAttachmentId }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.createAttachment.remove({ orgId: rootGetters['organization/orgId'], tempMaterialId, tempMaterialAttachmentId })
        : await assetsApi.group.createAttachment.remove({ groupId: rootGetters['group/groupId'], tempMaterialId, tempMaterialAttachmentId })

      commit('UPDATE_attachmentList', data.result.attachmentList)
    },
    async uploadAttachmentWhenUpdate ({ rootGetters, getters, commit }, { file, displayFileName }) {
      const params = {
        materialId: getters.material.materialId,
        file,
        displayFileName
      }

      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.updateAttachment.upload({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.updateAttachment.upload({ groupId: rootGetters['group/groupId'], ...params })

      commit('UPDATE_attachmentList', data.result.material.attachmentList)
    },
    async removeAttachmentWhenUpdate ({ rootGetters, getters, commit }, { materialAttachmentId }) {
      const params = {
        materialId: getters.material.materialId,
        materialAttachmentId
      }

      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.updateAttachment.remove({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.updateAttachment.remove({ groupId: rootGetters['group/groupId'], ...params })

      commit('UPDATE_attachmentList', data.result.material.attachmentList)
    },
    async changeCoverImg ({ rootGetters, getters, dispatch }, { coverMode, materialAttachmentId = null, attachmentCropImg = null }) {
      const params = {
        materialId: getters.material.materialId,
        coverMode,
        materialAttachmentId,
        attachmentCropImg
      }
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.changeCoverImg({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.changeCoverImg({ groupId: rootGetters['group/groupId'], ...params })

      dispatch('setAssetsModule', data.result)
    },
    async updateScannedImage ({ rootGetters, getters, dispatch }, { isExchange, faceSideCropImg, backSideCropImg }) {
      const params = {
        materialId: getters.material.materialId,
        isExchange,
        faceSideCropImg,
        backSideCropImg
      }
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.updateScannedImage({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.updateScannedImage({ groupId: rootGetters['group/groupId'], ...params })

      dispatch('setAssetsModule', data.result)
    },
    async generateU3m ({ rootGetters, getters, dispatch }, { isAutoRepeat = true, faceSideCropImg = null, backSideCropImg = null }) {
      const params = {
        materialId: getters.material.materialId,
        isAutoRepeat,
        faceSideCropImg,
        backSideCropImg
      }
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.generateU3m({ orgId: rootGetters['organization/orgId'], ...params })
        : await assetsApi.group.generateU3m({ groupId: rootGetters['group/groupId'], ...params })

      const { u3m } = data.result.material
      dispatch('setAssetsModule', {
        material: {
          u3m
        }
      })
    },
    async getMaterialListForModal (_, { nodeLocation, id, keyword, targetPage = 1, sort }) {
      const params = {
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

      const { data } = NODE_LOCATION.ORG === Number(nodeLocation)
        ? await assetsApi.org.getMaterialList({ orgId: id, ...params })
        : await assetsApi.group.getMaterialList({ groupId: id, ...params })

      return data.result
    },
    async mergeMaterial ({ rootGetters }, { mergedList }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.mergeMaterial({ orgId: rootGetters['organization/orgId'], mergedList })
        : await assetsApi.group.mergeMaterial({ groupId: rootGetters['group/groupId'], mergedList })
    },
    async deleteMaterial ({ rootGetters }, { materialIdList }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.deleteMaterial({ orgId: rootGetters['organization/orgId'], materialIdList })
        : await assetsApi.group.deleteMaterial({ groupId: rootGetters['group/groupId'], materialIdList })
    },
    async deleteCheckMaterial ({ rootGetters }, { materialIdList }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.deleteCheckMaterial({ orgId: rootGetters['organization/orgId'], materialIdList })
        : await assetsApi.group.deleteCheckMaterial({ groupId: rootGetters['group/groupId'], materialIdList })
      return data.result
    },
    async exportMaterial ({ rootGetters }, { materialIdList }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.exportMaterial({ orgId: rootGetters['organization/orgId'], materialIdList })
        : await assetsApi.group.exportMaterial({ groupId: rootGetters['group/groupId'], materialIdList })

      const { extension, file, fileName } = data?.result
      downloadBase64File(file, extension, fileName)
    },
    async massExportMaterial ({ rootGetters }, { materialIdList }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.massExportMaterial({ orgId: rootGetters['organization/orgId'], materialIdList })
        : await assetsApi.group.massExportMaterial({ groupId: rootGetters['group/groupId'], materialIdList })
    },
    async cloneCheck ({ rootGetters }, { materialIdList }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.cloneCheck({ orgId: rootGetters['organization/orgId'], materialIdList })
        : await assetsApi.group.cloneCheck({ groupId: rootGetters['group/groupId'], materialIdList })

      return data.result.estimatedQuota
    },
    async cloneMaterial ({ rootGetters }, { targetLocationList, materialIdList, optional }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.cloneMaterial({ orgId: rootGetters['organization/orgId'], targetLocationList, materialIdList, optional })
        : await assetsApi.group.cloneMaterial({ groupId: rootGetters['group/groupId'], targetLocationList, materialIdList, optional })
    },
    async addToWorkspace ({ rootGetters }, { targetWorkspaceNodeList, materialIdList }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.addToWorkspace({ orgId: rootGetters['organization/orgId'], targetWorkspaceNodeList, materialIdList })
        : await assetsApi.group.addToWorkspace({ groupId: rootGetters['group/groupId'], targetWorkspaceNodeList, materialIdList })

      return data.result.failMaterialList
    },
    async batchUpload ({ rootGetters }, { xlsxFile }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.batchUpload({ orgId: rootGetters['organization/orgId'], xlsxFile })
        : await assetsApi.group.batchUpload({ groupId: rootGetters['group/groupId'], xlsxFile })

      return data
    },
    async smartUpload ({ rootGetters }, { fileList }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.smartUpload({ orgId: rootGetters['organization/orgId'], fileList })
        : await assetsApi.group.smartUpload({ groupId: rootGetters['group/groupId'], fileList })

      return data
    },
    async getSmartUploadUrl ({ rootGetters }, { fileName }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await assetsApi.org.getSmartUploadUrl({ fileName })
        : await assetsApi.group.getSmartUploadUrl({ fileName })

      return data
    }
  }
}
