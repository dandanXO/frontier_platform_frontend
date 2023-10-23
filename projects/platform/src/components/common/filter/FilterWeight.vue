<template lang="pug">
filter-wrapper(
  v-if="filterOption?.weight"
  iconName="weight"
  :displayName="$t('RR0015')"
  :dirty="filterDirty.weight"
  :confirmDisabled="disabled"
  @confirm="update"
)
  div(class="w-95")
    filter-range(
      v-model:range="inputRange"
      :min="filterOption.weight.min"
      :max="filterOption.weight.max"
      :label="$t('RR0015')"
      @reset="reset"
    )
    div(class="flex items-center gap-x-6 pt-5")
      f-input-checkbox(
        v-for="unit in unitOptionList"
        :key="unit.name"
        v-model:inputValue="unitList"
        :label="unit.name"
        :value="unit.value"
      )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import FilterRange from '@/components/common/filter/FilterRange.vue'
import { ref, computed } from 'vue'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import type { WeightUnit } from '@frontier/platform-web-sdk'
import { WeightUnitText } from '@/utils/enumText'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const filterStore = useFilterStore()
const { filterOption, filterState, filterDirty } = storeToRefs(filterStore)

const unitOptionList = computed(() =>
  Object.entries(WeightUnitText).map(([value, name]) => ({
    name,
    value,
  }))
)
const weight = filterState.value.weight
const inputRange = ref([weight.min, weight.max])
const unitList = ref<WeightUnit[]>(weight.unitList)

const disabled = computed(() => {
  const [min, max] = inputRange.value
  return min > max
})

const update = () => {
  const [min, max] = inputRange.value
  filterStore.setFilterStateByProperty('weight', {
    min: min,
    max: max,
    isInfinity: max > filterOption.value.weight.max,
    unitList: unitList.value,
  })

  emit('search')
}

const reset = () => {
  unitList.value.length = 0
}
</script>
