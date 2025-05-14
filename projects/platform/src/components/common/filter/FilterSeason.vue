<template lang="pug">
filter-wrapper(
  :displayName="t('MI0011')"
  :dirty="filterDirty.seasonList"
  :confirmButton="false"
)
  f-contextual-menu(
    v-model:inputSelectValue="innerSeasonList"
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

  const seasons = filterOption.value.seasonList
  if (seasons) {
    const combinedSeasons = [...seasons.default, ...seasons.custom]

    combinedSeasons.forEach((season) => {
      if (season?.name) {
        allValueList.push(season.name)
        if (hasSelectedAll && !innerSeasonList.value.includes(season.name)) {
          hasSelectedAll = false
        }

        menuList.push({
          title: season.name,
          selectValue: season.name,
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
                ? (innerSeasonList.value = [])
                : (innerSeasonList.value = Array.from(
                    new Set([...innerSeasonList.value, ...allValueList])
                  ))
            },
          }
        : null,
  }
})

const innerSeasonList = computed({
  get: () => filterState.value.seasonList,
  set: (v) => {
    filterStore.setFilterStateByProperty('seasonList', v)
    emit('search')
  },
})
</script>
