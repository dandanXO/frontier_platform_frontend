import axios from '@/apis'

export default {
  getShareReceivedInfo: ({ sharingKey }) => axios('/share/get-received', {
    method: 'POST',
    data: { sharingKey }
  }),
  getShareReceivedList: ({ sharingKey, workspaceNodeId, search = null, filter = null, pagination }) => axios('/share/get-received/get-list', {
    method: 'POST',
    data: { sharingKey, workspaceNodeId, search, filter, pagination }
  }),
  getShareReceivedMaterial: ({ sharingKey, workspaceNodeId }) => axios('/share/get-received/get-material', {
    method: 'POST',
    data: { sharingKey, workspaceNodeId }
  })
}
