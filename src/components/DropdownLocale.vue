<template lang="pug">
dropdown(
  v-model:value="$i18n.locale"
  :options="localeOptions"
  keyOptionDisplay="lang"
  keyOptionValue="locale"
  @select="changeLocale($event.locale)"
)
  template(#displayItem="{ isExpand, option }")
    div(class="flex items-center")
      span(class="text-primary font-bold text-caption") {{ option.abbr }}
      svg-icon(iconName="arrow-down" size="24" class="text-black-650 transform" :class="[isExpand ? '-rotate-90' : 'rotate-90']")
</template>

<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'DropdownLocale',
  setup () {
    const store = useStore()
    const localeOptions = reactive([
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
    ])

    const changeLocale = (locale) => {
      store.dispatch('user/changeLocale', { locale })
    }

    return {
      localeOptions,
      changeLocale
    }
  }
}
</script>
