import 'overlayscrollbars/css/OverlayScrollbars.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/utils/i18n'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'

const app = createApp(App)

dayjs.extend(isToday)
dayjs.extend(isYesterday)
app.config.globalProperties.$dayjs = dayjs

app.config.errorHandler = (err, vm, info) => {
  store.dispatch('helper/clearModalPipeline')
  if (err.message !== 'access-token-expire') {
    store.dispatch('helper/openModalError')
    if (import.meta.MODE !== 'production') {
      console.error(err, vm)
    }
  }
}

app.config.warnHandler = (msg, vm, trace) => {
  if (import.meta.MODE !== 'production') {
    console.warn('warn', msg, vm, trace)
  }
}

const svgs = import.meta.globEager('/src/assets/icons/**/*.svg')

const commonComponents = import.meta.globEager('/src/components/common/**/*.vue')

for (const path in commonComponents) {
  const component = commonComponents[path].default
  app.component(component.name, component)
}

function prepare () {
  if (import.meta.MODE === 'development') {
    // const { worker } = require('@/mocks/browser')
    // return worker.start({
    //   onUnhandledRequest: 'bypass'
    // })
  }
  return Promise.resolve()
}

prepare().then(() => {
  app.use(store).use(router).use(i18n).mount('#app')
})
