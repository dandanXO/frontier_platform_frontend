import { createStore } from 'vuex'
import axios from '@/apis'
import putBinaryData from '@/utils/put-binary-data'
import user from '@/store/modules/user'
import code from '@/store/modules/code'
import organization from '@/store/modules/management/organization'
import group from '@/store/modules/management/group'
import helper from '@/store/modules/helper'
import assets from '@/store/modules/assets'
import workspace from '@/store/modules/workspace'
import publicLibrary from '@/store/modules/publicLibrary'
import receivedShare from '@/store/modules/receivedShare'
import embed from '@/store/modules/embed'
import moodboard from '@/store/modules/moodboard'
import shareToMe from '@/store/modules/shareToMe'
import polling from '@/store/modules/polling'
import titas from '@/store/modules/titas'

export default createStore({
  actions: {
    async getUploadUrl (_, { fileName }) {
      const { data } = await axios('/general/get-upload-url', {
        method: 'POST',
        data: { fileName }
      })
      return data.result
    },
    async uploadFileToS3 ({ dispatch }, { fileName, file }) {
      const { tempUploadId, fileUploadUrl } = await dispatch('getUploadUrl', { fileName })
      await putBinaryData(fileUploadUrl, file)
      return { fileName, tempUploadId }
    },
    async checkTokenStatus (_, { accessToken }) {
      const { data: { result: { status } } } = await axios('/general/check-token-status', {
        method: 'POST',
        data: { accessToken }
      })
      return status
    }
  },
  modules: {
    code,
    user,
    organization,
    group,
    helper,
    assets,
    workspace,
    publicLibrary,
    receivedShare,
    shareToMe,
    embed,
    polling,
    moodboard,
    titas
  }
})
