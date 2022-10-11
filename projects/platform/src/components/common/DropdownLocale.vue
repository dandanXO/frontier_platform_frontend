<template lang="pug">
f-popper(placement="bottom-end" :offset="[0, 3]")
  template(#trigger="{ isExpand }")
    div(class="flex items-center cursor-pointer")
      span(class="text-grey-900 font-bold text-caption") {{ currentLocaleAbbr($i18n.locale) }}
      f-svg-icon(iconName="keyboard_arrow_right" size="24" class="text-grey-600 transform" :class="[isExpand ? '-rotate-90' : 'rotate-90']")
  template(#content)
    f-list(class="px-1")
      div(
        v-for="option in localeOptionList"
        class="rounded text-body2 text-grey-900 hover:bg-grey-100 w-18 h-6 flex justify-center items-center"
        @click="$i18n.locale = option.locale"
      ) {{ option.lang }}
</template>

<script setup>
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
</script>
