import axios from '@/apis'

export default {
  org: {
    getMaterialList: ({ orgId, pagination, search = null, filter = null }) => axios('/org/assets/material/get-list', {
      method: 'POST',
      data: { orgId, pagination, search, filter }
    })
  },
  group: {
    getMaterialList: ({ groupId, pagination, search = null, filter = null }) => axios('/org/group/assets/material/get-list', {
      method: 'POST',
      data: { groupId, pagination, search, filter }
    })
  }
}
