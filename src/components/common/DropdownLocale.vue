<template lang="pug">
popper(placement="bottom-start")
  template(#trigger="{ isExpand }")
    div(class="flex items-center")
      span(class="text-primary font-bold text-caption") {{ currentLocaleAbbr($i18n.locale) }}
      svg-icon(iconName="arrow-down" size="24" class="text-black-650 transform" :class="[isExpand ? '-rotate-90' : 'rotate-90']")
  template(#content)
    list
      list-item(v-for="option in localeOptionList" @click="$i18n.locale = option.locale; changeLocale(option.locale)") {{ option.lang }}
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()
const localeOptionList = [
  {
    lang: 'English',
    abbr: 'EN',
    locale: 'en-US'
  },
  {
    lang: '繁體中文',
    abbr: '繁中',
    locale: 'zh-TW'
  }
]

const currentLocaleAbbr = (locale) => localeOptionList.find(option => option.locale === locale).abbr

const changeLocale = (locale) => {
  store.dispatch('user/changeLocale', { locale })
}
</script>
