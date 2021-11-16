import axios from '@/apis'

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
    deleteMaterial: ({ orgId, materialIdList }) => axios('/org/assets/material/delete', {
      method: 'POST',
      data: { orgId, materialIdList }
    }),
    exportMaterial: ({ orgId, materialIdList }) => axios('/org/assets/material/export', {
      method: 'POST',
      data: { orgId, materialIdList }
    })
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
    deleteMaterial: ({ groupId, materialIdList }) => axios('/org/group/assets/material/delete', {
      method: 'POST',
      data: { groupId, materialIdList }
    }),
    exportMaterial: ({ groupId, materialIdList }) => axios('/org/group/assets/material/export', {
      method: 'POST',
      data: { groupId, materialIdList }
    })
  }
}
