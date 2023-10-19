<template lang="pug">
filter-wrapper(
  iconName="price"
  :displayName="$t('RR0094')"
  :dirty="filterDirty.price"
  :confirmDisabled="disabled"
  @confirm="update"
)
  div(class="w-95")
    filter-range(
      v-model:range="inputRange"
      :min="filterOption.price.min"
      :max="filterOption.price.max"
      :label="$t('RR0095')"
    )
    div(class="pt-5")
      p(class="text-caption font-bold text-grey-600 pb-4") Currency
      div(class="flex items-center flex-wrap gap-4")
        f-input-checkbox(
          v-for="currency in currencyOptionList"
          :key="currency.name"
          v-model:inputValue="currencyList"
          :label="currency.name"
          :value="currency.value"
        )
    div(class="pt-8")
      p(class="text-caption font-bold text-grey-600 pb-4") Fabric Unit
      div(class="flex items-center flex-wrap gap-4")
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
import { MaterialQuantityUnit, CurrencyCode } from '@frontier/platform-web-sdk'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const filterStore = useFilterStore()
const { filterOption, filterState, filterDirty } = storeToRefs(filterStore)
const unitOptionList = Object.entries(MaterialQuantityUnit).map(
  ([key, value]) => ({
    name: key,
    value,
  })
)
const currencyOptionList = Object.entries(CurrencyCode).map(([key, value]) => ({
  name: key,
  value,
}))

const price = filterState.value.price
const inputRange = ref([price.min, price.max])
const currencyList = ref<CurrencyCode[]>(price.currencyList)
const unitList = ref<MaterialQuantityUnit[]>(price.unitList)

const disabled = computed(() => {
  const [min, max] = inputRange.value
  return min > max
})

const update = () => {
  const [min, max] = inputRange.value
  filterStore.setFilterStateByProperty('price', {
    min,
    max,
    isInfinity: max > filterOption.value.price.max,
    unitList: unitList.value,
    currencyList: currencyList.value,
  })
  emit('search')
}
</script>
