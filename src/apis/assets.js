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
    },
    getMaterialOptions: ({ orgId }) => axios('/org/assets/material/options', {
      method: 'POST',
      data: { orgId }
    }),
    getMaterial: ({ orgId, materialId }) => axios('/org/assets/material/get', {
      method: 'POST',
      data: { orgId, materialId }
    }),
    createMaterial: ({ orgId, tempMaterialId, material }) => axios('/org/assets/material/create', {
      method: 'POST',
      data: { orgId, tempMaterialId, material }
    }),
    updateMaterial: ({ orgId, materialId, material }) => axios('/org/assets/material/update', {
      method: 'POST',
      data: { orgId, materialId, material }
    }),
    addPantone: ({ orgId, materialId, name }) => axios('/org/assets/material/update/add-pantone', {
      method: 'POST',
      data: { orgId, materialId, name }
    }),
    removePantone: ({ orgId, materialId, materialPantoneId }) => axios('/org/assets/material/update/remove-pantone', {
      method: 'POST',
      data: { orgId, materialId, materialPantoneId }
    }),
    createAttachment: {
      upload: async ({ orgId, tempMaterialId, file, displayFileName }) => {
        const attachmentFileName = file.name

        const { data: { result: { tempUploadId, attachmentUploadUrl } } } = await axios('/org/assets/material/create/upload-attachment/get-upload-url', {
          method: 'POST',
          data: { attachmentFileName }
        })
        await putBinaryData(attachmentUploadUrl, file)

        return axios('/org/assets/material/create/upload-attachment', {
          method: 'POST',
          data: { orgId, tempMaterialId, tempUploadId, attachmentFileName, displayFileName }
        })
      },
      remove: ({ orgId, tempMaterialId, tempMaterialAttachmentId }) => axios('/org/assets/material/create/remove-attachment', {
        method: 'POST',
        data: { orgId, tempMaterialId, tempMaterialAttachmentId }
      })
    },
    updateAttachment: {
      upload: async ({ orgId, materialId, file, displayFileName }) => {
        const attachmentFileName = file.name

        const { data: { result: { tempUploadId, attachmentUploadUrl } } } = await axios('/org/assets/material/update/upload-attachment/get-upload-url', {
          method: 'POST',
          data: { attachmentFileName }
        })
        await putBinaryData(attachmentUploadUrl, file)

        return axios('/org/assets/material/update/upload-attachment', {
          method: 'POST',
          data: { orgId, materialId, tempUploadId, attachmentFileName, displayFileName }
        })
      },
      remove: ({ orgId, materialId, materialAttachmentId }) => axios('/org/assets/material/update/remove-attachment', {
        method: 'POST',
        data: { orgId, materialId, materialAttachmentId }
      })
    },
    changeCoverImg: async ({ orgId, materialId, coverMode, materialAttachmentId = null, attachmentCropImg = null }) => {
      const attachmentCropImgFileName = attachmentCropImg?.name || null
      let id = null

      if (attachmentCropImg) {
        const { data: { result: { tempUploadId, attachmentCropImgUploadUrl } } } = await axios('/org/assets/material/update/cover-img/get-upload-url', {
          method: 'POST',
          data: { attachmentCropImgFileName }
        })

        id = tempUploadId
        await putBinaryData(attachmentCropImgUploadUrl, attachmentCropImg)
      }

      return axios('/org/assets/material/update/cover-img', {
        method: 'POST',
        data: { orgId, materialId, coverMode, materialAttachmentId, tempUploadId: id, attachmentCropImgFileName }
      })
    },
    updateScannedImage: async ({ orgId, materialId, isExchange, faceSideCropImg, backSideCropImg }) => {
      const faceSideCropImgFileName = faceSideCropImg?.name || null
      const backSideCropImgFileName = backSideCropImg?.name || null
      let id = null

      if (faceSideCropImg || backSideCropImg) {
        const { data: { result: { tempUploadId, faceSideCropImgUploadUrl, backSideCropImgUploadUrl } } } = await axios('/org/assets/material/update/scan-image/get-upload-url', {
          method: 'POST',
          data: { faceSideCropImgFileName, backSideCropImgFileName }
        })

        id = tempUploadId
        await putBinaryData(faceSideCropImgUploadUrl, faceSideCropImg)
        await putBinaryData(backSideCropImgUploadUrl, backSideCropImg)
      }

      return axios('/org/assets/material/update/scan-image', {
        method: 'POST',
        data: { orgId, materialId, isExchange, tempUploadId: id, faceSideCropImgFileName, backSideCropImgFileName }
      })
    },
    generateU3m: async ({ orgId, materialId, isAutoRepeat, faceSideCropImg, backSideCropImg }) => {
      const faceSideCropImgFileName = faceSideCropImg?.name || null
      const backSideCropImgFileName = backSideCropImg?.name || null
      let id = null

      if (faceSideCropImg || backSideCropImg) {
        const { data: { result: { tempUploadId, faceSideCropImgUploadUrl, backSideCropImgUploadUrl } } } = await axios('/org/assets/material/update/generate-u3m/get-upload-url', {
          method: 'POST',
          data: { faceSideCropImgFileName, backSideCropImgFileName }
        })

        id = tempUploadId
        await putBinaryData(faceSideCropImgUploadUrl, faceSideCropImg)
        await putBinaryData(backSideCropImgUploadUrl, backSideCropImg)
      }

      return axios('/org/assets/material/update/generate-u3m', {
        method: 'POST',
        data: { orgId, materialId, isAutoRepeat, tempUploadId: id, faceSideCropImgFileName, backSideCropImgFileName }
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
    },
    getMaterialOptions: ({ groupId }) => axios('/org/group/assets/material/options', {
      method: 'POST',
      data: { groupId }
    }),
    getMaterial: ({ groupId, materialId }) => axios('/org/group/assets/material/get', {
      method: 'POST',
      data: { groupId, materialId }
    }),
    createMaterial: ({ groupId, tempMaterialId, material }) => axios('/org/group/assets/material/create', {
      method: 'POST',
      data: { groupId, tempMaterialId, material }
    }),
    updateMaterial: ({ groupId, materialId, material }) => axios('/org/group/assets/material/update', {
      method: 'POST',
      data: { groupId, materialId, material }
    }),
    addPantone: ({ groupId, materialId, name }) => axios('/org/group/assets/material/update/add-pantone', {
      method: 'POST',
      data: { groupId, materialId, name }
    }),
    removePantone: ({ groupId, materialId, materialPantoneId }) => axios('/org/group/assets/material/update/remove-pantone', {
      method: 'POST',
      data: { groupId, materialId, materialPantoneId }
    }),
    createAttachment: {
      upload: async ({ orgId, tempMaterialId, file, displayFileName }) => {
        const attachmentFileName = file.name

        const { data: { result: { tempUploadId, attachmentUploadUrl } } } = await axios('/org/group/assets/material/create/upload-attachment/get-upload-url', {
          method: 'POST',
          data: { attachmentFileName }
        })
        await putBinaryData(attachmentUploadUrl, file)

        return axios('/org/group/assets/material/create/upload-attachment', {
          method: 'POST',
          data: { orgId, tempMaterialId, tempUploadId, attachmentFileName, displayFileName }
        })
      },
      remove: ({ groupId, tempMaterialId, tempMaterialAttachmentId }) => axios('/org/group/assets/material/create/remove-attachment', {
        method: 'POST',
        data: { groupId, tempMaterialId, tempMaterialAttachmentId }
      })
    },
    updateAttachment: {
      upload: async ({ groupId, materialId, file, displayFileName }) => {
        const attachmentFileName = file.name

        const { data: { result: { tempUploadId, attachmentUploadUrl } } } = await axios('/org/group/assets/material/update/upload-attachment/get-upload-url', {
          method: 'POST',
          data: { attachmentFileName }
        })
        await putBinaryData(attachmentUploadUrl, file)

        return axios('/org/group/assets/material/update/upload-attachment', {
          method: 'POST',
          data: { groupId, materialId, tempUploadId, attachmentFileName, displayFileName }
        })
      },
      remove: ({ groupId, materialId, materialAttachmentId }) => axios('/org/group/assets/material/update/remove-attachment', {
        method: 'POST',
        data: { groupId, materialId, materialAttachmentId }
      })
    },
    changeCoverImg: async ({ groupId, materialId, coverMode, materialAttachmentId = null, attachmentCropImg = null }) => {
      const attachmentCropImgFileName = attachmentCropImg?.name || null
      let id = null

      if (attachmentCropImg) {
        const { data: { result: { tempUploadId, attachmentCropImgUploadUrl } } } = await axios('/org/group/assets/material/update/cover-img/get-upload-url', {
          method: 'POST',
          data: { attachmentCropImgFileName }
        })

        id = tempUploadId
        await putBinaryData(attachmentCropImgUploadUrl, attachmentCropImg)
      }

      return axios('/org/group/assets/material/update/cover-img', {
        method: 'POST',
        data: { groupId, materialId, coverMode, materialAttachmentId, tempUploadId: id, attachmentCropImgFileName }
      })
    },
    updateScannedImage: async ({ groupId, materialId, isExchange, faceSideCropImg, backSideCropImg }) => {
      const faceSideCropImgFileName = faceSideCropImg?.name || null
      const backSideCropImgFileName = backSideCropImg?.name || null
      let id = null

      if (faceSideCropImg || backSideCropImg) {
        const { data: { result: { tempUploadId, faceSideCropImgUploadUrl, backSideCropImgUploadUrl } } } = await axios('/org/group/assets/material/update/scan-image/get-upload-url', {
          method: 'POST',
          data: { faceSideCropImgFileName, backSideCropImgFileName }
        })

        id = tempUploadId
        await putBinaryData(faceSideCropImgUploadUrl, faceSideCropImg)
        await putBinaryData(backSideCropImgUploadUrl, backSideCropImg)
      }

      return axios('/org/group/assets/material/update/scan-image', {
        method: 'POST',
        data: { groupId, materialId, isExchange, tempUploadId: id, faceSideCropImgFileName, backSideCropImgFileName }
      })
    },
    generateU3m: async ({ groupId, materialId, isAutoRepeat, faceSideCropImg, backSideCropImg }) => {
      const faceSideCropImgFileName = faceSideCropImg?.name || null
      const backSideCropImgFileName = backSideCropImg?.name || null
      let id = null

      if (faceSideCropImg || backSideCropImg) {
        const { data: { result: { tempUploadId, faceSideCropImgUploadUrl, backSideCropImgUploadUrl } } } = await axios('/org/group/assets/material/update/generate-u3m/get-upload-url', {
          method: 'POST',
          data: { faceSideCropImgFileName, backSideCropImgFileName }
        })

        id = tempUploadId
        await putBinaryData(faceSideCropImgUploadUrl, faceSideCropImg)
        await putBinaryData(backSideCropImgUploadUrl, backSideCropImg)
      }

      return axios('/org/group/assets/material/update/generate-u3m', {
        method: 'POST',
        data: { groupId, materialId, isAutoRepeat, tempUploadId: id, faceSideCropImgFileName, backSideCropImgFileName }
      })
    }
  }
}
