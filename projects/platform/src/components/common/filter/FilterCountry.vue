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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import { useFilterStore } from '@/stores/filter'
import type { MenuItem, MenuTree } from '@frontier/ui-component'

const emit = defineEmits<{
  (e: 'search'): void
}>()

function parseEmoji(raw: string): string {
  return (
    raw
      // 按空白切開 → ["U+1F1FA", "U+1F1F8"]
      .trim()
      .split(/\s+/)
      // 去掉 U+，轉成整數 → [0x1F1FA, 0x1F1F8]
      .map((code) => parseInt(code.replace(/^U\+/, ''), 16))
      // 再組回字串
      .reduce((str, cp) => str + String.fromCodePoint(cp), '')
  )
}

const { t } = useI18n()
const filterStore = useFilterStore()
const { filterDirty, filterState, filterOption } = storeToRefs(filterStore)

const menuTree = computed(() => {
  const menuList: MenuItem[] = []
  const allValueList: string[] = []
  let hasSelectedAll = true

  filterOption.value.countryList.forEach(
    ({ name, countryCode, count, emoji }) => {
      allValueList.push(countryCode)
      if (hasSelectedAll && !innerCountryList.value.includes(countryCode)) {
        hasSelectedAll = false
      }
      let _title = `${parseEmoji(emoji)} ${name} (${count})`
      if (!count) {
        _title = `${parseEmoji(emoji)} ${name}`
      }
      menuList.push({
        title: _title,
        selectValue: countryCode,
      })
    }
  )

  return {
    width: 'w-57.5',
    scrollAreaMaxHeight: 'max-h-80',
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
  } as MenuTree
})

const innerCountryList = computed({
  get: () => filterState.value.countryList,
  set: (v) => {
    filterStore.setFilterStateByProperty('countryList', v)
    emit('search')
  },
})
</script>
