import Axios from 'axios'
import router from '@/router'
import store from '@/store'
import i18n from '@frontier/i18n'
import { NOTIFY_TYPE } from '@/utils/constants'
import { resetTracker } from '@frontier/lib'
import { accessToken, refreshToken } from '@/utils/storage'

const { VITE_APP_API_ENDPOINT } = import.meta.env

const RESPONSE_CODE = {
  EXPIRED_ORG: 'WW0039',
  ORG_NOT_EXISTS: 'WW0119',
  WORKSPACE_NOT_EXISTS: 'WW0052',
} as const

const options = {
  baseURL: VITE_APP_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
}

const instance = Axios.create(options)

instance.interceptors.request.use((request) => {
  request.headers!.Authorization = `Bearer ${accessToken.value}`
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
      accessToken.value = result.accessToken
    }
    if (
      result &&
      Object.prototype.hasOwnProperty.call(data.result, 'refreshToken')
    ) {
      refreshToken.value = result.refreshToken
    }

    if (status === 200 && !success) {
      if (message && !code) {
        const { type, title, content } = message
        store.dispatch('helper/openModalConfirm', {
          type: type || 3,
          header: title || i18n.global.t('WW0122'),
          contentText: content,
          primaryBtnText: i18n.global.t('UU0031'),
          primaryBtnHandler: () => window.location.reload(),
        })
      }

      //handle case when organization not exists
      if (code === RESPONSE_CODE.ORG_NOT_EXISTS) {
        return router.push({ name: 'NotFound' })
      }

      if (
        [
          RESPONSE_CODE.EXPIRED_ORG,
          RESPONSE_CODE.WORKSPACE_NOT_EXISTS,
        ].includes(code)
      ) {
        return router.push({ name: 'NotAvailable' })
      }

      return Promise.reject({ status, code, message, result })
    }

    if (
      status === 200 &&
      success &&
      needPollingApiList.includes(config.url || '')
    ) {
      store.dispatch('polling/getSidebar')
    }

    return response
  },
  (error) => {
    if (Axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const { response, config: requestConfig } = error
    if (!response) {
      console.error('Network or other error without response:', error)
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.ALERT,
        header: i18n.global.t('RR0107'),
        contentText: i18n.global.t('RR0108', { code: 'N/A' }),
        primaryBtnText: i18n.global.t('UU0031'),
        primaryBtnHandler: () => window.location.reload(),
      })
      return Promise.reject(error)
    }

    const { status } = response
    const responseData = response.data || {}
    const code = responseData.code
    const message = responseData.message

    if (status === 404 && requestConfig?.meta?.suppressGlobal404Popup) {
      return Promise.reject(error)
    }

    if (status === 423) {
      return router.push({ name: 'NotAvailable' })
    }

    if (status === 401) {
      accessToken.value = null
      refreshToken.value = null
      const query: {
        [key: string]: any
      } = {}
      if (window.location.pathname !== '/') {
        query.redirect = `${window.location.pathname}${window.location.search}`
      }
      store.dispatch('helper/clearModalPipeline')
      resetTracker()
      router.push({ name: 'SignIn', query })
    } else if (status === 403) {
      return Promise.reject(error)
    } else {
      const apiTranslateContent = code ? i18n.global.t(code) : ''
      const messageTitle =
        typeof message === 'object' && message !== null
          ? message.title
          : undefined
      const messageContent =
        typeof message === 'object' && message !== null
          ? message.content
          : undefined

      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.ALERT,
        header: messageTitle || i18n.global.t('RR0107'),
        contentText:
          apiTranslateContent ||
          messageContent ||
          i18n.global.t('RR0108', { code: status || 999 }),
        primaryBtnText: i18n.global.t('UU0031'),
        primaryBtnHandler: () => window.location.reload(),
      })
    }

    return Promise.reject(error)
  }
)

const apiWrapper = (path: string, type = 'org', id = '', params = {}) => {
  const data: { [key: string]: any } = { ...params }
  if (type === 'org') {
    data['orgId'] = id
  } else {
    data['groupId'] = id
  }
  const prefixPath = type === 'org' ? '/org' : '/org/group'
  return instance(`${prefixPath}${path}`, { method: 'POST', data })
}

export { instance as default, apiWrapper }
