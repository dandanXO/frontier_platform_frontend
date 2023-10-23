<template lang="pug">
filter-wrapper(
  iconName="paper"
  :displayName="$t('RR0098')"
  :dirty="filterDirty.status"
  :confirmButton="false"
)
  f-contextual-menu(
    v-model:inputSelectValue="complete"
    :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_CANCEL"
    :menuTree="menuTree"
    class="-mx-5 -my-4"
  )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import { computed } from 'vue'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { AssetsFilterStatusText } from '@/utils/enumText'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const filterStore = useFilterStore()
const { filterDirty, filterState } = storeToRefs(filterStore)

const menuTree = computed(() => {
  return {
    blockList: [
      {
        menuList: Object.entries(AssetsFilterStatusText).map(
          ([selectValue, title]) => ({
            title,
            selectValue,
          })
        ),
      },
    ],
  }
})

const complete = computed({
  get: () => filterState.value.status,
  set: (v) => {
    filterStore.setFilterStateByProperty('status', v)
    emit('search')
  },
})
</script>
