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
      :dropdownMenuTree="countryMenuTree"
      :label="$t('RR0042')"
      :placeholder="$t('DD0016')"
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
</template>

<script setup>
import { computed, watch } from 'vue'
import { INVENTORY_UNIT } from '@/utils/constants'
import { useStore } from 'vuex'
import useMaterialEdit from '@/composables/useMaterialEdit'
import useMaterialValidation from '@/composables/useMaterialValidation'

const store = useStore()
const countryMenuTree = computed(() => store.getters['code/countryMenuTree'])
const material = computed(() => store.getters['assets/material'])
const { invalidation, validate } = useMaterialValidation(material, [
  'publicPricePrice',
  'publicPriceMinimumOrderQuantity',
  'publicPriceMinimumContainerQuantity',
  'publicPriceProductionLeadTime',
  'publicPriceSampleLeadTime',
])
const { inventoryUnitList } = useMaterialEdit()

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
