<template lang="pug">
filter-wrapper(
  v-if="filterOption?.patternList"
  iconName="pattern"
  :displayName="$t('RR0025')"
  :dirty="filterDirty.pattern"
  :confirmButton="false"
)
  div(class="grid gap-y-2.5")
    div(v-for="pattenGroup in filterOption.patternList" :key="pattenGroup.key")
      p(class="text-body1 font-bold text-grey-900 border-b border-grey-250 pb-2 mb-3") {{ pattenGroup.key }}
      div(class="grid grid-cols-5 gap-x-3 gap-y-5")
        div(
          v-for="pattern in pattenGroup.list"
          :key="pattern.value"
          class="w-25"
          @click="select(pattern.value)"
        )
          div(
            class="h-15 rounded overflow-hidden"
            :class="{ 'border-2 border-primary-400': filterState.pattern === pattern.value }"
          )
            img(class="w-full h-full" :src="pattern.img")
          p(class="text-body2 text-grey-900 text-center pt-1.5") {{ pattern.value }}
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

const select = (pattern: string) => {
  filterStore.setFilterStateByProperty(
    'pattern',
    filterState.value.pattern === pattern ? null : pattern
  )
  emit('search')
}
</script>
