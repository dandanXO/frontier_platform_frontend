import axios from '@/apis'

export default {
  getPublicList: ({ workspaceNodeId, workspaceNodeLocation, search = null, filter = null, pagination }) => axios('/public/get-list', {
    method: 'POST',
    data: { workspaceNodeId, workspaceNodeLocation, search, filter, pagination }
  }),
  getPublicMaterial: ({ workspaceNodeId, workspaceNodeLocation }) => axios('/public/get-material', {
    method: 'POST',
    data: { workspaceNodeId, workspaceNodeLocation }
  }),
  cloneNode: ({ workspaceNodeList, targetLocationList }) => axios('/public/clone', {
    method: 'POST',
    data: { workspaceNodeList, targetLocationList }
  }),
  getShareTarget: ({ workspaceNodeLocation, workspaceNodeId, target }) => axios('/public/share/assigned/get-target', {
    method: 'POST',
    data: { workspaceNodeLocation, workspaceNodeId, target }
  }),
  assignedShare: ({ orgId, workspaceNodeLocation, workspaceNodeId, targetList }) => axios('/public/share/assigned', {
    method: 'POST',
    data: { orgId, workspaceNodeLocation, workspaceNodeId, targetList }
  }),
  generateCopyLink: ({ workspaceNodeLocation, workspaceNodeId }) => axios('/public/share/copy-link/generate', {
    method: 'POST',
    data: { workspaceNodeLocation, workspaceNodeId }
  })
}
