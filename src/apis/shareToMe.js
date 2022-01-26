import axios from '@/apis'

export default {
  org: {
    getShareToMeList: ({ orgId, sharingId, workspaceNodeId, search = null, filter = null, pagination }) => axios('/org/share-to-me/get-list', {
      method: 'POST',
      data: { orgId, sharingId, workspaceNodeId, search, filter, pagination }
    }),
    getShareToMeMaterial: ({ orgId, sharingId, workspaceNodeId }) => axios('/org/share-to-me/get-material', {
      method: 'POST',
      data: { orgId, sharingId, workspaceNodeId }
    }),
    cloneShareToMe: ({ orgId, workspaceNodeIdList, targetLocationList }) => axios('/org/share-to-me/clone', {
      method: 'POST',
      data: { orgId, workspaceNodeIdList, targetLocationList }
    }),
    deleteShareToMe: ({ orgId, sharingIdList }) => axios('/org/share-to-me/delete', {
      method: 'POST',
      data: { orgId, sharingIdList }
    })
  },
  group: {
    getShareToMeList: ({ groupId, sharingId, workspaceNodeId, search = null, filter = null, pagination }) => axios('/org/group/share-to-me/get-list', {
      method: 'POST',
      data: { groupId, sharingId, workspaceNodeId, search, filter, pagination }
    }),
    getShareToMeMaterial: ({ groupId, sharingId, workspaceNodeId }) => axios('/org/group/share-to-me/get-material', {
      method: 'POST',
      data: { groupId, sharingId, workspaceNodeId }
    }),
    cloneShareToMe: ({ groupId, workspaceNodeIdList, targetLocationList }) => axios('/org/group/share-to-me/clone', {
      method: 'POST',
      data: { groupId, workspaceNodeIdList, targetLocationList }
    }),
    deleteShareToMe: ({ groupId, sharingIdList }) => axios('/org/group/share-to-me/delete', {
      method: 'POST',
      data: { groupId, sharingIdList }
    })
  }
}
