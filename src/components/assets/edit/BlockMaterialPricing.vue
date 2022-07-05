<template lang="pug">
expansion-panel(class="border-b border-black-400")
  template(#trigger="{ isExpand }")
    div(class="h-15 flex items-center justify-between")
      h5(class="text-h5 text-primary font-bold") {{ $t("DD0025") }}
      svg-icon(
        iconName="arrow-down"
        size="20"
        class="transform text-primary"
        :class="[isExpand ? '-rotate-90' : 'rotate-90']"
      )
  template(#content)
    div(class="px-15 pt-5 mb-15 grid gap-y-7.5")
      input-select(
        v-model:selectValue="material.publicPrice.countryCode"
        :options="countryList"
        :label="$t('RR0042')"
        :placeholder="$t('DD0016')"
        keyOptionDisplay="name"
        keyOptionValue="countryCode"
        searchBox
      )
      input-container(:label="$t('RR0043')")
        div(class="flex items-center gap-x-3")
          p(class="text-body2 text-primary font-bold") {{ $t("RR0044") }}
          input-text(
            v-model:textValue="material.publicPrice.price"
            inputType="number"
            class="w-50"
            :customErrorMsg="validations.publicPricePrice"
          )
          p(class="text-body2 text-primary font-bold") {{ INVENTORY_UNIT.Y }}
      input-container(:label="$t('RR0047')")
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
      input-container(:label="$t('RR0048')")
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
          p(class="text-body2 text-primary font-bold") {{ $t("RR0050") }}
      input-container(:label="$t('RR0051')")
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="material.publicPrice.sampleLeadTime"
            class="w-50"
            :customErrorMsg="validations.publicPriceSampleLeadTime"
          )
          p(class="text-body2 text-primary font-bold") {{ $t("RR0050") }}
      div(class="-mx-15 bg-black-100 px-15 py-12.5 grid gap-y-7.5")
        h6(class="text-h6 text-black-600 font-bold") {{ $t("DD0019") }}
        input-select(
          v-model:selectValue="material.privatePrice.countryCode"
          :options="countryList"
          :label="$t('RR0042')"
          :placeholder="$t('DD0016')"
          keyOptionDisplay="name"
          keyOptionValue="countryCode"
          searchBox
        )
        input-container(:label="$t('RR0043')")
          div(class="flex items-center gap-x-3")
            input-select(
              v-model:selectValue="material.privatePrice.currency"
              :options="currencyList"
              keyOptionDisplay="currency"
              keyOptionValue="currency"
              class="w-25"
            )
            input-text(
              v-model:textValue="material.privatePrice.price"
              inputType="number"
              class="w-50"
              :customErrorMsg="validations.privatePricePrice"
            )
            input-select(
              v-model:selectValue="material.privatePrice.unit"
              :options="inventoryUnitList"
              keyOptionDisplay="unit"
              keyOptionValue="unit"
              class="w-25"
            )
        input-container(:label="$t('RR0047')")
          div(class="flex items-center gap-x-3")
            input-text(
              v-model:textValue="material.privatePrice.minimumOrderQuantity"
              inputType="number"
              class="w-50"
              :customErrorMsg="validations.privatePriceMinimumOrderQuantity"
            )
            input-select(
              v-model:selectValue="material.privatePrice.minimumOrderQuantityUnit"
              :options="inventoryUnitList"
              keyOptionDisplay="unit"
              keyOptionValue="unit"
              class="w-25"
            )
        input-container(:label="$t('RR0048')")
          div(class="flex items-center gap-x-3")
            input-text(
              v-model:textValue="material.privatePrice.minimumContainerQuantity"
              inputType="number"
              class="w-50"
              :customErrorMsg="validations.privatePriceMinimumContainerQuantity"
            )
            input-select(
              v-model:selectValue="material.privatePrice.minimumContainerQuantityUnit"
              :options="inventoryUnitList"
              keyOptionDisplay="unit"
              keyOptionValue="unit"
              class="w-25"
            )
        input-container(:label="$t('RR0049')")
          div(class="flex items-center gap-x-3")
            input-text(
              v-model:textValue="material.privatePrice.productionLeadTime"
              class="w-50"
              :customErrorMsg="validations.privatePriceProductionLeadTime"
            )
            p(class="text-body2 text-primary font-bold") {{ $t("RR0050") }}
        input-container(:label="$t('RR0051')")
          div(class="flex items-center gap-x-3")
            input-text(
              v-model:textValue="material.privatePrice.sampleLeadTime"
              class="w-50"
              :customErrorMsg="validations.privatePriceSampleLeadTime"
            )
            p(class="text-body2 text-primary font-bold") {{ $t("RR0050") }}
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { INVENTORY_UNIT } from '@/utils/constants'
import useMaterialEdit from '@/composables/useMaterialEdit'

export default {
  name: 'BlockMaterialPricing',
  props: {
    validations: {
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
