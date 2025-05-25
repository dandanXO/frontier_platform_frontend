import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { type Material } from '@frontier/platform-web-sdk'
import { type TabItem as Tab } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import useUser from '../useUser'
import { getKeys } from '@frontier/lib'

export enum TAB_ID {
  PUBLIC = 0,
  PRIVATE = 1,
}

const material = ref<Material>()
const usePriceSection = () => {
  const { t } = useI18n()
  const { isInternalUser } = useUser()

  const currentTab = ref<TAB_ID>(TAB_ID.PUBLIC)
  const setMaterial = (value: Material) => {
    material.value = value
  }

  const publicPrices = computed(() =>
    materialInfoForDisplay.priceInfo(material.value?.priceInfo ?? null)
  )
  const withPublicPrices = computed(
    () =>
      publicPrices.value &&
      !!getKeys<typeof publicPrices.value>(publicPrices.value).find(
        (key) => !!publicPrices.value?.[key].value
      )
  )

  const privatePrices = computed(() =>
    materialInfoForDisplay.priceInfo(
      material.value?.internalInfo?.priceInfo ?? null
    )
  )
  const withPrivatePrices = computed(
    () =>
      !!getKeys<typeof privatePrices.value>(privatePrices.value).find(
        (key) => !!privatePrices.value[key].value
      )
  )

  const tabList = computed<Tab[]>(() => {
    const list = [
      {
        id: TAB_ID.PUBLIC,
        name: t('FF0030'),
      },
    ]

    if (isInternalUser) {
      list.push({
        id: TAB_ID.PRIVATE,
        name: t('FF0031'),
      })
    }
    return list
  })

  const switchTab = (tab: Tab) => {
    currentTab.value = tab.id
  }

  return {
    publicPrices,
    currentTab,
    privatePrices,
    tabList,
    switchTab,
    isInternalUser,
    withPrivatePrices,
    withPublicPrices,
    setMaterial,
  }
}

export default usePriceSection
