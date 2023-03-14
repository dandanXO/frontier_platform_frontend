import Axios from 'axios'
import router from '@/router'
import store from '@/store'
import i18n from '@/utils/i18n'

const { VITE_APP_API_ENDPOINT } = import.meta.env

const options = {
  baseURL: VITE_APP_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
}

const instance = Axios.create(options)

instance.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem('accessToken')
  request.headers.Authorization = `Bearer ${accessToken}`
  return request
})

const needPollingApiList = [
  '/org/assets/material/merge',
  '/org/assets/material/delete',
  '/org/assets/material/mass-export',
  '/org/assets/material/clone',
  '/org/assets/material/batch-upload',
  '/org/assets/material/smart-upload',
  '/org/assets/material/create',
  '/org/assets/material/update/generate-u3m',
  '/org/group/assets/material/merge',
  '/org/group/assets/material/delete',
  '/org/group/assets/material/mass-export',
  '/org/group/assets/material/clone',
  '/org/group/assets/material/batch-upload',
  '/org/group/assets/material/smart-upload',
  '/org/group/assets/material/create',
  '/org/group/assets/material/update/generate-u3m',
  '/org/member/delete',
  '/org/member/invite-via-email',
  '/org/plan/upgrade',
  '/org/plan/upgrade-request',
  '/org/plan/purchase/material',
  '/org/plan/cancel/material',
  '/org/plan/purchase/u3m',
  '/org/plan/deactivate',
  '/org/plan/activate',
  '/org/share-to-me/clone',
  '/org/group/share-to-me/clone',
  '/share/get-received/clone',
  '/public/clone',
]

instance.interceptors.response.use(
  async (response) => {
    const { data, status, config } = response
    const { success, result, code, message } = data

    if (
      result &&
      Object.prototype.hasOwnProperty.call(data.result, 'accessToken')
    ) {
      localStorage.setItem('accessToken', result.accessToken)
    }
    if (
      result &&
      Object.prototype.hasOwnProperty.call(data.result, 'refreshToken')
    ) {
      localStorage.setItem('refreshToken', result.refreshToken)
    }

    if (status === 200 && !success) {
      if (message) {
        const { type, title, content } = message
        store.dispatch('helper/openModalConfirm', {
          type: type || 3,
          header: title || i18n.global.t('WW0122'),
          contentText: content,
          primaryBtnText: i18n.global.t('UU0031'),
          primaryBtnHandler: () => window.location.reload(),
        })
      }
      return Promise.reject({ status, code, message, result })
    }

    if (status === 200 && success && needPollingApiList.includes(config.url)) {
      store.dispatch('polling/getSidebar')
    }

    return response
  },
  (error) => {
    const { response } = error
    const {
      status,
      data: { code, message },
    } = response

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
        contentText: i18n.global.t('RR0108'),
        primaryBtnText: i18n.global.t('UU0031'),
        primaryBtnHandler: () => window.location.reload(),
      })
    }

    return Promise.reject({ status, code, message })
  }
)

const apiWrapper = (path, type = 'org', id, params = {}) => {
  const data = { ...params }
  if (type === 'org') {
    data['orgId'] = id
  } else {
    data['groupId'] = id
  }
  const prefixPath = type === 'org' ? '/org' : '/org/group'
  return instance(`${prefixPath}${path}`, { method: 'POST', data })
}

export { instance as default, apiWrapper }
