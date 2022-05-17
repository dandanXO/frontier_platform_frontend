import 'overlayscrollbars/css/OverlayScrollbars.css'
import './index.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/utils/i18n'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import permission from '@/directives/permission.js'

const svgs = import.meta.globEager('/src/assets/icons/**/*.svg')

const app = createApp(App)

const commonComponents = import.meta.globEager('/src/components/common/**/*.vue')

for (const path in commonComponents) {
  const component = commonComponents[path].default
  app.component(component.name, component)
}

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)
app.config.globalProperties.$dayjs = dayjs

app.config.errorHandler = (err, vm, info) => {
  const { status, message } = err

  if (!status || [400, 404, 500].includes(status)) {
    store.dispatch('helper/openModalConfirm', {
      type: 3,
      header: i18n.global.t('RR0107'),
      content: i18n.global.t('RR0108'),
      primaryBtnText: i18n.global.t('UU0031'),
      primaryBtnHandler: () => window.location.reload()
    })
  } else if (status === 401) {
    return
  } else {
    const { type, title, content } = message || {}
    store.dispatch('helper/openModalConfirm', {
      type: type || 3,
      header: title || 'Something went wrong!',
      content: content,
      primaryBtnText: i18n.global.t('UU0031'),
      primaryBtnHandler: () => window.location.reload()
    })
  }

  if (import.meta.env.PROD !== 'production') {
    console.error('err', err)
    console.error('vm', vm)
  }
}

app.config.warnHandler = (msg, vm, trace) => {
  if (import.meta.env.PROD !== 'production') {
    console.warn('warn', msg, vm, trace)
  }
}

app.directive('permission', permission)

app.use(store).use(router).use(i18n).mount('#app')
