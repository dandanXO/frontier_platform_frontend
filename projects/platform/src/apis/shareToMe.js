import { apiWrapper } from '@/apis'

export default {
  /**
   * @param {object} params
   * @param {number} params.sharingId
   * @param {number} params.workspaceNodeId
   * @param {object} params.pagination
   * @param {object?} params.search
   * @param {object?} params.filter
   */
  getShareToMeList: (type, id, params) =>
    apiWrapper('/share-to-me/get-list', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.sharingId
   * @param {object[]} params.workspaceNodeId
   * @param {number} params.keyword
   * @param {number} params.rank
   */
  getShareToMeMaterial: (type, id, params) =>
    apiWrapper('/share-to-me/get-material', type, id, params),

  /**
   * @param {object} params
   * @param {object[]} params.workspaceNodeList - [{id, location}]
   */
  cloneCheckShareToMe: (type, id, params) =>
    apiWrapper('/share-to-me/clone-check', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.sharingId
   * @param {object[]} params.workspaceNodeList - [{id, location}]
   * @param {object[]} params.targetLocationList - [{id, location}]
   * @param {object} params.optional - {u3m, attachment}
   */
  cloneShareToMe: (type, id, params) =>
    apiWrapper('/share-to-me/clone', type, id, params),

  /**
   * @param {object} params
   * @param {object[]} params.workspaceNodeList - [{id, location}]
   */
  deleteShareToMe: (type, id, params) =>
    apiWrapper('/share-to-me/delete', type, id, params),
}
