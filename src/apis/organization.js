import axios from '@/apis'

export default {
  createOrg: (data) => axios('/org/create', {
    method: 'POST',
    data
  })
}
