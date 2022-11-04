import axios from '@/apis'

export default {
  getSidebar: ({ orgId }) =>
    axios('/polling/sidebar', {
      method: 'POST',
      data: { orgId },
    }),
}
