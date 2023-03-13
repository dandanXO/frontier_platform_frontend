import axios from '@/apis'

export default {
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.materialId
   */
  getDigitalThreadList: (data) =>
    axios('/digital-thread/get-list', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadId
   * @param {object} data.filter
   * @param {number} data.filter.addTo
   * @param {boolean} data.filter.isStarred
   * @param {object} data.filter.addedBy
   * @param {boolean} data.filter.addedBy.addedByMe
   * @param {boolean} data.filter.addedBy.addedByInternalUnit
   * @param {boolean} data.filter.addedBy.addedByExternalUnit
   * @param {string} data.filter.createStartDate
   * @param {string} data.filter.createEndDate
   * @param {string[]} data.filter.tagList
   */
  getDigitalThread: (data) =>
    axios('/digital-thread/get', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.materialId
   */
  getDigitalThreadMaterial: (data) =>
    axios('/digital-thread/get-material', {
      method: 'POST',
      data,
    }),

  /**
   *
   * @param {object} data
   * @param {number} data.addFromOGId
   * @param {number} data.addFromOGType
   */
  getStickerTagList: (data) =>
    axios('/polling/digital-thread/sticker/tag-list/get', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.materialId
   * @param {number} data.addFromLocationType
   * @param {string[]} data.addFromLocationList
   * @param {string} data.digitalThreadName
   * @param {number} data.addFromOGId
   * @param {number} data.addFromOGType
   * @param {number} data.addTo
   * @param {number} data.type
   * @param {string} data.content
   * @param {string[]} data.tagList
   */
  createDigitalThread: (data) =>
    axios('/digital-thread/create', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadId
   * @param {string} data.digitalThreadName
   */
  updateDigitalThreadName: (data) =>
    axios('/digital-thread/update/digital-thread-name', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadId
   * @param {number} data.addTo
   * @param {number} data.type
   * @param {string} data.content
   * @param {string[]} data.tagList
   */
  createSticker: (data) =>
    axios('/digital-thread/sticker/create', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.stickerId
   * @param {string} data.content
   */
  createChildSticker: (data) =>
    axios('/digital-thread/sticker/child-sticker/create', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.stickerId
   * @param {string[]} data.tagList
   */
  updateStickerTagList: (data) =>
    axios('/digital-thread/sticker/update/tag', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.stickerId
   */
  starSticker: (data) =>
    axios('/digital-thread/sticker/star', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.stickerId
   */
  unstarSticker: (data) =>
    axios('/digital-thread/sticker/unstar', {
      method: 'POST',
      data,
    }),
}
