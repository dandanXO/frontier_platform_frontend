<template lang="pug">
modal-behavior(
  :header="`${material.materialNo} - ${$t('RR0135')}`"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="updateMaterialSimpleInventory"
  @click:secondary="$store.dispatch('helper/closeModal')"
)
  div(class="min-w-200 bg-grey-50 px-7.5 py-7.5 grid gap-y-7.5")
    h6(class="text-h6 text-grey-600 font-bold") {{ $t('DD0019') }}
    f-input-container(:label="`${$t('RR0031')} / ${$t('RR0032')}`")
      div(class="flex items-center gap-x-3")
        f-input-text(
          v-model:textValue="material.sampleCardsRemainingQty"
          inputType="number"
          :hintError="invalidation.sampleCardsRemainingQty"
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
          inputType="number"
          :hintError="invalidation.hangersRemainingQty"
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
        class="flex items-center gap-x-3 relative"
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

<script setup>
import { useStore } from 'vuex'
import { computed, watch } from 'vue'
import { INVENTORY_UNIT } from '@/utils/constants'
import useMaterialEdit from '@/composables/useMaterialEdit'
import useMaterialValidation from '@/composables/useMaterialValidation'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const material = computed(() => store.getters['assets/material'])
const immediateTotalInventoryQty = computed(
  () => store.getters['assets/immediateTotalInventoryQty']
)
const { invalidation, validate } = useMaterialValidation(material, [
  'sampleCardsRemainingQty',
  'sampleCardsLocation',
  'hangersRemainingQty',
  'hangersLocation',
  'inventoryList',
])

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

const updateMaterialSimpleInventory = async () => {
  if (!validate()) {
    return
  }
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('assets/updateMaterialSimpleInventory')
  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
  notify.showNotifySnackbar({ messageText: t('EE0164') })
}

await store.dispatch('assets/getMaterialOptions')
</script>
