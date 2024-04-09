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

const { t, locale } = useI18n()
const env = ref(process.env.NODE_ENV)
const urlPrefix = computed(() => {
  const domainName = env.value === 'production' ? 'textile' : 'textile-dev'
  return `https://${domainName}.frontier.cool/Resource/MaterialMassImportTemplate/`
})

const urlPostfix = computed(() => {
  return locale.value === 'zh-TW' ? '-zh' : ''
})

const templateList = computed(() => [
  {
    title: t('RR0091'),
    url: `${urlPrefix.value}Woven${urlPostfix.value}.xlsx`,
  },
  {
    title: t('RR0092'),
    url: `${urlPrefix.value}Knit${urlPostfix.value}.xlsx`,
  },
  {
    title: t('MI0018'),
    url: `${urlPrefix.value}Leather${urlPostfix.value}.xlsx`,
  },
  {
    title: t('MI0020'),
    url: `${urlPrefix.value}Non-Woven${urlPostfix.value}.xlsx`,
  },
  {
    title: t('MI0021'),
    url: `${urlPrefix.value}Trims${urlPostfix.value}.xlsx`,
  },
  {
    title: t('MI0022'),
    url: `${urlPrefix.value}Others${urlPostfix.value}.xlsx`,
  },
])

const downloadFile = (url: string, title: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = title
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const menuTree = {
  blockList: [
    {
      menuList: templateList.value.map((block) => ({
        title: block.title,
        clickHandler: () => downloadFile(block.url, block.title),
      })),
    },
  ],
}
</script>
