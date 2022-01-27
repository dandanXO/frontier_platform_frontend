import axios from '@/apis'
import putBinaryData from '@/utils/put-binary-data'

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
      upload: async ({ orgId, materialId, file, displayFileName }) => {
        const attachmentFileName = file.name

        const { data: { result: { tempUploadId, attachmentUploadUrl } } } = await axios('/org/group/assets/material/update/upload-attachment/get-upload-url', {
          method: 'POST',
          data: { attachmentFileName }
        })
        await putBinaryData(attachmentUploadUrl, file)

        return axios('/org/group/assets/material/update/upload-attachment', {
          method: 'POST',
          data: { orgId, materialId, tempUploadId, attachmentFileName, displayFileName }
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
