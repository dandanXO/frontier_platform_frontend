<template lang="pug">
filter-wrapper(
  v-if="filterOption?.colorList"
  iconName="color_circle"
  :displayName="$t('RR0026')"
  :dirty="filterDirty.color"
  :confirmButton="false"
)
  div(class="grid grid-cols-4 grid-rows-3 gap-2")
    div(
      v-for="color in filterOption.colorList"
      :key="color.value"
      class="w-15 h-12.5 rounded flex items-center justify-center"
      :class="{ 'border border-grey-250': color.value === 'White' }"
      :style="{ backgroundColor: `${color.hex}` }"
      @click="select(color.value)"
    )
      f-svg-icon(
        v-if="filterState.color === color.value"
        iconName="done"
        size="24"
        :class="[color.value === 'White' ? ' text-grey-600' : 'text-grey-0']"
      )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const filterStore = useFilterStore()
const { filterOption, filterState, filterDirty } = storeToRefs(filterStore)

const select = (color: string) => {
  filterStore.setFilterStateByProperty(
    'color',
    filterState.value.color === color ? null : color
  )
  emit('search')
}
</script>
