import axios from '@/apis'

export default {
  org: {
    getWorkspace: ({ orgId, workspaceNodeId, pagination, search = null, filter = null }) => axios('/org/workspace/get', {
      method: 'POST',
      data: { orgId, workspaceNodeId, pagination, search, filter }
    }),
    getWorkspaceForModal: ({ orgId, pagination, search = null, workspaceNodeId, type }) => axios('/org/workspace/get-for-modal', {
      method: 'POST',
      data: { orgId, pagination, search, workspaceNodeId, type }
    }),
    createCollection: ({ orgId, workspaceNodeId, collectionName, trendBoard = null, description = null }) => {
      const formData = new FormData()
      formData.append('orgId', orgId)
      formData.append('workspaceNodeId', workspaceNodeId)
      formData.append('collectionName', collectionName)
      !!trendBoard && formData.append('trendBoard', trendBoard)
      !!description && formData.append('description', description)

      return axios('/org/workspace/collection/create', {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'POST',
        data: formData
      })
    }
  },
  group: {
    getWorkspace: ({ groupId, workspaceNodeId, pagination, search = null, filter = null }) => axios('/org/group/workspace/get', {
      method: 'POST',
      data: { groupId, workspaceNodeId, pagination, search, filter }
    }),
    getWorkspaceForModal: ({ groupId, pagination, search = null, workspaceNodeId, type }) => axios('/org/group/workspace/get-for-modal', {
      method: 'POST',
      data: { groupId, pagination, search, workspaceNodeId, type }
    }),
    createCollection: ({ groupId, workspaceNodeId, collectionName, trendBoard = null, description = null }) => {
      const formData = new FormData()
      formData.append('groupId', groupId)
      formData.append('workspaceNodeId', workspaceNodeId)
      formData.append('collectionName', collectionName)
      !!trendBoard && formData.append('trendBoard', trendBoard)
      !!description && formData.append('description', description)

      return axios('/org/group/workspace/collection/create', {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'POST',
        data: formData
      })
    }
  }
}
