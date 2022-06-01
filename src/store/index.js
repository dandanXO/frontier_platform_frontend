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

export default createStore({
  actions: {
    async uploadFileToS3 (_, { fileName, file }) {
      const { data: { result: { tempUploadId, fileUploadUrl } } } = await axios('/general/get-upload-url', {
        method: 'POST',
        data: { fileName }
      })
      await putBinaryData(fileUploadUrl, file)
      return { fileName, tempUploadId }
    },
    handleResponseData ({ dispatch }, { data }) {
      const { result } = JSON.parse(JSON.stringify(data))

      const namespacedParentModuleList = ['user', 'organization', 'code', 'group']

      if (result !== null) {
        namespacedParentModuleList.forEach(module => {
          if (Object.prototype.hasOwnProperty.call(result, module)) {
            const capitalizedModule = module.charAt(0).toUpperCase() + module.slice(1)
            dispatch(`${module}/set${capitalizedModule}`, result[module], { root: true })
          }
        })
        if (Object.prototype.hasOwnProperty.call(result, 'pagination')) {
          dispatch('helper/search/setPagination', result.pagination, { root: true })
        }
      }
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
    moodboard
  }
})
