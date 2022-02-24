<template lang="pug">
div(class="grid gap-y-7.5")
  input-select(
    v-model:selectValue="material.publicPrice.countryCode"
    :options="countryList"
    :label="$t('RR0042')"
    :placeholder="$t('DD0016')"
    keyOptionDisplay="name"
    keyOptionValue="countryCode"
    searchBox
    class="relative z-20"
  )
  input-container(:label="$t('RR0043')")
    div(class="flex items-center gap-x-3")
      p(class="text-body2 text-primary font-bold") {{$t('RR0044')}}
      input-text(
        v-model:textValue="material.publicPrice.price"
        inputType="number"
        class="w-50"
        :customErrorMsg="validations.publicPricePrice"
      )
      p(class="text-body2 text-primary font-bold") {{INVENTORY_UNIT.Y}}
  input-container(:label="$t('RR0047')" class="relative z-19")
    div(class="flex items-center gap-x-3")
      input-text(
        v-model:textValue="material.publicPrice.minimumOrderQuantity"
        inputType="number"
        class="w-50"
        :customErrorMsg="validations.publicPriceMinimumOrderQuantity"
      )
      input-select(
        v-model:selectValue="material.publicPrice.minimumOrderQuantityUnit"
        :options="inventoryUnitList"
        keyOptionDisplay="unit"
        keyOptionValue="unit"
        class="w-25"
      )
  input-container(:label="$t('RR0048')" class="relative z-18")
    div(class="flex items-center gap-x-3")
      input-text(
        v-model:textValue="material.publicPrice.minimumContainerQuantity"
        inputType="number"
        class="w-50"
        :customErrorMsg="validations.publicPriceMinimumContainerQuantity"
      )
      input-select(
        v-model:selectValue="material.publicPrice.minimumContainerQuantityUnit"
        :options="inventoryUnitList"
        keyOptionDisplay="unit"
        keyOptionValue="unit"
        class="w-25"
      )
  input-container(:label="$t('RR0049')")
    div(class="flex items-center gap-x-3")
      input-text(
        v-model:textValue="material.publicPrice.productionLeadTime"
        class="w-50"
        :customErrorMsg="validations.publicPriceProductionLeadTime"
      )
      p(class="text-body2 text-primary font-bold") {{$t('RR0050')}}
  input-container(:label="$t('RR0051')")
    div(class="flex items-center gap-x-3")
      input-text(
        v-model:textValue="material.publicPrice.sampleLeadTime"
        class="w-50"
        :customErrorMsg="validations.publicPriceSampleLeadTime"
      )
      p(class="text-body2 text-primary font-bold") {{$t('RR0050')}}
</template>

<script>
import { computed, watch } from 'vue'
import { INVENTORY_UNIT } from '@/utils/constants'
import { useStore } from 'vuex'
import useMaterialEdit from '@/composables/useMaterialEdit'

export default {
  name: 'SimplePrice',
  props: {
    validations: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const countryList = computed(() => store.getters['code/countryList'])
    const material = computed(() => store.getters['material/material'])
    const { inventoryUnitList } = useMaterialEdit(material.value)

    watch(
      () => material.value,
      () => {
        store.commit('material/UPDATE_material', material.value)
      },
      {
        deep: true
      }
    )

    return {
      material,
      countryList,
      inventoryUnitList,
      INVENTORY_UNIT
    }
  }
}
</script>
