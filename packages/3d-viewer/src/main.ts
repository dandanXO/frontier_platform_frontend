import { createApp } from 'vue'
import App from './App.vue'
import '@frontier/tailwindcss/index.css'
import components from '@frontier/ui-component'
import i18n from '@frontier/i18n'

createApp(App).use(components).use(i18n).mount('#app')
