<template lang="pug">
f-expansion-panel(class="border-b border-grey-200")
  template(#trigger="{ isExpand }")
    div(class="h-15 flex items-center justify-between")
      h5(class="text-h5 text-grey-900 font-bold") {{ $t("DD0025") }}
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="20"
        class="transform text-grey-900"
        :class="[isExpand ? '-rotate-90' : 'rotate-90']"
      )
  template(#content)
    div(class="px-15 pt-5 mb-15 grid gap-y-7.5")
      f-input-select(
        v-model:selectValue="material.publicPrice.countryCode"
        :optionList="countryList"
        :label="$t('RR0042')"
        :placeholder="$t('DD0016')"
        keyOptionDisplay="name"
        keyOptionValue="countryCode"
        searchBox
      )
      f-input-container(:label="$t('RR0043')")
        div(class="flex items-center gap-x-3")
          p(class="text-body2 text-grey-900 font-bold") {{ $t("RR0044") }}
          f-input-text(
            v-model:textValue="material.publicPrice.price"
            inputType="number"
            class="w-50"
            :customErrorMsg="invalidation.publicPricePrice"
          )
          p(class="text-body2 text-grey-900 font-bold") {{ INVENTORY_UNIT.Y }}
      f-input-container(:label="$t('RR0047')")
        div(class="flex items-center gap-x-3")
          f-input-text(
            v-model:textValue="material.publicPrice.minimumOrderQuantity"
            inputType="number"
            class="w-50"
            :customErrorMsg="invalidation.publicPriceMinimumOrderQuantity"
          )
          f-input-select(
            v-model:selectValue="material.publicPrice.minimumOrderQuantityUnit"
            :optionList="inventoryUnitList"
            keyOptionDisplay="unit"
            keyOptionValue="unit"
            class="w-25"
          )
      f-input-container(:label="$t('RR0048')")
        div(class="flex items-center gap-x-3")
          f-input-text(
            v-model:textValue="material.publicPrice.minimumContainerQuantity"
            inputType="number"
            class="w-50"
            :customErrorMsg="invalidation.publicPriceMinimumContainerQuantity"
          )
          f-input-select(
            v-model:selectValue="material.publicPrice.minimumContainerQuantityUnit"
            :optionList="inventoryUnitList"
            keyOptionDisplay="unit"
            keyOptionValue="unit"
            class="w-25"
          )
      f-input-container(:label="$t('RR0049')")
        div(class="flex items-center gap-x-3")
          f-input-text(
            v-model:textValue="material.publicPrice.productionLeadTime"
            class="w-50"
            :customErrorMsg="invalidation.publicPriceProductionLeadTime"
          )
          p(class="text-body2 text-grey-900 font-bold") {{ $t("RR0050") }}
      f-input-container(:label="$t('RR0051')")
        div(class="flex items-center gap-x-3")
          f-input-text(
            v-model:textValue="material.publicPrice.sampleLeadTime"
            class="w-50"
            :customErrorMsg="invalidation.publicPriceSampleLeadTime"
          )
          p(class="text-body2 text-grey-900 font-bold") {{ $t("RR0050") }}
      div(class="-mx-15 bg-grey-50 px-15 py-12.5 grid gap-y-7.5")
        h6(class="text-h6 text-grey-600 font-bold") {{ $t("DD0019") }}
        f-input-select(
          v-model:selectValue="material.privatePrice.countryCode"
          :optionList="countryList"
          :label="$t('RR0042')"
          :placeholder="$t('DD0016')"
          keyOptionDisplay="name"
          keyOptionValue="countryCode"
          searchBox
        )
        f-input-container(:label="$t('RR0043')")
          div(class="flex items-center gap-x-3")
            f-input-select(
              v-model:selectValue="material.privatePrice.currency"
              :optionList="currencyList"
              keyOptionDisplay="currency"
              keyOptionValue="currency"
              class="w-25"
            )
            f-input-text(
              v-model:textValue="material.privatePrice.price"
              inputType="number"
              class="w-50"
              :customErrorMsg="invalidation.privatePricePrice"
            )
            f-input-select(
              v-model:selectValue="material.privatePrice.unit"
              :optionList="inventoryUnitList"
              keyOptionDisplay="unit"
              keyOptionValue="unit"
              class="w-25"
            )
        f-input-container(:label="$t('RR0047')")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.privatePrice.minimumOrderQuantity"
              inputType="number"
              class="w-50"
              :customErrorMsg="invalidation.privatePriceMinimumOrderQuantity"
            )
            f-input-select(
              v-model:selectValue="material.privatePrice.minimumOrderQuantityUnit"
              :optionList="inventoryUnitList"
              keyOptionDisplay="unit"
              keyOptionValue="unit"
              class="w-25"
            )
        f-input-container(:label="$t('RR0048')")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.privatePrice.minimumContainerQuantity"
              inputType="number"
              class="w-50"
              :customErrorMsg="invalidation.privatePriceMinimumContainerQuantity"
            )
            f-input-select(
              v-model:selectValue="material.privatePrice.minimumContainerQuantityUnit"
              :optionList="inventoryUnitList"
              keyOptionDisplay="unit"
              keyOptionValue="unit"
              class="w-25"
            )
        f-input-container(:label="$t('RR0049')")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.privatePrice.productionLeadTime"
              class="w-50"
              :customErrorMsg="invalidation.privatePriceProductionLeadTime"
            )
            p(class="text-body2 text-grey-900 font-bold") {{ $t("RR0050") }}
        f-input-container(:label="$t('RR0051')")
          div(class="flex items-center gap-x-3")
            f-input-text(
              v-model:textValue="material.privatePrice.sampleLeadTime"
              class="w-50"
              :customErrorMsg="invalidation.privatePriceSampleLeadTime"
            )
            p(class="text-body2 text-grey-900 font-bold") {{ $t("RR0050") }}
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { INVENTORY_UNIT } from '@/utils/constants'
import useMaterialEdit from '@/composables/useMaterialEdit'

export default {
  name: 'BlockMaterialPricing',
  props: {
    invalidation: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const material = computed(() => store.getters['assets/material'])
    const countryList = computed(() => store.getters['code/countryList'])

    const { inventoryUnitList, currencyList } = useMaterialEdit(material.value)

    watch(
      () => material.value,
      () => {
        store.commit('assets/UPDATE_material', material.value)
      },
      {
        deep: true
      }
    )

    return {
      countryList,
      material,
      INVENTORY_UNIT,
      inventoryUnitList,
      currencyList
    }
  }
}
</script>
