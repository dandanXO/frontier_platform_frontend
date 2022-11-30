import '@frontier/tailwindcss/index.css'
import { app } from '@storybook/vue3'
import { createI18n } from 'vue-i18n'
import enUS from '@frontier/platform/src/locales/en-US.json'
import zhTW from '@frontier/platform/src/locales/zh-TW.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'zh-TW': zhTW,
  },
  globalInjection: true,
})

app.use(i18n)

const components = import.meta.globEager('../src/**/*.vue')
for (const path in components) {
  const component = components[path].default
  app.component(component.name, component)
}

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
  },
}
