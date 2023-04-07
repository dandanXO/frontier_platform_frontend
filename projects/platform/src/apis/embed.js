import axios from '@/apis'

export default {
  getEmbedInfo: ({ sharingKey }) =>
    axios('/share/get-embed', {
      method: 'POST',
      data: { sharingKey },
    }),
  getEmbedList: ({
    orgId,
    sharingKey,
    workspaceNodeId,
    search = null,
    filter = null,
    pagination,
  }) =>
    axios('/share/get-embed/get-list', {
      method: 'POST',
      data: { orgId, sharingKey, workspaceNodeId, search, filter, pagination },
    }),
  getEmbedMaterial: ({ orgId, sharingKey, workspaceNodeId, keyword, rank }) =>
    axios('/share/get-embed/get-material', {
      method: 'POST',
      data: { orgId, sharingKey, workspaceNodeId, keyword, rank },
    }),
}
