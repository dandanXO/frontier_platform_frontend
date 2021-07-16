<template lang="pug">
dropdown(:options="localeOptions")
  template(#displayItem="{ isExpand, option }")
    div(class="flex items-center")
      span(class="text-primary font-bold text-caption") {{option.abbr}}
      svg-icon(iconName="arrow-down" color="black-650" class="transform" :class="[ isExpand ? '-rotate-90' : 'rotate-90' ]")
  template(#dropdownList="{ select, currentIndex }")
    div(class="absolute top-full right-0 transform translate-y-2 w-20 py-2 px-1 rounded grid gap-y-1" style="box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);")
      div(v-for="(option, index) in localeOptions"
        class="h-6 flex justify-center items-center"
        :class="{'bg-primary-thin rounded': index === currentIndex }"
        @click="select($event, index), changeLocale(option)"
      )
        span(class="text-body2 text-primary") {{option.lang}}
</template>

<script>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'DropdownLocale',
  setup () {
    const { locale } = useI18n()
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

    const changeLocale = (option) => {
      locale.value = option.locale
    }

    return {
      localeOptions,
      changeLocale
    }
  }
}
</script>
