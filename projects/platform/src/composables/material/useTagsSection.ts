import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { type Material } from '@frontier/platform-web-sdk'
import { type TabItem as Tab } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import useUser from '../useUser'

export enum TAB_ID {
  PUBLIC = 0,
  PRIVATE = 1,
}
const material = ref<Material>()

const useTagSection = () => {
  const { isInternalUser } = useUser()
  const { t } = useI18n()

  const setMaterial = (value: Material) => {
    material.value = value
  }
  const publicTags = computed(() => material.value?.tagInfo?.tagList)
  const privateTags = computed(() => material.value?.internalInfo?.tagList)

  const currentTab = ref<TAB_ID>(TAB_ID.PUBLIC)

  const switchTab = (tab: Tab) => {
    currentTab.value = tab.id
  }
  const tabList = computed<Tab[]>(() => {
    const list = [
      {
        id: TAB_ID.PUBLIC,
        name: t('FF0030'),
        value: publicTags.value?.length ?? 0,
      },
    ]

    if (isInternalUser) {
      list.push({
        id: TAB_ID.PRIVATE,
        name: t('FF0031'),
        value: privateTags.value?.length ?? 0,
      })
    }
    return list
  })

  const isTabsEmpty = computed(() => !tabList.value.find((tab) => !!tab.value))

  const title = t('RR0133')
  const desc = computed(() => {
    const result = [t('RR0557')]
    if (isTabsEmpty.value) {
      result.push(t('RR0562'))
    }
    return result.join(' ')
  })

  return {
    tabList,
    publicTags,
    privateTags,
    isInternalUser,
    isTabsEmpty,
    title,
    desc,
    switchTab,
    currentTab,
    setMaterial,
  }
}

export default useTagSection
