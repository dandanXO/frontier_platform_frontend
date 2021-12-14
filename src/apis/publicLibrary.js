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
  })
}
