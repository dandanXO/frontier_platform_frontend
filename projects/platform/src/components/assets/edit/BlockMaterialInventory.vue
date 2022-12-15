<template lang="pug">
f-expansion-panel(class="border-b border-grey-200")
  template(#trigger="{ isExpand }")
    div(class="h-15 flex items-center justify-between")
      h5(class="text-h5 text-grey-900 font-bold") {{ $t('DD0021') }}
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="20"
        class="transform text-grey-900"
        :class="[isExpand ? '-rotate-90' : 'rotate-90']"
      )
  template(#content)
    div(class="bg-grey-50 px-15 py-12.5 mb-15 grid gap-y-7.5")
      h6(class="text-h6 text-grey-600 font-bold") {{ $t('DD0019') }}
      f-input-text(
        v-model:textValue="material.materialSeq"
        :label="$t('RR0030')"
        :placeholder="$t('DD0022')"
      )
      f-input-container(:label="`${$t('RR0031')} / ${$t('RR0032')}`")
        div(class="flex items-center gap-x-3")
          f-input-text(
            v-model:textValue="material.sampleCardsRemainingQty"
            :hintError="invalidation.sampleCardsRemainingQty"
            inputType="number"
            class="w-50"
          )
          f-svg-icon(iconName="slash" size="20" class="text-grey-900")
          f-input-text(
            v-model:textValue="material.sampleCardsLocation"
            :hintError="invalidation.sampleCardsLocation"
            class="w-50"
          )
      f-input-container(:label="`${$t('RR0033')} / ${$t('RR0032')}`")
        div(class="flex items-center gap-x-3")
          f-input-text(
            v-model:textValue="material.hangersRemainingQty"
            :hintError="invalidation.hangersRemainingQty"
            inputType="number"
            class="w-50"
          )
          f-svg-icon(iconName="slash" size="20" class="text-grey-900")
          f-input-text(
            v-model:textValue="material.hangersLocation"
            :hintError="invalidation.hangersLocation"
            class="w-50"
          )
      h6(class="text-h6 text-grey-600 font-bold") {{ $t('DD0023') }}
      f-input-container(:label="$t('RR0034')")
        div(class="flex items-center gap-x-3")
          f-input-text(
            :textValue="`${immediateTotalInventoryQty} ${INVENTORY_UNIT.Y}`"
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
        div(
          v-for="(inventory, index) in material.inventoryList"
          class="flex items-center gap-x-3"
          :style="{ zIndex: material.inventoryList.length - index }"
        )
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
            v-model:rightSelectValue="inventory.unit"
            @update:rightSelectValue="updateInventoryListUnit"
            :rightDropdownOption="inventoryUnitList"
          )
            template(#slot:right-dropdown-trigger="{ selectedMenu }")
              p {{ selectedMenu.title }}
          f-svg-icon(
            v-if="index === 0"
            size="20"
            iconName="add_box"
            class="text-grey-600 ml-4.5 mt-5.5"
            @click="addNewInventory"
          )
          f-svg-icon(
            v-else
            size="20"
            iconName="delete"
            class="text-grey-600 ml-4.5"
            @click="removeInventory(index)"
          )
        p(
          v-if="invalidation.inventoryList"
          class="bottom-0 transform translate-y-full text-caption text-red-400 absolute pt-1"
        ) {{ invalidation.inventoryList }}
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch } from 'vue'
import { INVENTORY_UNIT } from '@/utils/constants'
import useMaterialEdit from '@/composables/useMaterialEdit'

export default {
  name: 'BlockMaterialInventory',
  props: {
    invalidation: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const store = useStore()
    const material = computed(() => store.getters['assets/material'])
    const immediateTotalInventoryQty = computed(
      () => store.getters['assets/immediateTotalInventoryQty']
    )

    const {
      inventoryUnitList,
      addNewInventory,
      removeInventory,
      updateInventoryListUnit,
    } = useMaterialEdit()

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
      material,
      inventoryUnitList,
      addNewInventory,
      removeInventory,
      immediateTotalInventoryQty,
      INVENTORY_UNIT,
      updateInventoryListUnit,
    }
  },
}
</script>
