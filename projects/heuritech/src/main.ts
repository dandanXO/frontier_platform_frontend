import '@frontier/tailwindcss/index.css'
import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router'
import uiComponents from '@frontier/ui-component'
import ModelEditor from '@frontier/3d-viewer'
import i18n from '@frontier/i18n'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(uiComponents)
  .use(ModelEditor)
  .mount('#app')
