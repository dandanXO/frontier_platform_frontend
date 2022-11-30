import axios from '@/apis'

export default {
  getPublicList: ({
    workspaceNodeId,
    workspaceNodeLocation,
    search = null,
    filter = null,
    pagination,
  }) =>
    axios('/public/get-list', {
      method: 'POST',
      data: {
        workspaceNodeId,
        workspaceNodeLocation,
        search,
        filter,
        pagination,
      },
    }),
  getPublicMaterial: ({
    orgId,
    workspaceNodeId,
    workspaceNodeLocation,
    keyword,
    rank,
  }) =>
    axios('/public/get-material', {
      method: 'POST',
      data: { orgId, workspaceNodeId, workspaceNodeLocation, keyword, rank },
    }),
  cloneCheck: ({ orgId, workspaceNodeList }) =>
    axios('/public/clone-check', {
      method: 'POST',
      data: { orgId, workspaceNodeList },
    }),
  cloneNode: ({ orgId, workspaceNodeList, targetLocationList, optional }) =>
    axios('/public/clone', {
      method: 'POST',
      data: { orgId, workspaceNodeList, targetLocationList, optional },
    }),
  getShareTarget: ({ workspaceNodeLocation, workspaceNodeId, target }) =>
    axios('/public/share/assigned/get-target', {
      method: 'POST',
      data: { workspaceNodeLocation, workspaceNodeId, target },
    }),
  assignedShare: ({
    orgId,
    workspaceNodeLocation,
    workspaceNodeId,
    targetList,
  }) =>
    axios('/public/share/assigned', {
      method: 'POST',
      data: { orgId, workspaceNodeLocation, workspaceNodeId, targetList },
    }),
  generateCopyLink: ({ workspaceNodeLocation, workspaceNodeId }) =>
    axios('/public/share/copy-link/generate', {
      method: 'POST',
      data: { workspaceNodeLocation, workspaceNodeId },
    }),
  generateSocialMedia: ({ workspaceNodeLocation, workspaceNodeId, type }) =>
    axios('/public/share/social/generate', {
      method: 'POST',
      data: { workspaceNodeLocation, workspaceNodeId, type },
    }),
}
