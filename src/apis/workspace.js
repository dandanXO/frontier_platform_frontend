import axios from '@/apis'

export default {
  org: {
    getWorkspace: ({ orgId, workspaceNodeId, pagination, search = null, filter = null }) => axios('/org/workspace/get', {
      method: 'POST',
      data: { orgId, workspaceNodeId, pagination, search, filter }
    }),
    getWorkspaceForModal: ({ orgId, pagination, search = null, workspaceNodeId, workspaceNodeLocation }) => axios('/org/workspace/get-for-modal', {
      method: 'POST',
      data: { orgId, pagination, search, workspaceNodeId, workspaceNodeLocation }
    }),
    getCollection: ({ orgId, workspaceNodeId }) => axios('/org/workspace/get', {
      method: 'POST',
      data: { orgId, workspaceNodeId, search: null, filter: null, pagination: { perPageCount: 40, targetPage: 1 } }
    }),
    getWorkspaceMaterial: ({ orgId, workspaceNodeId }) => axios('/org/workspace/get-material', {
      method: 'POST',
      data: { orgId, workspaceNodeId }
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
    },
    updateCollection: ({ orgId, collectionId, collectionName, trendBoard = null, description = null }) => {
      const formData = new FormData()
      formData.append('orgId', orgId)
      formData.append('collectionId', collectionId)
      formData.append('collectionName', collectionName)
      !!trendBoard && formData.append('trendBoard', trendBoard)
      !!description && formData.append('description', description)

      return axios('/org/workspace/collection/update', {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'POST',
        data: formData
      })
    },
    removeTrendBoard: ({ orgId, collectionId }) => axios('/org/workspace/collection/remove-trend-board', {
      method: 'POST',
      data: { orgId, collectionId }
    }),
    duplicateNode: ({ orgId, workspaceNodeId, targetWorkspaceNodeList }) => axios('/org/workspace/node/duplicate', {
      method: 'POST',
      data: { orgId, workspaceNodeId, targetWorkspaceNodeList }
    }),
    moveNode: ({ orgId, workspaceNodeId, targetWorkspaceNodeId }) => axios('/org/workspace/node/move', {
      method: 'POST',
      data: { orgId, workspaceNodeId, targetWorkspaceNodeId }
    }),
    deleteNode: ({ orgId, workspaceNodeIdList }) => axios('/org/workspace/node/delete', {
      method: 'POST',
      data: { orgId, workspaceNodeIdList }
    }),
    publishNode: ({ orgId, workspaceNodeId, isPublic, isCanClone, isCanDownloadU3M }) => axios('/org/workspace/node/publish', {
      method: 'POST',
      data: { orgId, workspaceNodeId, isPublic, isCanClone, isCanDownloadU3M }
    }),
    getShareInfo: ({ orgId, workspaceNodeId }) => axios('/org/workspace/node/share/get', {
      method: 'POST',
      data: { orgId, workspaceNodeId }
    }),
    getShareTarget: ({ orgId, workspaceNodeId, target }) => axios('/org/workspace/node/share/assigned/get-target', {
      method: 'POST',
      data: { orgId, workspaceNodeId, target }
    }),
    assignedShare: ({ orgId, workspaceNodeId, targetList, isCanClone, isCanDownloadU3M, messages }) => axios('/org/workspace/node/share/assigned', {
      method: 'POST',
      data: { orgId, workspaceNodeId, targetList, isCanClone, isCanDownloadU3M, messages }
    }),
    updatedAssignedShare: ({ orgId, workspaceNodeId, type, id, isCanClone, isCanDownloadU3M }) => axios('/org/workspace/node/share/assigned/update', {
      method: 'POST',
      data: { orgId, workspaceNodeId, type, id, isCanClone, isCanDownloadU3M }
    }),
    removeAssignedShare: ({ orgId, workspaceNodeId, type, id }) => axios('/org/workspace/node/share/assigned/remove', {
      method: 'POST',
      data: { orgId, workspaceNodeId, type, id }
    }),
    toggleCopyLink: ({ orgId, workspaceNodeId, isCanShared }) => axios('/org/workspace/node/share/copy-link/update-setting', {
      method: 'POST',
      data: { orgId, workspaceNodeId, isCanShared }
    }),
    generateCopyLink: ({ orgId, workspaceNodeId }) => axios('/org/workspace/node/share/copy-link/generate', {
      method: 'POST',
      data: { orgId, workspaceNodeId }
    })
  },
  group: {
    getWorkspace: ({ groupId, workspaceNodeId, pagination, search = null, filter = null }) => axios('/org/group/workspace/get', {
      method: 'POST',
      data: { groupId, workspaceNodeId, pagination, search, filter }
    }),
    getWorkspaceForModal: ({ groupId, pagination, search = null, workspaceNodeId }) => axios('/org/group/workspace/get-for-modal', {
      method: 'POST',
      data: { groupId, pagination, search, workspaceNodeId }
    }),
    getCollection: ({ groupId, workspaceNodeId }) => axios('/org/group/workspace/get', {
      method: 'POST',
      data: { groupId, workspaceNodeId, search: null, filter: null, pagination: { perPageCount: 40, targetPage: 1 } }
    }),
    getWorkspaceMaterial: ({ groupId, workspaceNodeId }) => axios('/org/group/workspace/get-material', {
      method: 'POST',
      data: { groupId, workspaceNodeId }
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
    },
    updateCollection: ({ groupId, collectionId, collectionName, trendBoard = null, description = null }) => {
      const formData = new FormData()
      formData.append('groupId', groupId)
      formData.append('collectionId', collectionId)
      formData.append('collectionName', collectionName)
      !!trendBoard && formData.append('trendBoard', trendBoard)
      !!description && formData.append('description', description)

      return axios('/org/group/workspace/collection/update', {
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'POST',
        data: formData
      })
    },
    removeTrendBoard: ({ groupId, collectionId }) => axios('/org/group/workspace/collection/remove-trend-board', {
      method: 'POST',
      data: { groupId, collectionId }
    }),
    duplicateNode: ({ groupId, workspaceNodeId, targetWorkspaceNodeList }) => axios('/org/group/workspace/node/duplicate', {
      method: 'POST',
      data: { groupId, workspaceNodeId, targetWorkspaceNodeList }
    }),
    moveNode: ({ groupId, workspaceNodeId, targetWorkspaceNodeId }) => axios('/org/group/workspace/node/move', {
      method: 'POST',
      data: { groupId, workspaceNodeId, targetWorkspaceNodeId }
    }),
    deleteNode: ({ groupId, workspaceNodeIdList }) => axios('/org/group/workspace/node/delete', {
      method: 'POST',
      data: { groupId, workspaceNodeIdList }
    }),
    publishNode: ({ groupId, workspaceNodeId, isPublic, isCanClone, isCanDownloadU3M }) => axios('/org/group/workspace/node/publish', {
      method: 'POST',
      data: { groupId, workspaceNodeId, isPublic, isCanClone, isCanDownloadU3M }
    }),
    getShareInfo: ({ groupId, workspaceNodeId }) => axios('/org/group/workspace/node/share/get', {
      method: 'POST',
      data: { groupId, workspaceNodeId }
    }),
    getShareTarget: ({ groupId, workspaceNodeId, target }) => axios('/org/group/workspace/node/share/assigned/get-target', {
      method: 'POST',
      data: { groupId, workspaceNodeId, target }
    }),
    assignedShare: ({ groupId, workspaceNodeId, targetList, isCanClone, isCanDownloadU3M, messages }) => axios('/org/group/workspace/node/share/assigned', {
      method: 'POST',
      data: { groupId, workspaceNodeId, targetList, isCanClone, isCanDownloadU3M, messages }
    }),
    updatedAssignedShare: ({ groupId, workspaceNodeId, type, id, isCanClone, isCanDownloadU3M }) => axios('/org/group/workspace/node/share/assigned/update', {
      method: 'POST',
      data: { groupId, workspaceNodeId, type, id, isCanClone, isCanDownloadU3M }
    }),
    removeAssignedShare: ({ groupId, workspaceNodeId, type, id }) => axios('/org/group/workspace/node/share/assigned/remove', {
      method: 'POST',
      data: { groupId, workspaceNodeId, type, id }
    }),
    toggleCopyLink: ({ group, workspaceNodeId, isCanShared }) => axios('/org/group/workspace/node/share/copy-link/update-setting', {
      method: 'POST',
      data: { group, workspaceNodeId, isCanShared }
    }),
    generateCopyLink: ({ group, workspaceNodeId }) => axios('/org/group/workspace/node/share/copy-link/generate', {
      method: 'POST',
      data: { group, workspaceNodeId }
    })
  }
}
