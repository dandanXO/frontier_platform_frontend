import Axios from 'axios'
import router from '@/router'
import store from '@/store'
import i18n from '@/utils/i18n'

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
  const { data, status } = response
  const { success, result, code, message } = data

  if (result && Object.prototype.hasOwnProperty.call(data.result, 'accessToken')) {
    localStorage.setItem('accessToken', result.accessToken)
  }
  if (result && Object.prototype.hasOwnProperty.call(data.result, 'refreshToken')) {
    localStorage.setItem('refreshToken', result.refreshToken)
  }

  if (status === 200 && !success) {
    if (!!message) {
      const { type, title, content } = message
      store.dispatch('helper/openModalConfirm', {
        type: type || 3,
        header: title || 'Something went wrong!',
        content: content,
        primaryBtnText: i18n.global.t('UU0031'),
        primaryBtnHandler: () => window.location.reload()
      })
    }
    return Promise.reject({ status, code, message })
  }

  return response
}, error => {
  const { response } = error
  const { status, data: { code, message } } = response

  if (status === 401) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    const query = {}
    if (window.location.pathname !== '/') {
      query.redirect = `${window.location.pathname}${window.location.search}`
    }
    store.dispatch('helper/clearModalPipeline')
    router.push({ name: 'SignIn', query })
  } else if ([400, 404, 500].includes(status)) {
    store.dispatch('helper/openModalConfirm', {
      type: 3,
      header: i18n.global.t('RR0107'),
      content: i18n.global.t('RR0108'),
      primaryBtnText: i18n.global.t('UU0031'),
      primaryBtnHandler: () => window.location.reload()
    })
  }

  return Promise.reject({ status, code, message })
})

export default instance
