<template lang="pug">
filter-wrapper(
  iconName="stock"
  :displayName="$t('RR0093')"
  :dirty="filterDirty.inventory"
  :confirmDisabled="disabled"
  @confirm="update"
)
  div(class="w-95")
    filter-range(
      v-model:range="inputRange"
      :min="filterOption.inventory.min"
      :max="filterOption.inventory.max"
      :label="$t('RR0109')"
    )
    div(v-if="searchType !== SEARCH_TYPE.EXTERNAL" class="flex items-center gap-x-6 pt-5")
      f-input-checkbox(
        v-for="unit in unitOptionList"
        :key="unit.name"
        v-model:inputValue="unitList"
        :label="unit.label"
        :value="unit.value"
      )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import FilterRange from '@/components/common/filter/FilterRange.vue'
import { ref, computed } from 'vue'
import { SEARCH_TYPE } from '@/utils/constants'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { MaterialQuantityUnit } from '@frontier/platform-web-sdk'
import useEnumText from '@/composables/useEnumText'

const props = defineProps<{
  searchType: SEARCH_TYPE
}>()

const emit = defineEmits<{
  (e: 'search'): void
}>()

const { materialQuantityText } = useEnumText()
const filterStore = useFilterStore()
const { filterOption, filterState, filterDirty } = storeToRefs(filterStore)

const unitOptionList = computed(() =>
  Object.entries(MaterialQuantityUnit).map(([key, value]) => ({
    name: key,
    value: value,
    label: materialQuantityText.value[value],
  }))
)

const inventory = filterState.value.inventory
const inputRange = ref([inventory.min, inventory.max])
const unitList = ref<MaterialQuantityUnit[]>(inventory.unitList)

const disabled = computed(() => {
  const [min, max] = inputRange.value
  const isRangeInvalid =
    typeof min === 'number' && typeof max === 'number' && min > max

  let disableDueToNoUnits = false
  if (props.searchType !== SEARCH_TYPE.EXTERNAL) {
    if (unitList.value.length === 0) {
      disableDueToNoUnits = true
    }
  }

  return isRangeInvalid || disableDueToNoUnits
})

const update = () => {
  const [min, max] = inputRange.value
  filterStore.setFilterStateByProperty('inventory', {
    min,
    max,
    isInfinity: max > filterOption.value.inventory.max,
    unitList: unitList.value,
  })
  emit('search')
}
</script>
