<template lang="pug">
modal-behavior(
  :header="`${material.materialNo} - ${$t('RR0134')}`"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="updateMaterialSimplePublicPrice"
  @click:secondary="$store.dispatch('helper/closeModal')"
)
  div(class="min-w-200 grid gap-y-7.5")
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
        p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0044') }}
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
        p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0050') }}
    f-input-container(:label="$t('RR0051')")
      div(class="flex items-center gap-x-3")
        f-input-text(
          v-model:textValue="material.publicPrice.sampleLeadTime"
          class="w-50"
          :customErrorMsg="invalidation.publicPriceSampleLeadTime"
        )
        p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0050') }}
</template>

<script setup>
import { computed, watch } from 'vue'
import { INVENTORY_UNIT } from '@/utils/constants'
import { useStore } from 'vuex'
import useMaterialEdit from '@/composables/useMaterialEdit'
import useMaterialValidation from '@/composables/useMaterialValidation'

const store = useStore()
const countryList = computed(() => store.getters['code/countryList'])
const material = computed(() => store.getters['assets/material'])
const { invalidation, validate } = useMaterialValidation(material)
const { inventoryUnitList } = useMaterialEdit(material.value)

watch(
  () => material.value,
  () => {
    store.commit('assets/UPDATE_material', material.value)
  },
  {
    deep: true,
  }
)

const updateMaterialSimplePublicPrice = async () => {
  if (!validate()) {
    return
  }
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('assets/updateMaterialSimplePublicPrice')
  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
}

await store.dispatch('assets/getMaterialOptions')
</script>
