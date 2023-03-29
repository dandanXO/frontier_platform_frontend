import axios from '@/apis'

export default {
  getShowroomAnnouncement: ({ orgId }) =>
    axios('/showroom/get-announcement', {
      method: 'POST',
      data: { orgId },
    }),
}
