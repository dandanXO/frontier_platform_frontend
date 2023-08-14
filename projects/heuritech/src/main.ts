import '@frontier/tailwindcss/index.css'
import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router'
import uiComponents from '@frontier/ui-component'
import i18n from '@/utils/i18n'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(uiComponents)
  .mount('#app')
