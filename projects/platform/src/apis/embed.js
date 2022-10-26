import axios from '@/apis'

export default {
  getEmbedInfo: ({ sharingKey }) =>
    axios('/share/get-embed', {
      method: 'POST',
      data: { sharingKey },
    }),
  getEmbedList: ({
    sharingKey,
    workspaceNodeId,
    search = null,
    filter = null,
    pagination,
  }) =>
    axios('/share/get-embed/get-list', {
      method: 'POST',
      data: { sharingKey, workspaceNodeId, search, filter, pagination },
    }),
  getEmbedMaterial: ({ sharingKey, workspaceNodeId }) =>
    axios('/share/get-embed/get-material', {
      method: 'POST',
      data: { sharingKey, workspaceNodeId },
    }),
}
