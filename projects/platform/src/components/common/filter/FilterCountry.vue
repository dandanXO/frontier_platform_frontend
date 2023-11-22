<template lang="pug">
filter-wrapper(
  iconName="globe"
  :displayName="$t('AA0036')"
  :dirty="filterDirty.countryList"
  :confirmButton="false"
)
  f-contextual-menu(
    v-model:inputSelectValue="innerCountryList"
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
  const allValueList: string[] = []
  let hasSelectedAll = true

  filterOption.value.countryList.forEach(({ name, countryCode }) => {
    allValueList.push(countryCode)
    if (hasSelectedAll && !innerCountryList.value.includes(countryCode)) {
      hasSelectedAll = false
    }

    menuList.push({
      title: name,
      selectValue: countryCode,
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
                ? (innerCountryList.value = [])
                : (innerCountryList.value = Array.from(
                    new Set([...innerCountryList.value, ...allValueList])
                  ))
            },
          }
        : null,
  }
})

const innerCountryList = computed({
  get: () => filterState.value.countryList,
  set: (v) => {
    filterStore.setFilterStateByProperty('countryList', v)
    emit('search')
  },
})
</script>
