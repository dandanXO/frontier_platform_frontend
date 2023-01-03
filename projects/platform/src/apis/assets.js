import { apiWrapper } from '@/apis'

export default {
  /**
   * @param {object} params
   * @param {object} params.pagination
   * @param {object} params.search
   * @param {object} params.filter
   */
  getMaterialList: (type, id, params) =>
    apiWrapper('/assets/material/get-list', type, id, params),

  /**
   * @param {object} params
   * @param {object[]} params.mergedList - [{faceSideMaterialId, backSideMaterialId, detailMaterialId}]
   */
  mergeMaterial: (type, id, params) =>
    apiWrapper('/assets/material/merge', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.materialIdList
   */
  deleteMaterial: (type, id, params) =>
    apiWrapper('/assets/material/delete', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.materialIdList
   */
  deleteCheckMaterial: (type, id, params) =>
    apiWrapper('/assets/material/delete-check', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.materialIdList
   */
  exportMaterial: (type, id, params) =>
    apiWrapper('/assets/material/export', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.materialIdList
   */
  massExportMaterial: (type, id, params) =>
    apiWrapper('/assets/material/mass-export', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.materialIdList
   */
  cloneCheck: (type, id, params) =>
    apiWrapper('/assets/material/clone-check', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.materialIdList
   * @param {object[]} params.targetLocationList - [{id, location}]
   * @param {object} params.optional - {u3m, attachment}
   */
  cloneMaterial: (type, id, params) =>
    apiWrapper('/assets/material/clone', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.materialIdList
   * @param {object[]} params.targetWorkspaceNodeList - [{id, location}]
   */
  addToWorkspace: (type, id, params) =>
    apiWrapper('/assets/material/add-to-workspace', type, id, params),

  /**
   * @param {object} params
   * @param {string} params.tempUploadId
   * @param {string} params.xlsxFileName
   */
  batchUpload: (type, id, params) =>
    apiWrapper('/assets/material/batch-upload', type, id, params),

  /**
   * @param {object} params
   * @param {object[]} params.fileList - [{tempUploadId, fileName}]
   */
  smartUpload: (type, id, params) =>
    apiWrapper('/assets/material/smart-upload', type, id, params),

  getMaterialOptions: (type, id) =>
    apiWrapper('/assets/material/options', type, id),

  /**
   * @param {object} params
   * @param {number} params.materialId
   */
  getMaterial: (type, id, params) =>
    apiWrapper('/assets/material/get', type, id, params),

  /**
   * @param {object} params
   * @param {string} params.tempMaterialId
   * @param {object} params.material
   */
  createMaterial: (type, id, params) =>
    apiWrapper('/assets/material/create', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {object} params.material
   */
  updateMaterial: (type, id, params) =>
    apiWrapper('/assets/material/update', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {object} params.material
   */
  updateMaterialSimpleSpec: (type, id, params) =>
    apiWrapper('/assets/material/update/simple/spec', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {object} params.material
   */
  updateMaterialSimpleInventory: (type, id, params) =>
    apiWrapper('/assets/material/update/simple/inventory', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {object} params.material
   */
  updateMaterialSimplePublicPrice: (type, id, params) =>
    apiWrapper('/assets/material/update/simple/public-price', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {object} params.material
   */
  updateMaterialSimpleTag: (type, id, params) =>
    apiWrapper('/assets/material/update/simple/tag', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {string} params.name
   */
  addPantone: (type, id, params) =>
    apiWrapper('/assets/material/update/add-pantone', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {number} params.materialPantoneId
   */
  removePantone: (type, id, params) =>
    apiWrapper('/assets/material/update/remove-pantone', type, id, params),

  /**
   * @param {object} params
   * @param {string} params.tempMaterialId
   * @param {string} params.tempUploadId
   * @param {string} params.attachmentFileName
   * @param {string} params.displayFileName
   */
  uploadAttachmentWhenCreate: (type, id, params) =>
    apiWrapper('/assets/material/create/upload-attachment', type, id, params),

  /**
   * @param {object} params
   * @param {string} params.tempMaterialId
   * @param {number} params.tempMaterialAttachmentId
   */
  removeAttachmentWhenCreate: (type, id, params) =>
    apiWrapper('/assets/material/create/remove-attachment', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {string} params.tempUploadId
   * @param {string} params.attachmentFileName
   * @param {string} params.displayFileName
   */
  uploadAttachmentWhenUpdate: (type, id, params) =>
    apiWrapper('/assets/material/update/upload-attachment', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {number} params.materialAttachmentId
   */
  removeAttachmentWhenUpdate: (type, id, params) =>
    apiWrapper('/assets/material/update/remove-attachment', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {number} params.coverMode
   * @param {number?} params.materialAttachmentId
   * @param {string?} params.tempUploadId
   * @param {string?} params.attachmentCropImgFileName
   */
  changeCoverImg: (type, id, params) =>
    apiWrapper('/assets/material/update/cover-img', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {boolean} params.isExchange
   * @param {string?} params.tempUploadId
   * @param {string?} params.faceSideCropImgFileName
   * @param {string?} params.backSideCropImgFileName
   * @param {object?} params.faceSideCropImageRecord - { x, y, rotateDeg, scaleRatio }
   * @param {object?} params.backSideCropImageRecord - { x, y, rotateDeg, scaleRatio }
   *
   */
  updateScannedImage: (type, id, params) =>
    apiWrapper('/assets/material/update/scan-image', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialId
   * @param {boolean} params.isAutoRepeat
   * @param {string?} params.tempUploadId
   * @param {string?} params.faceSideCropImgFileName
   * @param {string?} params.backSideCropImgFileName
   * @param {string?} params.faceSideCropImageRecord
   * @param {string?} params.backSideCropImageRecord
   */
  generateU3m: (type, id, params) =>
    apiWrapper('/assets/material/update/generate-u3m', type, id, params),

  /**
   * @param {object} params
   * @param {string?} params.startDate
   * @param {string?} params.endDate
   * @param {number?} params.status
   * @param {object} params.pagination
   */
  getMaterialUploadProgress: (type, id, params) =>
    apiWrapper('/assets/upload-progress/material/get-list', type, id, params),

  /**
   * @param {object} params
   * @param {string?} params.startDate
   * @param {string?} params.endDate
   * @param {string?} params.keyword
   * @param {number?} params.status
   * @param {object} params.pagination
   */
  getU3mUploadProgress: (type, id, params) =>
    apiWrapper('/assets/upload-progress/u3m/get-list', type, id, params),

  /**
   * @param {object} params
   * @param {string?} params.startDate
   * @param {string?} params.endDate
   * @param {string?} params.keyword
   * @param {number?} params.status
   * @param {number?} params.category
   * @param {object} params.pagination
   */
  getExcelUploadProgress: (type, id, params) =>
    apiWrapper('/assets/upload-progress/excel/get-list', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.materialProgressId
   */
  cancelMaterialUploadProgress: (type, id, params) =>
    apiWrapper('/assets/upload-progress/material/cancel', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.u3mProgressId
   */
  cancelU3mUploadProgress: (type, id, params) =>
    apiWrapper('/assets/upload-progress/u3m/cancel', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.excelProgressId
   */
  cancelExcelUploadProgress: (type, id, params) =>
    apiWrapper('/assets/upload-progress/excel/cancel', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.excelProgressId
   */
  getExcelUploadMaterialList: (type, id, params) =>
    apiWrapper(
      '/assets/upload-progress/excel/get-material-list',
      type,
      id,
      params
    ),
}
