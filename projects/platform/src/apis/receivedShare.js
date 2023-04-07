import axios from '@/apis'

export default {
  getShareReceivedInfo: ({ sharingKey }) =>
    axios('/share/get-received', {
      method: 'POST',
      data: { sharingKey },
    }),
  getShareReceivedList: ({
    orgId,
    sharingKey,
    workspaceNodeId,
    search = null,
    filter = null,
    pagination,
  }) =>
    axios('/share/get-received/get-list', {
      method: 'POST',
      data: { orgId, sharingKey, workspaceNodeId, search, filter, pagination },
    }),
  getShareReceivedMaterial: ({
    orgId,
    sharingKey,
    workspaceNodeId,
    keyword,
    rank,
  }) =>
    axios('/share/get-received/get-material', {
      method: 'POST',
      data: { orgId, sharingKey, workspaceNodeId, keyword, rank },
    }),
  checkShareReceivedPermission: ({ sharingKey, type }) =>
    axios('/share/get-received/check-permission', {
      method: 'POST',
      data: { sharingKey, type },
    }),
  saveShareReceived: ({ sharingKey, orgId, groupId }) =>
    axios('/share/get-received/save', {
      method: 'POST',
      data: { sharingKey, orgId, groupId },
    }),
  cloneCheckShareReceived: ({ orgId, workspaceNodeList }) =>
    axios('/share/get-received/clone-check', {
      method: 'POST',
      data: { orgId, workspaceNodeList },
    }),
  cloneShareReceived: ({
    sharingKey,
    orgId,
    workspaceNodeList,
    targetLocationList,
    optional,
  }) =>
    axios('/share/get-received/clone', {
      method: 'POST',
      data: {
        sharingKey,
        orgId,
        workspaceNodeList,
        targetLocationList,
        optional,
      },
    }),
}
