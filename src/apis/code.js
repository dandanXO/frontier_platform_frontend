import axios from '@/apis'

export default {
  getCountryList: () => axios('/code/country', {
    method: 'POST'
  })
}
