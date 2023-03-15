import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import '@frontier/tailwindcss/index.css'
import components from '@frontier/ui-component'

// TODO: extract i18n package for all project
const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': {},
    'zh-TW': {},
  },
  globalInjection: true,
})

createApp(App).use(components).use(i18n).mount('#app')
