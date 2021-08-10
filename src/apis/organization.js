import axios from '@/apis'

export default {
  createOrg: (data) => axios('/org/create', {
    method: 'POST',
    data
  }),
  getOrg: (data) => axios('/org/get', {
    method: 'POST',
    data
  }),
  checkOrgNameExist: (data) => axios('/org/check-name-exist', {
    method: 'POST',
    data
  })
}
