<template lang="pug">
div(class="flex flex-col gap-y-10")
  div(class="flex flex-col gap-y-4")
    div(class="flex flex-col gap-y-3")
      div(class="flex flex-row items-center gap-x-1")
        span(class="text-body2 text-grey-800") {{ $t('RR0034') }}
        f-tooltip-standard(:tooltipMessage="$t('MI0058')")
          template(#slot:tooltip-trigger)
            f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
      div(class="flex flex-row items-center gap-x-4")
        f-input-text(
          class="w-50"
          :textValue="totalInventoryQtyInY"
          disabled
          :clearable="false"
          :addOnRight="inventoryUnit"
        )
        f-input-switch(
          :inputValue="isTotalPublic.value"
          @update:inputValue="isTotalPublic.onInput"
          :label="$t('MI0025')"
          iconSize="20"
        )
    f-infobar(class="w-130" :notifyType="NOTIFY_TYPE.TIPS" :messageText="$t('MI0059')")
  div(class="bg-grey-50 rounded px-15 py-12.5 mb-15 grid gap-y-7.5")
    h6(class="text-h6 text-grey-600 font-bold") {{ $t('RR0289') }}
    f-input-text(
      class="w-100"
      :textValue="nativeCode.value"
      @update:textValue="nativeCode.onInput"
      :hintError="displayErrors[`internalInfo.nativeCode`]"
      :label="$t('RR0030')"
      :placeholder="$t('MI0060')"
    )
    f-input-container(:label="$t('RR0031')")
      div(class="flex flex-col gap-y-4")
        div(
          v-for="(field, index) in sampleCardsRemainingFields"
          :key="field.key"
          class="flex flex-row gap-x-3"
        )
          div(
            class="flex-1 rounded-xl p-7.5 bg-grey-100 flex flex-col items-start gap-y-7.5"
          )
            f-input-text(
              class="w-full"
              v-model:textValue="field.value.source"
              :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].source`]"
              :label="$t('MI0061')"
              :placeholder="$t('MI0092')"
            )
            f-input-text(
              class="w-58"
              v-model:textValue="field.value.qtyInPcs"
              :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].qtyInPcs`]"
              inputType="number"
              :label="$t('RR0037')"
              :placeholder="$t('MI0056')"
              :addOnRight="$t('RR0307')"
            )
            f-input-container(class="w-full" :label="$t('RR0036')")
              div(class="flex flex-row gap-x-3 w-full")
                f-input-text(
                  class="flex-grow"
                  v-model:textValue="field.value.shelf1"
                  :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].shelf1`]"
                  :placeholder="$t('MI0093')"
                )
                f-input-text(
                  class="flex-grow"
                  v-model:textValue="field.value.shelf2"
                  :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].shelf2`]"
                  :placeholder="$t('MI0093')"
                )
            f-input-text(
              class="w-full"
              v-model:textValue="field.value.location"
              :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].location`]"
              :label="$t('RR0032')"
              :placeholder="$t('MI0094')"
            )
          div(class="flex justify-center items-center")
            f-svg-icon(
              v-if="index === 0"
              class="text-grey-600 cursor-pointer"
              size="24"
              iconName="add_box"
              @click="pushSampleCardsRemainingField({ qtyInPcs: null, location: null, source: null, shelf1: null, shelf2: null })"
            )
            f-svg-icon(
              v-else
              class="text-grey-600 cursor-pointer"
              size="20"
              iconName="delete"
              @click="removeSampleCardsRemainingField(index)"
            )
    f-input-container(:label="$t('RR0033')")
      div(class="flex flex-col gap-y-4")
        div(
          v-for="(field, index) in hangersRemainingFields"
          :key="field.key"
          class="flex items-center gap-x-3"
        )
          div(
            class="flex-1 rounded-xl p-7.5 bg-grey-100 flex flex-col items-start gap-y-7.5"
          )
            f-input-text(
              class="w-full"
              v-model:textValue="field.value.source"
              :hintError="displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].source`]"
              :label="$t('MI0061')"
              :placeholder="$t('MI0097')"
            )
            f-input-text(
              class="w-58"
              v-model:textValue="field.value.qtyInPcs"
              :hintError="displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].qtyInPcs`]"
              inputType="number"
              :label="$t('RR0037')"
              :placeholder="$t('MI0056')"
              :addOnRight="$t('RR0307')"
            )
            f-input-container(class="w-full" :label="$t('RR0036')")
              div(class="flex flex-row gap-x-3 w-full")
                f-input-text(
                  class="flex-grow"
                  v-model:textValue="field.value.shelf1"
                  :hintError="displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].shelf1`]"
                  :placeholder="$t('MI0093')"
                )
                f-input-text(
                  class="flex-grow"
                  v-model:textValue="field.value.shelf2"
                  :hintError="displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].shelf2`]"
                  :placeholder="$t('MI0093')"
                )
            f-input-text(
              class="w-full"
              v-model:textValue="field.value.location"
              :hintError="displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].location`]"
              :label="$t('RR0032')"
              :placeholder="$t('MI0094')"
            )
          div(class="flex justify-center items-center")
            f-svg-icon(
              v-if="index === 0"
              class="text-grey-600 cursor-pointer"
              size="24"
              iconName="add_box"
              @click="() => pushHangersRemainingField({ qtyInPcs: null, location: null, source: null, shelf1: null, shelf2: null })"
            )
            f-svg-icon(
              v-else
              class="text-grey-600 cursor-pointer"
              size="20"
              iconName="delete"
              @click="() => removeHangersRemainingField(index)"
            )
    f-input-container(:label="$t('RR0296')")
      div(class="flex flex-col gap-y-4")
        div(
          v-for="(field, index) in yardageRemainingInfoFields"
          :key="field.key"
          class="flex items-center gap-x-3"
        )
          div(
            class="flex-1 rounded-xl p-7.5 bg-grey-100 flex flex-col items-start gap-y-7.5"
          )
            f-input-text(
              class="w-full"
              v-model:textValue="field.value.productionNo"
              :label="$t('MI0062')"
              :hintError="displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].productionNo`]"
              :placeholder="$t('MI0095')"
            )
            f-input-text(
              class="w-full"
              v-model:textValue="field.value.source"
              :label="$t('MI0061')"
              :hintError="displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].source`]"
              :placeholder="$t('MI0096')"
            )
            f-input-text(
              class="w-58"
              v-model:textValue="field.value.roll"
              :label="$t('MI0063')"
              :hintError="displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].roll`]"
              :placeholder="$t('MI0098')"
            )
            f-input-text(
              class="w-58"
              v-model:textValue="field.value.lot"
              :label="$t('MI0064')"
              :hintError="displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].lot`]"
              :placeholder="$t('MI0099')"
            )
            f-input-text(
              v-model:textValue="field.value.qty"
              :label="$t('RR0037')"
              class="w-66"
              inputType="number"
              :hintError="displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].qty`]"
              :placeholder="$t('MI0056')"
              :rightSelectValue="yardageRemainingInfoUnit.value"
              @update:rightSelectValue="yardageRemainingInfoUnit.onInput"
              :rightDropdownOption="inventoryUnitList"
            )
              template(#slot:right-dropdown-trigger="{ selectedMenu }")
                p {{ selectedMenu?.title }}
            f-input-container(class="w-full" :label="$t('RR0036')")
              div(class="flex flex-row gap-x-3 w-full")
                f-input-text(
                  class="flex-grow"
                  v-model:textValue="field.value.shelf1"
                  :hintError="displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].shelf1`]"
                  :placeholder="$t('MI0093')"
                )
                f-input-text(
                  class="flex-grow"
                  v-model:textValue="field.value.shelf2"
                  :hintError="displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].shelf2`]"
                  :placeholder="$t('MI0093')"
                )
            f-input-text(
              class="w-full"
              v-model:textValue="field.value.location"
              :hintError="displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].location`]"
              :label="$t('RR0032')"
              :placeholder="$t('MI0094')"
            )
          div(class="flex justify-center items-center")
            f-svg-icon(
              v-if="index === 0"
              class="text-grey-600 cursor-pointer"
              size="24"
              iconName="add_box"
              @click="pushYardageRemainingInfoField({ productionNo: null, location: null, source: null, shelf1: null, shelf2: null, roll: null, lot: null, qty: null })"
            )
            f-svg-icon(
              v-else
              class="text-grey-600 cursor-pointer"
              size="20"
              iconName="delete"
              @click="() => removeYardageRemainingInfoField(index)"
            )
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useFieldArray } from 'vee-validate'
import { NOTIFY_TYPE } from '@frontier/constants'
import {
  MaterialQuantityUnit,
  type MaterialInternalInventoryInfoSampleCardsRemainingListInner,
  type MaterialInternalInventoryInfoYardageRemainingInfo,
} from '@frontier/platform-web-sdk'
import type { MaterialFormService } from '@/types'
import { materialFormServiceKey } from '@/utils/constants'

