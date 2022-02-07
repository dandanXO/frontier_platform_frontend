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
    cloneShareToMe: ({ orgId, workspaceNodeList, targetLocationList }) => axios('/org/share-to-me/clone', {
      method: 'POST',
      data: { orgId, workspaceNodeList, targetLocationList }
    }),
    deleteShareToMe: ({ orgId, workspaceNodeList }) => axios('/org/share-to-me/delete', {
      method: 'POST',
      data: { orgId, workspaceNodeList }
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
    cloneShareToMe: ({ groupId, workspaceNodeList, targetLocationList }) => axios('/org/group/share-to-me/clone', {
      method: 'POST',
      data: { groupId, workspaceNodeList, targetLocationList }
    }),
    deleteShareToMe: ({ groupId, workspaceNodeList }) => axios('/org/group/share-to-me/delete', {
      method: 'POST',
      data: { groupId, workspaceNodeList }
    })
  }
}
