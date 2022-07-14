import { apiWrapper } from '@/apis'

export default {
  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   * @param {object} params.pagination
   * @param {object?} params.search
   * @param {object?} params.filter
   */
  getWorkspaceOrCollection: (type, id, params) => apiWrapper('/workspace/get', type, id, params),

  /**
   * @param {object} params
   * @param {number?} params.workspaceNodeId
   * @param {number?} params.workspaceNodeLocation
   * @param {object?} params.search
   * @param {object} params.pagination
   */
  getWorkspaceForModal: (type, id, params) => apiWrapper('/workspace/get-for-modal', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   */
  getWorkspaceMaterial: (type, id, params) => apiWrapper('/workspace/get-material', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   * @param {string} params.collectionName
   * @param {string?} params.tempUploadId
   * @param {string?} params.trendBoardFileName
   * @param {string?} params.description
   */
  createCollection: (type, id, params) => apiWrapper('/workspace/collection/create', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.collectionId
   * @param {string} params.collectionName
   * @param {string?} params.tempUploadId
   * @param {string?} params.trendBoardFileName
   * @param {string?} params.description
   */
  updateCollection: (type, id, params) => apiWrapper('/workspace/collection/update', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.collectionId
   */
  removeTrendBoard: (type, id, params) => apiWrapper('/workspace/collection/remove-trend-board', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   * @param {object[]} params.targetWorkspaceNodeList - [{id, location}]
   */
  duplicateNode: (type, id, params) => apiWrapper('/workspace/node/duplicate', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   * @param {number} params.targetWorkspaceNodeId
   */
  moveNode: (type, id, params) => apiWrapper('/workspace/node/move', type, id, params),

  /**
   * @param {object} params
   * @param {number[]} params.workspaceNodeIdList
   */
  deleteNode: (type, id, params) => apiWrapper('/workspace/node/delete', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   * @param {boolean} params.isPublic
   * @param {boolean} params.isCanClone
   * @param {boolean} params.isCanDownloadU3M
   */
  publishNode: (type, id, params) => apiWrapper('/workspace/node/publish', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   */
  getShareInfo: (type, id, params) => apiWrapper('/workspace/node/share/get', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   * @param {string} params.target
   */
  getShareTarget: (type, id, params) => apiWrapper('/workspace/node/share/assigned/get-target', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   * @param {object[]} params.targetList - [{type, name, logo, number}]
   * @param {boolean} params.isCanClone
   * @param {boolean} params.isCanDownloadU3M
   * @param {string?} params.messages
   */
  assignedShare: (type, id, params) => apiWrapper('/workspace/node/share/assigned', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.type
   * @param {number} params.id - SharingId Or OrgShareToMeId Or GroupShareToMeId
   * @param {boolean} params.isCanClone
   * @param {boolean} params.isCanDownloadU3M
   */
  updatedAssignedShare: (type, id, params) => apiWrapper('/workspace/node/share/assigned/update', type, id, params),

  /**
   * @param {object} params
   * @param {number?} params.type
   * @param {number} params.id - SharingId Or OrgShareToMeId Or GroupShareToMeId
   */
  removeAssignedShare: (type, id, params) => apiWrapper('/workspace/node/share/assigned/remove', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   * @param {boolean} params.isCanShared
   */
  toggleCopyLink: (type, id, params) => apiWrapper('/workspace/node/share/copy-link/update-setting', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   */
  generateCopyLink: (type, id, params) => apiWrapper('/workspace/node/share/copy-link/generate', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.workspaceNodeId
   * @param {number} params.type
   */
  generateSocialMedia: (type, id, params) => apiWrapper('/workspace/node/share/social/generate', type, id, params),

  /**
   * @param {object} params
   * @param {string} params.embedKey
   * @param {boolean} params.isCanDownloadU3M
   */
  updateEmbedDownloadPermission: (type, id, params) => apiWrapper('/workspace/node/share/embed/update-setting', type, id, params),
}
