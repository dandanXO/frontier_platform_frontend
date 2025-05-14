<template lang="pug">
filter-wrapper(
  :displayName="t('RR0341')"
  :dirty="filterDirty.yearList"
  :confirmButton="false"
)
  f-contextual-menu(
    v-model:inputSelectValue="innerYearList"
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
  const availableYears: number[] = filterOption.value.yearList || []
  const allValueList: number[] = []
  let hasSelectedAll = true

  availableYears.sort((a, b) => b - a)

  availableYears.forEach((year) => {
    allValueList.push(year)
    if (hasSelectedAll && !innerYearList.value.includes(year)) {
      hasSelectedAll = false
    }

    menuList.push({
      title: String(year),
      selectValue: year,
    })
  })

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
                ? (innerYearList.value = [])
                : (innerYearList.value = Array.from(
                    new Set([...innerYearList.value, ...allValueList])
                  ))
            },
          }
        : null,
  }
})

const innerYearList = computed({
  get: () => filterState.value.yearList || [],
  set: (v) => {
    filterStore.setFilterStateByProperty('yearList', v)
    emit('search')
  },
})
</script>
