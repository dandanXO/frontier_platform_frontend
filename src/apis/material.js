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
    changeCoverImg: ({ orgId, materialId, coverMode, materialAttachmentId = null, attachmentCropImg = null }) => {
      const formData = new FormData()
      formData.append('orgId', orgId)
      formData.append('materialId', materialId)
      formData.append('coverMode', coverMode)
      !!materialAttachmentId && formData.append('materialAttachmentId', materialAttachmentId)
      !!attachmentCropImg && formData.append('attachmentCropImg', attachmentCropImg)

      return axios('/org/assets/material/update/cover-img', {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'POST',
        data: formData
      })
    }
  },
  group: {
    getMaterialOptions: ({ groupId }) => axios('/org/group/assets/material/options', {
      method: 'POST',
      data: { groupId }
    }),
    getMaterial: ({ orgId, materialId }) => axios('/org/group/assets/material/get', {
      method: 'POST',
      data: { orgId, materialId }
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
    changeCoverImg: ({ groupId, materialId, coverMode, materialAttachmentId = null, attachmentCropImg = null }) => {
      const formData = new FormData()
      formData.append('groupId', groupId)
      formData.append('materialId', materialId)
      formData.append('coverMode', coverMode)
      !!materialAttachmentId && formData.append('materialAttachmentId', materialAttachmentId)
      !!attachmentCropImg && formData.append('attachmentCropImg', attachmentCropImg)

      return axios('/org/group/assets/material/update/cover-img', {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'POST',
        data: formData
      })
    }
  }
}
