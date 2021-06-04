import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/utils/i18n'
import SvgIcon from '@/components/common/SvgIcon'

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icons', true, /\.svg$/)
requireAll(req)

const app = createApp(App)

app.component('SvgIcon', SvgIcon)

app.use(store).use(router).use(i18n).mount('#app')
