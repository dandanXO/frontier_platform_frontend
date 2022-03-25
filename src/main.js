import 'overlayscrollbars/css/OverlayScrollbars.css'
import './index.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/utils/i18n'
import dayjs from 'dayjs'
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
app.config.globalProperties.$dayjs = dayjs

app.config.errorHandler = (err, vm, info) => {
  store.dispatch('helper/clearModalPipeline')
  if (err.message !== 'access-token-expire') {
    store.dispatch('helper/openModalError')
    if (import.meta.env.PROD !== 'production') {
      console.error(err, vm)
    }
  }
}

app.config.warnHandler = (msg, vm, trace) => {
  if (import.meta.env.PROD !== 'production') {
    console.warn('warn', msg, vm, trace)
  }
}

app.directive('permission', permission)

app.use(store).use(router).use(i18n).mount('#app')
