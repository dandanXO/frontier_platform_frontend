import '@frontier/tailwindcss/index.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/utils/i18n'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import permission from '@/directives/permission.js'
import defaultImg from '@/directives/defaultImg.js'
import VueGtag from 'vue-gtag'
import uiComponents from '@frontier/ui-component'
import modelViewerComponents from '@frontier/3d-viewer'
import inputRules from '@/utils/inputRules'

const app = createApp(App)

app.config.globalProperties.$inputRules = inputRules

dayjs.extend(isToday)
dayjs.extend(isYesterday)
app.config.globalProperties.$dayjs = dayjs

app.config.errorHandler = (err, vm, info) => {
  const { status, message } = err

  if (!status || [400, 404, 500].includes(status)) {
    store.dispatch('helper/openModalConfirm', {
      type: 3,
      header: i18n.global.t('RR0107'),
      contentText: i18n.global.t('RR0108'),
      primaryBtnText: i18n.global.t('UU0031'),
      primaryBtnHandler: () => window.location.reload()
    })
  } else if (status === 401) {
    return
  } else {
    const { type, title, content } = message || {}
    store.dispatch('helper/openModalConfirm', {
      type: type || 3,
      header: title || i18n.global.t('WW0122'),
      contentText: content,
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
app.directive('defaultImg', defaultImg)

const globalComponents = import.meta.globEager('/src/components/global/**/*.vue')

for (const path in globalComponents) {
  const component = globalComponents[path].default
  app.component(component.name, component)
}

app
  .use(router)
  .use(VueGtag, {
    bootstrap: false,
    config: { id: import.meta.env.VITE_APP_GA_MEASUREMENT_ID }
  }, router)
  .use(store)
  .use(i18n)
  .use(uiComponents)
  .use(modelViewerComponents)
  .mount('#app')
