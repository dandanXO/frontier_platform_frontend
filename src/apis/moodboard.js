import axios from '@/apis'

const apiWrapper = (path, type = 'org', id, params = {}) => {
  const data = { ...params }
  if (type === 'org') {
    data['orgId'] = id
  } else {
    data['groupId'] = id
  }
  const prefixPath = type === 'org' ? '/org' : '/org/group'
  return axios(`${prefixPath}${path}`, { method: 'POST', data })
}

export default {
  getMoodboardList: (type, id) => apiWrapper('/moodboard/get-list', type, id),

  /**
   * @param {object} params
   * @param {number} params.moodboardId
   */
  getMoodboard: (type, id, params) => apiWrapper('/moodboard/get', type, id, params),

  /**
   * @param {object} params
   * @param {string} params.moodboardName
   * @param {string} params.description
   * @param {object?} params.trendBoard - {tempUploadId, fileName}
   * @param {object[]?} params.attachmentList - [{tempUploadId, fileName}]
   */
  createMoodboard: (type, id, params) => apiWrapper('/moodboard/create', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.moodboardId
   * @param {string} params.moodboardName
   * @param {string} params.description
   * @param {object?} params.newTrendBoard - {tempUploadId, fileName}
   * @param {object[]?} params.newAttachmentList - [{tempUploadId, fileName}]
   * @param {number[]?} params.deleteAttachmentIdList
   * @param {boolean} params.isDeleteTrendBoard
   */
  updateMoodboard: (type, id, params) => apiWrapper('/moodboard/update', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.moodboardId
   */
  deleteMoodboard: (type, id, params) => apiWrapper('/moodboard/delete', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.moodboardId
   * @param {number} params.nodeId
   * @param {string} params.keyword
   */
  getMoodboardNodeCollection: (type, id, params) => apiWrapper('/moodboard/offer/node/collection/get', type, id, params),

  /**
   * @param {object} params 
   * @param {number[]} params.nodeIdList
   */
  deleteMoodboardNode: (type, id, params) => apiWrapper('/moodboard/offer/node/delete', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.nodeId
   */
  pickMoodboardNode: (type, id, params) => apiWrapper('/moodboard/offer/node/pick', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.nodeId
   */
  unpickMoodboardNode: (type, id, params) => apiWrapper('/moodboard/offer/node/unpick', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.moodboardId
   * @param {number} params.offerId
   * @param {string} params.keyword
   */
  getPickedMoodboardNode: (type, id, params) => apiWrapper('/moodboard/offer/picked/get', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.nodeIdList
   */
  cloneCheckMoodboardNode: (type, id, params) => apiWrapper('/moodboard/offer/node/clone-check', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.nodeIdList
   * @param {object[]} params.targetLocationList - [{id, location}]
   * @param {object} params.optional - {u3m, attachment}
   */
  cloneMoodboardNode: (type, id, params) => apiWrapper('/moodboard/offer/node/clone', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.moodboardId
   * @param {number[]} params.nodeIdList
   */
  exportMoodboardNode: (type, id, params) => apiWrapper('/moodboard/offer/picked/export', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.moodboardId
   * @param {number[]} params.nodeIdList
   */
  massExportMoodboardNode: (type, id, params) => apiWrapper('/moodboard/offer/picked/mass-export', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.moodboardId
   * @param {number} params.offerId
   */
  getMoodboardComment: (type, id, params) => apiWrapper('/moodboard/offer/comment/get', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.moodboardId
   * @param {number} params.offerId
   * @param {string} params.comment
   */
  createMoodboardComment: (type, id, params) => apiWrapper('/moodboard/offer/comment/create', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.moodboardId
   * @param {string} params.target
   */
  getMoodboardShareTarget: (type, id, params) => apiWrapper('/moodboard/share/get-target', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.moodboardId
   * @param {object[]} params.targetList
   * @param {string} params.message
   */
  shareMoodboard: (type, id, params) => apiWrapper('/moodboard/share', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.shareId
   */
  removeMoodboardShare: (type, id, params) => apiWrapper('/moodboard/share/remove', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.nodeId
   */
  getMoodboardNodeMaterial: (type, id, params) => apiWrapper('/moodboard/offer/node/material/get', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.nodeId
   * @param {number[]} params.materialIdList
   */
  addMaterialToMoodboardNode: (type, id, params) => apiWrapper('/moodboard/offer/node/material/create', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.nodeId
   * @param {string} params.name
   * @param {string} params.description
   */
  createMoodboardNodeCollection: (type, id, params) => apiWrapper('/moodboard/offer/node/collection/create', type, id, params),

  /**
   * @param {object} params 
   * @param {number} params.nodeId
   * @param {string} params.name
   * @param {string} params.description
   */
  updateMoodboardNodeCollection: (type, id, params) => apiWrapper('/moodboard/offer/node/collection/update', type, id, params),
}
