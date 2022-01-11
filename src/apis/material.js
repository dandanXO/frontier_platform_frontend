import axios from '@/apis'

export default {
  org: {
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
      upload: ({ orgId, tempMaterialId, file, fileName }) => {
        const formData = new FormData()
        formData.append('orgId', orgId)
        formData.append('tempMaterialId', tempMaterialId)
        formData.append('file', file)
        formData.append('fileName', fileName)

        return axios('/org/assets/material/create/upload-attachment', {
          headers: { 'Content-Type': 'multipart/form-data' },
          method: 'POST',
          data: formData
        })
      },
      remove: ({ orgId, tempMaterialId, tempMaterialAttachmentId }) => axios('/org/assets/material/create/remove-attachment', {
        method: 'POST',
        data: { orgId, tempMaterialId, tempMaterialAttachmentId }
      })
    },
    updateAttachment: {
      upload: ({ orgId, materialId, file, fileName }) => {
        const formData = new FormData()
        formData.append('orgId', orgId)
        formData.append('materialId', materialId)
        formData.append('file', file)
        formData.append('fileName', fileName)

        return axios('/org/assets/material/update/upload-attachment', {
          headers: { 'Content-Type': 'multipart/form-data' },
          method: 'POST',
          data: formData
        })
      },
      remove: ({ orgId, materialId, materialAttachmentId }) => axios('/org/assets/material/update/remove-attachment', {
        method: 'POST',
        data: { orgId, materialId, materialAttachmentId }
      })
    },
    changeCoverImg: {
      do: ({ orgId, materialId, coverMode, materialAttachmentId = null, tempUploadId = null, attachmentCropImgFileName = null }) => axios('/org/assets/material/update/cover-img', {
        method: 'POST',
        data: { orgId, materialId, coverMode, materialAttachmentId, tempUploadId, attachmentCropImgFileName }
      }),
      getUploadUrl: ({ attachmentCropImgFileName }) => axios('/org/assets/material/update/cover-img/get-upload-url', {
        method: 'POST',
        data: { attachmentCropImgFileName }
      })
    },
    updateScannedImage: {
      do: ({ orgId, materialId, isExchange, tempUploadId = null, faceSideCropImgFileName = null, backSideCropImgFileName = null }) => axios('/org/assets/material/update/scan-image', {
        method: 'POST',
        data: { orgId, materialId, isExchange, tempUploadId, faceSideCropImgFileName, backSideCropImgFileName }
      }),
      getUploadUrl: ({ faceSideCropImgFileName, backSideCropImgFileName }) => axios('/org/assets/material/update/scan-image/get-upload-url', {
        method: 'POST',
        data: { faceSideCropImgFileName, backSideCropImgFileName }
      })
    },
    generateU3m: {
      do: ({ orgId, materialId, isAutoRepeat, tempUploadId = null, faceSideCropImgFileName = null, backSideCropImgFileName = null }) => axios('/org/assets/material/update/generate-u3m', {
        method: 'POST',
        data: { orgId, materialId, isAutoRepeat, tempUploadId, faceSideCropImgFileName, backSideCropImgFileName }
      }),
      getUploadUrl: ({ faceSideCropImgFileName, backSideCropImgFileName }) => axios('/org/assets/material/update/generate-u3m/get-upload-url', {
        method: 'POST',
        data: { faceSideCropImgFileName, backSideCropImgFileName }
      })
    }
  },
  group: {
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
      upload: ({ groupId, tempMaterialId, file, fileName }) => {
        const formData = new FormData()
        formData.append('groupId', groupId)
        formData.append('tempMaterialId', tempMaterialId)
        formData.append('file', file)
        formData.append('fileName', fileName)

        return axios('/org/group/assets/material/create/upload-attachment', {
          headers: { 'Content-Type': 'multipart/form-data' },
          method: 'POST',
          data: formData
        })
      },
      remove: ({ groupId, tempMaterialId, tempMaterialAttachmentId }) => axios('/org/group/assets/material/create/remove-attachment', {
        method: 'POST',
        data: { groupId, tempMaterialId, tempMaterialAttachmentId }
      })
    },
    updateAttachment: {
      upload: ({ groupId, materialId, file, fileName }) => {
        const formData = new FormData()
        formData.append('groupId', groupId)
        formData.append('materialId', materialId)
        formData.append('file', file)
        formData.append('fileName', fileName)

        return axios('/org/group/assets/material/update/upload-attachment', {
          headers: { 'Content-Type': 'multipart/form-data' },
          method: 'POST',
          data: formData
        })
      },
      remove: ({ groupId, materialId, materialAttachmentId }) => axios('/org/group/assets/material/update/remove-attachment', {
        method: 'POST',
        data: { groupId, materialId, materialAttachmentId }
      })
    },
    changeCoverImg: {
      do: ({ groupId, materialId, coverMode, materialAttachmentId = null, tempUploadId = null, attachmentCropImgFileName = null }) => axios('/org/group/assets/material/update/cover-img', {
        method: 'POST',
        data: { groupId, materialId, coverMode, materialAttachmentId, tempUploadId, attachmentCropImgFileName }
      }),
      getUploadUrl: ({ attachmentCropImgFileName }) => axios('/org/group/assets/material/update/cover-img/get-upload-url', {
        method: 'POST',
        data: { attachmentCropImgFileName }
      })
    },
    updateScannedImage: {
      do: ({ groupId, materialId, isExchange, tempUploadId = null, faceSideCropImgFileName = null, backSideCropImgFileName = null }) => axios('/org/group/assets/material/update/scan-image', {
        method: 'POST',
        data: { groupId, materialId, isExchange, tempUploadId, faceSideCropImgFileName, backSideCropImgFileName }
      }),
      getUploadUrl: ({ faceSideCropImgFileName, backSideCropImgFileName }) => axios('/org/group/assets/material/update/scan-image/get-upload-url', {
        method: 'POST',
        data: { faceSideCropImgFileName, backSideCropImgFileName }
      })
    },
    generateU3m: {
      do: ({ groupId, materialId, isAutoRepeat, tempUploadId = null, faceSideCropImgFileName = null, backSideCropImgFileName = null }) => axios('/org/group/assets/material/update/generate-u3m', {
        method: 'POST',
        data: { groupId, materialId, isAutoRepeat, tempUploadId, faceSideCropImgFileName, backSideCropImgFileName }
      }),
      getUploadUrl: ({ faceSideCropImgFileName, backSideCropImgFileName }) => axios('/org/group/assets/material/update/generate-u3m/get-upload-url', {
        method: 'POST',
        data: { faceSideCropImgFileName, backSideCropImgFileName }
      })
    }
  }
}
