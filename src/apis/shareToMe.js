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
    cloneCheckShareToMe: ({ orgId, workspaceNodeList }) => axios('/org/share-to-me/clone-check', {
      method: 'POST',
      data: { orgId, workspaceNodeList }
    }),
    cloneShareToMe: ({ orgId, workspaceNodeList, targetLocationList, optional }) => axios('/org/share-to-me/clone', {
      method: 'POST',
      data: { orgId, workspaceNodeList, targetLocationList, optional }
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
    cloneCheckShareToMe: ({ groupId, workspaceNodeList }) => axios('/org/group/share-to-me/clone-check', {
      method: 'POST',
      data: { groupId, workspaceNodeList }
    }),
    cloneShareToMe: ({ groupId, workspaceNodeList, targetLocationList, optional }) => axios('/org/group/share-to-me/clone', {
      method: 'POST',
      data: { groupId, workspaceNodeList, targetLocationList, optional }
    }),
    deleteShareToMe: ({ groupId, workspaceNodeList }) => axios('/org/group/share-to-me/delete', {
      method: 'POST',
      data: { groupId, workspaceNodeList }
    })
  }
}
