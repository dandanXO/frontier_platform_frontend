<template lang="pug">
f-popper(placement="bottom-start")
  template(#trigger="{ isExpand }")
    f-button(type="secondary" size="md" prependIcon="download")
      p {{ $t('UU0152') }}
      f-svg-icon(
        iconName="arrow_down"
        :class="[isExpand ? 'text-primary-400' : 'text-primary-500']"
      )
  template(#content="{ collapsePopper }")
    f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { useConstants } from '@/utils/constants'

const { t, locale } = useI18n()
const env = ref(process.env.NODE_ENV)
const { TEMPLATE_LIST } = useConstants()

const urlPrefix = computed(() => {
  const domainName = env.value === 'production' ? 'textile' : 'textile-dev'
  return `https://${domainName}.frontier.cool/Resource/MaterialMassImportTemplate/`
})
const urlPostfix = computed(() => {
  return locale.value === 'zh-TW' ? '-zh' : ''
})
const urlMaker = (type: string) => {
  return `${urlPrefix.value}${type}${urlPostfix.value}.xlsx`
}

const downloadFile = (type: string, title: string) => {
  const link = document.createElement('a')
  link.href = urlMaker(type)
  link.download = title
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const menuTree = {
  blockList: [
    {
      menuList: TEMPLATE_LIST.value.map((template) => ({
        title: template.title,
        clickHandler: () => downloadFile(template.type, template.title),
      })),
    },
  ],
}
</script>
