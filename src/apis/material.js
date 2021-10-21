import axios from '@/apis'

export default {
  org: {
    getMaterialOptions: ({ orgId }) => axios('/org/assets/material/options', {
      method: 'POST',
      data: { orgId }
    }),
    createMaterial: ({ orgId, tempMaterialId, material }) => axios('/org/assets/material/create', {
      method: 'POST',
      data: { orgId, tempMaterialId, material }
    })
  },
  group: {
    getMaterialOptions: ({ groupId }) => axios('/org/group/assets/material/options', {
      method: 'POST',
      data: { groupId }
    }),
    createMaterial: ({ groupId, tempMaterialId, material }) => axios('/org/group/assets/material/create', {
      method: 'POST',
      data: { groupId, tempMaterialId, material }
    })
  }
}
