import axios from '@/apis'
interface IData {
  orgId?: number
  materialId?: number
  ogType?: number
  ogId?: number
  digitalThreadSideId?: number
  filter: {
    addTo?: number
    isStarred?: boolean
    addedBy: {
      addedByMe?: boolean
      addedByInternalUnit?: boolean
      addedByExternalUnit?: boolean
    }
    createStartDate?: string
    createEndDate?: string
    tagList?: string
  }
  addFromLocationType?: number
  addFromLocationList?: string[]
  digitalThreadName?: string
  addFromOGId?: number
  addFromOGType?: number
  addTo?: number
  type?: number
  content?: string
  tagList?: string[]
}

export default {
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.materialId
   * @param {number} data.ogType // ogType及ogId不給時，是帶出該user在該組織及底下所有團隊可看到的digital thread list; 有給值時，只帶出該組織或團隊可看到的
   * @param {number} data.ogId // ogType及ogId不給時，是帶出該user在該組織及底下所有團隊可看到的digital thread list; 有給值時，只帶出該組織或團隊可看到的
   */
  getDigitalThreadList: (data: IData) =>
    axios('/digital-thread/get-list', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadSideId
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
  getDigitalThread: (data: IData) =>
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
  getDigitalThreadMaterial: (data: IData) =>
    axios('/digital-thread/get-material', {
      method: 'POST',
      data,
    }),

  /**
   *
   * @param {object} data
   * @param {number} data.ogId
   * @param {number} data.ogType
   */
  getStickerTagList: (data: IData) =>
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
  createDigitalThread: (data: IData) =>
    axios('/digital-thread/create', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadSideId
   * @param {string} data.digitalThreadName
   */
  updateDigitalThreadName: (data: IData) =>
    axios('/digital-thread/update/digital-thread-name', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadSideId
   * @param {number} data.addTo
   * @param {number} data.type
   * @param {string} data.content
   * @param {string[]} data.tagList
   */
  createSticker: (data: IData) =>
    axios('/digital-thread/sticker/create', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadSideId
   * @param {number} data.stickerId
   * @param {string} data.content
   */
  createChildSticker: (data: IData) =>
    axios('/digital-thread/sticker/child-sticker/create', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadSideId
   * @param {number} data.stickerId
   * @param {string[]} data.tagList
   */
  updateStickerTagList: (data: IData) =>
    axios('/digital-thread/sticker/update/tag', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadSideId
   * @param {number} data.stickerId
   */
  starSticker: (data: IData) =>
    axios('/digital-thread/sticker/star', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadSideId
   * @param {number} data.stickerId
   */
  unstarSticker: (data: IData) =>
    axios('/digital-thread/sticker/unstar', {
      method: 'POST',
      data,
    }),
  /**
   *
   * @param {object} data
   * @param {number} data.orgId
   * @param {number} data.digitalThreadSideId
   * @param {number} data.stickerId
   */
  readChildSticker: (data: IData) =>
    axios('/digital-thread/sticker/read-child-sticker', {
      method: 'POST',
      data,
    }),
}
