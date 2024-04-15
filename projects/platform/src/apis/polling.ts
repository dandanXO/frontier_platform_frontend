import axios from '@/apis'

export default {
  getSidebar: ({ orgId }: { orgId: string }) =>
    axios('/polling/sidebar', {
      method: 'POST',
      data: { orgId },
    }),
}
