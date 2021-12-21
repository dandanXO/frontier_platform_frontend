import Axios from 'axios'
import router from '@/router'
import store from '@/store'

const { VUE_APP_API_ENDPOINT } = process.env

const options = {
  baseURL: `${VUE_APP_API_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
}

const instance = Axios.create(options)

instance.interceptors.request.use(request => {
  const accessToken = localStorage.getItem('accessToken')
  request.headers.Authorization = `Bearer ${accessToken}`
  return request
})

instance.interceptors.response.use(response => {
  const { data } = response
  const { result } = data

  if (result && Object.prototype.hasOwnProperty.call(data.result, 'accessToken')) {
    localStorage.setItem('accessToken', result.accessToken)
  }
  if (result && Object.prototype.hasOwnProperty.call(data.result, 'refreshToken')) {
    localStorage.setItem('refreshToken', result.refreshToken)
  }
  return response
}, error => {
  const { response } = error
  const { status } = response

  if (status === 401) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push(`/sign-in/${window.location.search}`)
  }

  if ([400, 404, 500].includes(status)) {
    store.dispatch('helper/openModalError')
  }

  return Promise.reject(error)
})

export default instance
