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
    })
  }
}
