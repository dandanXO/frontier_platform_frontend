import axios from '@/apis'

export default {
  getPollingSidebar: ({ orgId }) => axios('/polling/sidebar', {
    method: 'POST',
    data: { orgId }
  })
}
