import { apiWrapper } from '@/apis'

export default {
  getChannelList: (type, id, params) =>
    apiWrapper('/sticker-board/channel/get', type, id, params),

  /**
   * @param {object} params
   * @param {number} params.sourceChannelId
   * @param {number} params.targetChannelId
   * @param {boolean} params.willInsertAfter - true if will element be inserted after target (or false if before)
   */
  changeChannelPosition: (type, id, params) =>
    apiWrapper('/sticker-board/channel/change-position', type, id, params),
}
