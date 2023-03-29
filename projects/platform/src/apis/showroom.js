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
}
