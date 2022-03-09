import Axios from 'axios'
import router from '@/router'
import store from '@/store'

const { VITE_APP_API_ENDPOINT } = import.meta.env

const options = {
  baseURL: `${VITE_APP_API_ENDPOINT}`,
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
    const query = {}
    if (window.location.pathname !== '/') {
      query.redirect = `${window.location.pathname}${window.location.search}`
    }
    router.push({ name: 'SignIn', query })
    return Promise.reject(new Error('access-token-expire'))
  }

  if ([400, 404, 500].includes(status)) {
    store.dispatch('helper/openModalError')
  }

  return Promise.reject(error)
})

export default instance
