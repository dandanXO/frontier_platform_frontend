import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US.json'
import enUS3DV from '@frontier/3d-viewer/i18n/locales/en-US.json'
import zhTW from './locales/zh-TW.json'
import zhTW3DV from '@frontier/3d-viewer/i18n/locales/zh-TW.json'
import jaJP from './locales/ja-JP.json'
import jaJP3DV from '@frontier/3d-viewer/i18n/locales/ja-JP.json'

export default createI18n({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': Object.assign({}, enUS, enUS3DV),
    'zh-TW': Object.assign({}, zhTW, zhTW3DV),
    'ja-JP': Object.assign({}, jaJP, jaJP3DV),
  },
  missing: () => {
    return ''
  },
  globalInjection: true,
  fallbackWarn: false,
  missingWarn: false,
  silentTranslationWarn: true,
})