const materialFormService = inject<MaterialFormService>(materialFormServiceKey)
if (!materialFormService) {
  throw new Error('useMaterialForm is not provided')
}
const {
  inputMenu,
  defineInputBinds,
  displayErrors,
  totalInventoryQtyInY,
  inventoryUnit,
} = materialFormService
const { inventoryUnitList } = inputMenu

const nativeCode = defineInputBinds('internalInfo.nativeCode')
const isTotalPublic = defineInputBinds(
  'internalInfo.inventoryInfo.isTotalPublic'
)

const yardageRemainingInfoUnit = defineInputBinds(
  'internalInfo.inventoryInfo.yardageRemainingInfo.unit'
)

const {
  fields: sampleCardsRemainingFields,
  push: pushSampleCardsRemainingField,
  remove: removeSampleCardsRemainingField,
} = useFieldArray<MaterialInternalInventoryInfoSampleCardsRemainingListInner>(
  'internalInfo.inventoryInfo.sampleCardsRemainingList'
)

const {
  fields: hangersRemainingFields,
  push: pushHangersRemainingField,
  remove: removeHangersRemainingField,
} = useFieldArray<MaterialInternalInventoryInfoSampleCardsRemainingListInner>(
  'internalInfo.inventoryInfo.hangersRemainingList'
)

const {
  fields: yardageRemainingInfoFields,
  push: pushYardageRemainingInfoField,
  remove: removeYardageRemainingInfoField,
} = useFieldArray<MaterialInternalInventoryInfoYardageRemainingInfo['list'][0]>(
  'internalInfo.inventoryInfo.yardageRemainingInfo.list'
)
</script>
