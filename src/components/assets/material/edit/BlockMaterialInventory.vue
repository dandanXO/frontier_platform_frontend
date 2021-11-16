<template lang="pug">
dropdown(:closeAfterSelect="false" :closeAfterOutsideClick="false" class="border-b border-black-400")
  template(#displayItem="{ isExpand }")
    div(class="h-15 flex items-center justify-between")
      h5(class="text-h5 text-primary font-bold") {{$t('DD0021')}}
      svg-icon(
        iconName="arrow-down"
        size="20"
        class="transform text-primary"
        :class="[ isExpand ? '-rotate-90' :'rotate-90']"
      )
  template(#dropdownList)
    div(class="bg-black-100 px-15 py-12.5 mb-15 grid gap-y-7.5")
      h6(class="text-h6 text-black-600 font-bold") {{$t('DD0019')}}
      input-text(
        v-model:textValue="material.materialSeq"
        :label="$t('RR0030')"
        :placeholder="$t('DD0022')"
      )
      input-container(:label="`${$t('RR0031')} / ${$t('RR0032')}`")
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="material.sampleCardsRemainingQty"
            :customErrorMsg="validations.sampleCardsRemainingQty"
            inputType="number"
            class="w-50"
          )
          svg-icon(iconName="slash" size="20" class="text-primary")
          input-text(
            v-model:textValue="material.sampleCardsLocation"
            :customErrorMsg="validations.sampleCardsLocation"
            class="w-50"
          )
      input-container(:label="`${$t('RR0033')} / ${$t('RR0032')}`")
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="material.hangersRemainingQty"
            :customErrorMsg="validations.hangersRemainingQty"
            inputType="number"
            class="w-50"
          )
          svg-icon(iconName="slash" size="20" class="text-primary")
          input-text(
            v-model:textValue="material.hangersLocation"
            :customErrorMsg="validations.hangersLocation"
            class="w-50"
          )
      h6(class="text-h6 text-black-600 font-bold") {{$t('DD0023')}}
      input-container(:label="$t('RR0034')")
        div(class="flex items-center gap-x-3")
          input-text(
            :textValue="`${totalInventory} ${INVENTORY_UNIT.Y}`"
            class="w-50"
            disabled
            :clearable="false"
          )
          input-checkbox(
            v-model:inputValue="material.isPublicInventory"
            :label="$t('DD0024')"
            binary
            size="20"
          )
      div(class="grid gap-y-3 relative")
        div(v-for="(inventory, index) in material.inventoryList" class="flex items-center gap-x-3 relative" :class="`z-${material.inventoryList.length - index}`")
          input-text(
            v-model:textValue="inventory.section"
            :label="index === 0 ? $t('RR0035') :''"
            class="w-50"
          )
          input-text(
            v-model:textValue="inventory.shelf"
            :label="index === 0 ? $t('RR0036') :''"
            class="w-50"
          )
          input-text(
            v-model:textValue="inventory.quantity"
            inputType="number"
            :label="index === 0 ? $t('RR0037') :''"
            class="w-50"
          )
          input-select(
            v-model:selectValue="material.inventoryUnit"
            :label="index === 0 ? $t('RR0038') :''"
            :options="inventoryUnitList"
            keyOptionDisplay="unit"
            keyOptionValue="unit"
            class="w-25"
          )
          svg-icon(v-if="index === 0" size="20" iconName="add_box" class="text-black-700 ml-4.5 mt-5.5" @click="addNewInventory")
          svg-icon(v-else size="20" iconName="delete" class="text-black-700 ml-4.5" @click="removeInventory(index)")
        p(v-if="validations.inventoryList" class="bottom-0 transform translate-y-full text-caption text-warn absolute pt-1") {{validations.inventoryList}}
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch } from 'vue'
import { INVENTORY_UNIT } from '@/utils/constants'
import useMaterialEdit from '@/composables/useMaterialEdit'

export default {
  name: 'BlockMaterialInventory',
  props: {
    validations: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const material = computed(() => store.getters['material/material'])

    const {
      inventoryUnitList,
      addNewInventory,
      removeInventory,
      totalInventory
    } = useMaterialEdit(material.value)

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
      inventoryUnitList,
      addNewInventory,
      removeInventory,
      totalInventory,
      INVENTORY_UNIT
    }
  }
}
</script>
