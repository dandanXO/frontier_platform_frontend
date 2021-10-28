import 'overlayscrollbars/css/OverlayScrollbars.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/utils/i18n'

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icons', true, /\.svg$/)
requireAll(req)

const app = createApp(App)

const commonComponents = require.context('@/components/common', true, /.vue/)

commonComponents.keys().forEach(key => {
  const component = commonComponents(key).default
  app.component(component.name, component)
})

function prepare () {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = require('@/mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass'
    })
  }
  return Promise.resolve()
}

prepare().then(() => {
  app.use(store).use(router).use(i18n).mount('#app')
})
