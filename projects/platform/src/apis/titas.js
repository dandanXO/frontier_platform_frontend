import axios from '@/apis'

export default {
  getTitasInfo: () => axios('/titas', {
    method: 'GET'
  }),
  getTitasShowroomList: ({ workspaceNodeId, workspaceNodeLocation, search = null, filter = null, pagination }) => axios('/titas/get-list', {
    method: 'POST',
    data: { workspaceNodeId, workspaceNodeLocation, search, filter, pagination }
  }),
  getTitasMaterial: ({ orgId, workspaceNodeId, workspaceNodeLocation }) => axios('/titas/get-material', {
    method: 'POST',
    data: { orgId, workspaceNodeId, workspaceNodeLocation }
  }),
  contactTitasOrg: ({ fromEmail, toEmail, subject, content }) => axios('/titas/send-mail', {
    method: 'POST',
    data: { fromEmail, toEmail, subject, content }
  })
}
