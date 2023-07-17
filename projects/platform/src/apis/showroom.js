import axios from '@/apis'

export default {
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
  contactShowroomOrg: ({
    orgId,
    showroomId,
    fromEmail,
    toOrgId,
    subject,
    content,
  }) =>
    axios('/showroom/send-mail', {
      method: 'POST',
      data: { orgId, showroomId, fromEmail, toOrgId, subject, content },
    }),
}
