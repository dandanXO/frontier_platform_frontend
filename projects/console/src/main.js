import { createApp } from 'vue'
import '@frontier/tailwindcss/index.css'
import App from './App.vue'
import components from '@frontier/ui-component'

createApp(App).use(components).mount('#app')
