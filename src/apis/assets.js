import axios from '@/apis'
import putBinaryData from '@/utils/put-binary-data'

export default {
  org: {
    getMaterialList: ({ orgId, pagination, search = null, filter = null }) => axios('/org/assets/material/get-list', {
      method: 'POST',
      data: { orgId, pagination, search, filter }
    }),
    mergeMaterial: ({ orgId, mergedList }) => axios('/org/assets/material/merge', {
      method: 'POST',
      data: { orgId, mergedList }
    }),
    carbonCopyMaterial: ({ orgId, materialId }) => axios('/org/assets/material/carbon-copy', {
      method: 'POST',
      data: { orgId, materialId }
    }),
    deleteMaterial: ({ orgId, materialIdList }) => axios('/org/assets/material/delete', {
      method: 'POST',
      data: { orgId, materialIdList }
    }),
    exportMaterial: ({ orgId, materialIdList }) => axios('/org/assets/material/export', {
      method: 'POST',
      data: { orgId, materialIdList }
    }),
    cloneMaterial: ({ orgId, materialIdList, targetLocationList }) => axios('/org/assets/material/clone', {
      method: 'POST',
      data: { orgId, materialIdList, targetLocationList }
    }),
    addToWorkspace: ({ orgId, materialIdList, targetWorkspaceNodeList }) => axios('/org/assets/material/add-to-workspace', {
      method: 'POST',
      data: { orgId, materialIdList, targetWorkspaceNodeList }
    }),
    batchUpload: async ({ orgId, xlsxFile }) => {
      const xlsxFileName = xlsxFile.name
      const { data: { result: { tempUploadId, xlsxFileUploadUrl } } } = await axios('/org/assets/material/batch-upload/get-upload-url', {
        method: 'POST',
        data: { xlsxFileName }
      })
      await putBinaryData(xlsxFileUploadUrl, xlsxFile)

      return axios('/org/assets/material/batch-upload', {
        method: 'POST',
        data: { orgId, xlsxFileName, tempUploadId }
      })
    }
  },
  group: {
    getMaterialList: ({ groupId, pagination, search = null, filter = null }) => axios('/org/group/assets/material/get-list', {
      method: 'POST',
      data: { groupId, pagination, search, filter }
    }),
    mergeMaterial: ({ groupId, mergedList }) => axios('/org/group/assets/material/merge', {
      method: 'POST',
      data: { groupId, mergedList }
    }),
    carbonCopyMaterial: ({ groupId, materialId }) => axios('/org/group/assets/material/carbon-copy', {
      method: 'POST',
      data: { groupId, materialId }
    }),
    deleteMaterial: ({ groupId, materialIdList }) => axios('/org/group/assets/material/delete', {
      method: 'POST',
      data: { groupId, materialIdList }
    }),
    exportMaterial: ({ groupId, materialIdList }) => axios('/org/group/assets/material/export', {
      method: 'POST',
      data: { groupId, materialIdList }
    }),
    cloneMaterial: ({ groupId, materialIdList, targetLocationList }) => axios('/org/group/assets/material/clone', {
      method: 'POST',
      data: { groupId, materialIdList, targetLocationList }
    }),
    addToWorkspace: ({ groupId, materialIdList, targetWorkspaceNodeList }) => axios('/org/group/assets/material/add-to-workspace', {
      method: 'POST',
      data: { groupId, materialIdList, targetWorkspaceNodeList }
    }),
    batchUpload: async ({ groupId, xlsxFile }) => {
      const xlsxFileName = xlsxFile.name
      const { data: { result: { tempUploadId, xlsxFileUploadUrl } } } = await axios('/org/group/assets/material/batch-upload/get-upload-url', {
        method: 'POST',
        data: { xlsxFileName }
      })
      await putBinaryData(xlsxFileUploadUrl, xlsxFile)

      return axios('/org/group/assets/material/batch-upload', {
        method: 'POST',
        data: { groupId, xlsxFileName, tempUploadId }
      })
    }
  }
}
