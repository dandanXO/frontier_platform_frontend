<template lang="pug">
div(class="bg-black-100 px-7.5 py-7.5 grid gap-y-7.5")
  h6(class="text-h6 text-black-600 font-bold") {{ $t("DD0019") }}
  f-input-container(:label="`${$t('RR0031')} / ${$t('RR0032')}`")
    div(class="flex items-center gap-x-3")
      f-input-text(
        v-model:textValue="material.sampleCardsRemainingQty"
        :customErrorMsg="validations.sampleCardsRemainingQty"
        inputType="number"
        class="w-50"
      )
      f-svg-icon(iconName="slash" size="20" class="text-primary")
      f-input-text(
        v-model:textValue="material.sampleCardsLocation"
        :customErrorMsg="validations.sampleCardsLocation"
        class="w-50"
      )
  f-input-container(:label="`${$t('RR0033')} / ${$t('RR0032')}`")
    div(class="flex items-center gap-x-3")
      f-input-text(
        v-model:textValue="material.hangersRemainingQty"
        :customErrorMsg="validations.hangersRemainingQty"
        inputType="number"
        class="w-50"
      )
      f-svg-icon(iconName="slash" size="20" class="text-primary")
      f-input-text(
        v-model:textValue="material.hangersLocation"
        :customErrorMsg="validations.hangersLocation"
        class="w-50"
      )
  h6(class="text-h6 text-black-600 font-bold") {{ $t("DD0023") }}
  f-input-container(:label="$t('RR0034')")
    div(class="flex items-center gap-x-3")
      f-input-text(
        :textValue="`${totalInventory} ${INVENTORY_UNIT.Y}`"
        class="w-50"
        disabled
        :clearable="false"
      )
      f-input-checkbox(
        v-model:inputValue="material.isPublicInventory"
        :label="$t('DD0024')"
        binary
        iconSize="20"
      )
  div(class="grid gap-y-3")
    div(v-for="(inventory, index) in material.inventoryList" class="flex items-center gap-x-3 relative" :style="{ zIndex: material.inventoryList.length - index }")
      f-input-text(
        v-model:textValue="inventory.section"
        :label="index === 0 ? $t('RR0035') : ''"
        class="w-50"
      )
      f-input-text(
        v-model:textValue="inventory.shelf"
        :label="index === 0 ? $t('RR0036') : ''"
        class="w-50"
      )
      f-input-text(
        v-model:textValue="inventory.quantity"
        inputType="number"
        :label="index === 0 ? $t('RR0037') : ''"
        class="w-50"
      )
      f-input-select(
        v-model:selectValue="inventory.unit"
        :label="index === 0 ? $t('RR0038') : ''"
        :optionList="inventoryUnitList"
        @update:selectValue="updateInventoryListUnit"
        keyOptionDisplay="unit"
        keyOptionValue="unit"
        class="w-25"
      )
      f-svg-icon(v-if="index === 0" size="20" iconName="add_box" class="text-black-700 ml-4.5 mt-5.5" @click="addNewInventory")
      f-svg-icon(v-else size="20" iconName="delete" class="text-black-700 ml-4.5" @click="removeInventory(index)")
    p(v-if="validations.inventoryList" class="bottom-0 transform translate-y-full text-caption text-warn absolute pt-1") {{ validations.inventoryList }}
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch } from '@vue/runtime-core'
import { INVENTORY_UNIT } from '@/utils/constants'
import useMaterialEdit from '@/composables/useMaterialEdit'

export default {
  name: 'SimpleInventory',
  props: {
    validations: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const material = computed(() => store.getters['assets/material'])

    const {
      inventoryUnitList,
      addNewInventory,
      removeInventory,
      totalInventory,
      updateInventoryListUnit
    } = useMaterialEdit(material.value)

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
      material,
      inventoryUnitList,
      addNewInventory,
      removeInventory,
      totalInventory,
      INVENTORY_UNIT,
      updateInventoryListUnit
    }
  }
}
</script>
