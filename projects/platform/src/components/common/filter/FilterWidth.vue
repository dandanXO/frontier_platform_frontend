<template lang="pug">
filter-wrapper(
  v-if="filterOption?.width"
  iconName="measure"
  :displayName="$t('RR0088')"
  :dirty="filterDirty.width"
  :confirmDisabled="disabled"
  @confirm="updateWidth"
)
  div(class="w-95 flex flex-col")
    filter-range(
      v-model:range="cuttable.range"
      :min="filterOption.width.min"
      :max="filterOption.width.max"
      :label="$t('RR0019')"
      @reset="cuttable.reset"
    )
    filter-range(
      v-model:range="full.range"
      :min="filterOption.width.min"
      :max="filterOption.width.max"
      :label="$t('MI0036')"
      @reset="full.reset"
      class="mt-10 mb-5"
    )
    div(class="flex items-center gap-x-4")
      f-input-checkbox(
        v-for="unit in unitOptionList"
        :key="unit.value"
        v-model:inputValue="unitList"
        :label="unit.label"
        :value="unit.value"
      )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import FilterRange from '@/components/common/filter/FilterRange.vue'
import { ref, computed } from 'vue'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import type { LengthUnit } from '@frontier/platform-web-sdk'
import { LengthUnitText } from '@/utils/enumText'
import useEnumText from '@/composables/useEnumText'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const filterStore = useFilterStore()
const { filterOption, filterState, filterDirty } = storeToRefs(filterStore)
const { lengthUnitText } = useEnumText()

const unitOptionList = computed(() =>
  Object.entries(LengthUnitText).map(([keyString, nameValue]) => {
    const numericKey = Number(keyString) as LengthUnit
    return {
      name: nameValue,
      value: numericKey,
      label: lengthUnitText.value[numericKey],
    }
  })
)
const { width } = filterState.value
const cuttable = ref({
  range: [width.cuttable.min, width.cuttable.max],
  reset: () => {
    unitList.value.length = 0
  },
})
const full = ref({
  range: [width.full.min, width.full.max],
  reset: () => {
    unitList.value.length = 0
  },
})
const unitList = ref<LengthUnit[]>(width.unitList)

const disabled = computed(() => {
  const [cuttableMin, cuttableMax] = cuttable.value.range
  const [fullMin, fullMax] = full.value.range

  const isCuttableRangeInvalid =
    typeof cuttableMin === 'number' &&
    typeof cuttableMax === 'number' &&
    cuttableMin > cuttableMax
  const isFullRangeInvalid =
    typeof fullMin === 'number' &&
    typeof fullMax === 'number' &&
    fullMin > fullMax

  const noUnitsSelected = unitList.value.length === 0

  return isCuttableRangeInvalid || isFullRangeInvalid || noUnitsSelected
})

const updateWidth = () => {
  const [cuttableMin, cuttableMax] = cuttable.value.range
  const [fullMin, fullMax] = full.value.range
  filterStore.setFilterStateByProperty('width', {
    cuttable: {
      min: cuttableMin,
      max: cuttableMax,
      isInfinity: cuttableMax > filterOption.value.width.max,
    },
    full: {
      min: fullMin,
      max: fullMax,
      isInfinity: cuttableMax > filterOption.value.width.max,
    },
    unitList: unitList.value,
  })

  emit('search')
}
</script>
