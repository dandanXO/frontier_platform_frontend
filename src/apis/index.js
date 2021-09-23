import Axios from 'axios'
import router from '@/router'

const { VUE_APP_API_ENDPOINT } = process.env

const options = {
  baseURL: `${VUE_APP_API_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
}

const maxRetryTime = 3
const retryDelay = 1000
const instance = Axios.create(options)

instance.interceptors.request.use(async request => {
  const accessToken = localStorage.getItem('accessToken')
  request.headers.Authorization = `Bearer ${accessToken}`
  return request
})

instance.interceptors.response.use(async response => {
  const { data } = response
  const { result } = data

  if (result && Object.prototype.hasOwnProperty.call(data.result, 'accessToken')) {
    localStorage.setItem('accessToken', result.accessToken)
  }
  if (result && Object.prototype.hasOwnProperty.call(data.result, 'refreshToken')) {
    localStorage.setItem('refreshToken', result.refreshToken)
  }
  return response
}, async error => {
  const { config, response } = error

  // reject if there is no config field
  if (!config) {
    return Promise.reject(response.data)
  }
  // if network error occur
  if (!response) {
    return Promise.reject(response.data)
  }

  const { status } = response

  if (status === 401) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push(`/sign-in/${window.location.search}`)
    return Promise.reject(response)
  }

  config.headers['x-retry-count'] = config.headers['x-retry-count'] || 0
  if (config.headers['x-retry-count'] >= maxRetryTime) {
    return Promise.reject(response.data)
  }

  config.headers['x-retry-count'] += 1

  // create a new promise to handle exponential backoff
  const backoffDelay = (1 / 2) * Math.pow(2, config.headers['x-retry-count']) * retryDelay + Math.floor(Math.random() * 150 + 50)
  await new Promise((resolve, reject) => {
    setTimeout(resolve, backoffDelay)
  })
  return instance(config)
})

export default instance
