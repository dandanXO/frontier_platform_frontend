<template lang="pug">
filter-wrapper(
  iconName="co2"
  :displayName="t('EE0129')"
  :dirty="filterDirty.certificateList"
  :confirmButton="false"
)
  f-contextual-menu(
    v-model:inputSelectValue="innerCertificateList"
    :selectMode="CONTEXTUAL_MENU_MODE.MULTIPLE"
    :menuTree="menuTree"
    class="-mx-5 -my-4"
  )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { computed } from 'vue'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { MenuItem } from '@frontier/ui-component'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const { t } = useI18n()
const filterStore = useFilterStore()
const { filterDirty, filterState, filterOption } = storeToRefs(filterStore)

const menuTree = computed(() => {
  const menuList: MenuItem[] = []
  const allValueList: number[] = []
  let hasSelectedAll = true

  const certificates = filterOption.value.certificateList
  if (certificates) {
    certificates.forEach((cert) => {
      if (cert?.certificateId && cert?.name) {
        allValueList.push(cert.certificateId)
        if (
          hasSelectedAll &&
          !innerCertificateList.value.includes(cert.certificateId)
        ) {
          hasSelectedAll = false
        }

        menuList.push({
          title: cert.name,
          selectValue: cert.certificateId,
        })
      }
    })
  }

  return {
    width: 'w-57.5',
    scrollAreaMaxHeight: 'max-h-100',
    searchEnable: true,
    blockList: [
      {
        menuList,
      },
    ],
    button:
      allValueList.length > 1
        ? {
            position: 'bottom',
            icon: hasSelectedAll ? 'check_box' : 'check_box_outline_blank',
            text: t('RR0209'),
            clickHandler: () => {
              hasSelectedAll
                ? (innerCertificateList.value = [])
                : (innerCertificateList.value = Array.from(
                    new Set([...innerCertificateList.value, ...allValueList])
                  ))
            },
          }
        : null,
  }
})

const innerCertificateList = computed({
  get: () => filterState.value.certificateList,
  set: (v) => {
    filterStore.setFilterStateByProperty('certificateList', v)
    emit('search')
  },
})
</script>
