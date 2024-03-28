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

const { t } = useI18n()
const env = ref(process.env.NODE_ENV)
const urlPrefix = computed(() => {
  return `https://textile${
    env.value !== 'production' ? '-dev' : ''
  }.frontier.cool/Resource/MaterialMassImportTemplate/`
})

const templateList = computed(() => [
  {
    title: t('RR0091'),
    url: `${urlPrefix.value}Woven%20-%20Online%20Upload%20Format.xlsx`,
  },
  {
    title: t('RR0092'),
    url: `${urlPrefix.value}Knit%20-%20Online%20Upload%20Format%20Knit%20Final.xlsx`,
  },
  {
    title: t('MI0018'),
    url: `${urlPrefix.value}Leather%20-%20Online%20Upload%20Format%20Leather%20Final.xlsx`,
  },
  {
    title: t('MI0020'),
    url: `${urlPrefix.value}Non-Woven%20-%20Online%20Upload%20Format.xlsx`,
  },
  {
    title: t('MI0021'),
    url: `${urlPrefix.value}Trims%20-%20Online%20Upload%20Format.xlsx`,
  },
  {
    title: t('MI0022'),
    url: `${urlPrefix.value}Others%20-%20Online%20Mass%20Upload%20Format.xlsx`,
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
