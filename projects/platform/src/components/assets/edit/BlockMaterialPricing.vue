<template lang="pug">
f-expansion-panel(class="border-b border-grey-200")
  template(#trigger="{ isExpand }")
    div(class="h-15 flex items-center justify-between")
      h5(class="text-h5 text-grey-900 font-bold") {{ $t('DD0025') }}
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
      f-input-text(
        :label="$t('RR0043')"
        v-model:textValue="material.publicPrice.price"
        inputType="number"
        class="w-50"
        :hintError="invalidation.publicPricePrice"
        :addOnLeft="$t('RR0044')"
        :addOnRight="INVENTORY_UNIT.Y"
      )
      f-input-text(
        v-model:textValue="material.publicPrice.minimumOrderQuantity"
        inputType="number"
        :label="$t('RR0047')"
        class="w-50"
        :hintError="invalidation.publicPriceMinimumOrderQuantity"
        v-model:rightSelectValue="material.publicPrice.minimumOrderQuantityUnit"
        :rightDropdownOption="inventoryUnitList"
      )
        template(#slot:right-dropdown-trigger="{ selectedMenu }")
          p {{ selectedMenu?.title }}
      f-input-text(
        v-model:textValue="material.publicPrice.minimumContainerQuantity"
        inputType="number"
        :label="$t('RR0048')"
        class="w-50"
        :hintError="invalidation.publicPriceMinimumContainerQuantity"
        v-model:rightSelectValue="material.publicPrice.minimumContainerQuantityUnit"
        :rightDropdownOption="inventoryUnitList"
      )
        template(#slot:right-dropdown-trigger="{ selectedMenu }")
          p {{ selectedMenu?.title }}
      f-input-text(
        :label="$t('RR0049')"
        v-model:textValue="material.publicPrice.productionLeadTime"
        class="w-50"
        :hintError="invalidation.publicPriceProductionLeadTime"
        :addOnRight="$t('RR0050')"
      )
      f-input-text(
        :label="$t('RR0051')"
        v-model:textValue="material.publicPrice.sampleLeadTime"
        class="w-50"
        :hintError="invalidation.publicPriceSampleLeadTime"
        :addOnRight="$t('RR0050')"
      )
      div(class="-mx-15 bg-grey-50 px-15 py-12.5 grid gap-y-7.5")
        h6(class="text-h6 text-grey-600 font-bold") {{ $t('DD0019') }}
        f-input-select(
          v-model:selectValue="material.privatePrice.countryCode"
          :optionList="countryList"
          :label="$t('RR0042')"
          :placeholder="$t('DD0016')"
          keyOptionDisplay="name"
          keyOptionValue="countryCode"
          searchBox
        )
        f-input-text(
          v-model:textValue="material.privatePrice.price"
          inputType="number"
          :label="$t('RR0043')"
          class="w-70"
          :hintError="invalidation.privatePricePrice"
          v-model:leftSelectValue="material.privatePrice.currency"
          :leftDropdownOption="currencyList"
          v-model:rightSelectValue="material.privatePrice.unit"
          :rightDropdownOption="inventoryUnitList"
        )
          template(#slot:left-dropdown-trigger="{ selectedMenu }")
            p {{ selectedMenu?.title }}
          template(#slot:right-dropdown-trigger="{ selectedMenu }")
            p {{ selectedMenu?.title }}
        f-input-text(
          v-model:textValue="material.privatePrice.minimumOrderQuantity"
          inputType="number"
          :label="$t('RR0047')"
          class="w-50"
          :hintError="invalidation.privatePriceMinimumOrderQuantity"
          v-model:rightSelectValue="material.privatePrice.minimumOrderQuantityUnit"
          :rightDropdownOption="inventoryUnitList"
        )
          template(#slot:right-dropdown-trigger="{ selectedMenu }")
            p {{ selectedMenu?.title }}
        f-input-text(
          v-model:textValue="material.privatePrice.minimumContainerQuantity"
          inputType="number"
          :label="$t('RR0048')"
          class="w-50"
          :hintError="invalidation.privatePriceMinimumContainerQuantity"
          v-model:rightSelectValue="material.privatePrice.minimumContainerQuantityUnit"
          :rightDropdownOption="inventoryUnitList"
        )
          template(#slot:right-dropdown-trigger="{ selectedMenu }")
            p {{ selectedMenu?.title }}
        f-input-text(
          :label="$t('RR0049')"
          v-model:textValue="material.privatePrice.productionLeadTime"
          class="w-50"
          :hintError="invalidation.privatePriceProductionLeadTime"
          :addOnRight="$t('RR0050')"
        )
        f-input-text(
          :label="$t('RR0051')"
          v-model:textValue="material.privatePrice.sampleLeadTime"
          class="w-50"
          :hintError="invalidation.privatePriceSampleLeadTime"
          :addOnRight="$t('RR0050')"
        )
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
      required: true,
    },
  },
  setup() {
    const store = useStore()
    const material = computed(() => store.getters['assets/material'])
    const countryList = computed(() => store.getters['code/countryList'])

    const { inventoryUnitList, currencyList } = useMaterialEdit()

    watch(
      () => material.value,
      () => {
        store.commit('assets/UPDATE_material', material.value)
      },
      {
        deep: true,
      }
    )

    return {
      countryList,
      material,
      INVENTORY_UNIT,
      inventoryUnitList,
      currencyList,
    }
  },
}
</script>
