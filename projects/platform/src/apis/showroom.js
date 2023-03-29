import axios from '@/apis'

export default {
  getShowroomAnnouncement: ({ orgId }) =>
    axios('/showroom/get-announcement', {
      method: 'POST',
      data: { orgId },
    }),
  getShowroomBannerAndList: ({ orgId }) =>
    axios('/showroom/get-banner-and-list', {
      method: 'POST',
      data: { orgId },
    }),
  getShowroom: ({ orgId, showroomId }) =>
    axios('/showroom/get-info', {
      method: 'POST',
      data: {
        orgId,
        showroomId,
      },
    }),
  getShowroomNodeList: ({
    orgId,
    showroomId,
    workspaceNodeId,
    workspaceNodeLocation,
    search = null,
    filter = null,
    pagination,
  }) =>
    axios('/showroom/get-list', {
      method: 'POST',
      data: {
        orgId,
        showroomId,
        workspaceNodeId,
        workspaceNodeLocation,
        search,
        filter,
        pagination,
      },
    }),
  getShowroomMaterial: ({
    orgId,
    workspaceNodeId,
    workspaceNodeLocation,
    keyword,
    rank,
  }) =>
    axios('/showroom/get-material', {
      method: 'POST',
      data: { orgId, workspaceNodeId, workspaceNodeLocation, keyword, rank },
    }),
  contactShowroomOrg: ({ showroomId, fromEmail, toOrgId, subject, content }) =>
    axios('/showroom/send-mail', {
      method: 'POST',
      data: { showroomId, fromEmail, toOrgId, subject, content },
    }),
}
