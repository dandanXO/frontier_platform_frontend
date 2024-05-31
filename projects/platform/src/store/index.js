import { createStore } from 'vuex'
import axios from '@/apis'
import { putBinaryData } from '@/utils/fileUpload'
import user from '@/store/modules/user'
import code from '@/store/modules/code'
import organization from '@/store/modules/management/organization'
import group from '@/store/modules/management/group'
import helper from '@/store/modules/helper'
import assets from '@/store/modules/assets'
import polling from '@/store/modules/polling'
import sticker from '@/store/modules/sticker'
import permission from '@/store/modules/permission'

export default createStore({
  actions: {
    trackError({ rootGetters }, payload) {
      axios('/system/send-error-message', {
        method: 'POST',
        data: {
          orgId: rootGetters['organization/orgId'] ?? null,
          ogType: rootGetters['helper/routeLocation'] === 'org' ? 1 : 2,
          ogId: rootGetters['helper/routeLocationId'] ?? null,
          ...payload,
        },
      })
    },
    async getUploadUrl(_, { fileName }) {
      const { data } = await axios('/general/get-upload-url', {
        method: 'POST',
        data: { fileName },
      })
      return data.result
    },
    async uploadFileToS3({ dispatch }, { fileName, file }) {
      const { tempUploadId, fileUploadUrl } = await dispatch('getUploadUrl', {
        fileName,
      })
      await putBinaryData(fileUploadUrl, file)
      return { fileName, tempUploadId }
    },
    async checkTokenStatus(_, { accessToken }) {
      const {
        data: {
          result: { status },
        },
      } = await axios('/general/check-token-status', {
        method: 'POST',
        data: { accessToken },
      })
      return status
    },
  },
  modules: {
    code,
    user,
    organization,
    group,
    helper,
    assets,
    polling,
    sticker,
    permission,
  },
})
