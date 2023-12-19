<template lang="pug">
div(class="flex flex-col gap-y-10")
  div(class="flex flex-col gap-y-4")
    div(class="flex flex-col gap-y-3")
      p(class="text-body2 text-grey-800") Total Quantity
      div(class="flex flex-row items-center gap-x-4")
        f-input-text(
          class="w-50"
          :textValue="totalInventoryQtyInY"
          disabled
          :clearable="false"
          :addOnRight="MaterialQuantityUnit.Y"
        )
        f-input-switch(
          :inputValue="isTotalPublic.value"
          @update:inputValue="isTotalPublic.onInput"
          :label="$t('DD0024')"
          iconSize="20"
        )
    f-infobar(
      class="w-130"
      :notifyType="NOTIFY_TYPE.TIPS"
      messageText="You have to fill in the width and weight of the specification first, then enter the quantity of yardage remaining & location to get the correct value."
    )
  div(class="bg-grey-50 rounded px-15 py-12.5 mb-15 grid gap-y-7.5")
    h6(class="text-h6 text-grey-600 font-bold") {{ $t('DD0019') }}
    f-input-text(
      class="w-100"
      :textValue="nativeCode.value"
      @update:textValue="nativeCode.onInput"
      :label="$t('RR0030')"
      :placeholder="$t('DD0022')"
    )
    f-input-container(:label="`${$t('RR0031')}`")
      div(class="flex flex-col gap-y-3")
        div(
          v-for="(field, index) in sampleCardsRemainingFields"
          class="flex items-center gap-x-3"
        )
          f-input-text(
            v-model:textValue="field.value.source"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].source`])"
            :label="index === 0 ? 'source' : ''"
            placeholder="Info"
            class="w-18"
          )
          f-input-text(
            v-model:textValue="field.value.qtyInPcs"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].qtyInPcs`])"
            inputType="number"
            :label="index === 0 ? 'quantity' : ''"
            placeholder="1-999"
            class="w-37"
            addOnRight="pcs"
          )
          div(class="flex flex-row gap-x-1")
            f-input-text(
              v-model:textValue="field.value.shelf1"
              :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].shelf1`])"
              :label="index === 0 ? $t('RR0036') : ''"
              placeholder="Info"
              class="w-14"
            )
            f-input-text(
              v-model:textValue="field.value.shelf2"
              :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].shelf2`])"
              :label="index === 0 ? 'Shelf2' : ''"
              placeholder="Info"
              class="w-14"
            )
          f-input-text(
            v-model:textValue="field.value.location"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].location`])"
            :label="index === 0 ? $t('RR0032') : ''"
            placeholder="Enter info"
            class="w-30"
          )
          f-svg-icon(
            size="20"
            iconName="delete"
            class="text-grey-600 cursor-pointer"
            @click="() => removeSampleCardsRemainingField(index)"
          )
        f-svg-icon(
          size="24"
          iconName="add"
          @click="() => pushSampleCardsRemainingField({ qtyInPcs: null, location: null, source: null, shelf1: null, shelf2: null })"
        )
      f-infobar(
        v-if="sampleCardsRemainingAllErrors.length"
        :notifyType="NOTIFY_TYPE.CRITICAL"
      )
        p(v-for="errors in sampleCardsRemainingAllErrors") {{ errors }}
    f-input-container(:label="`${$t('RR0033')}`")
      div(class="flex flex-col gap-y-3")
        div(
          v-for="(field, index) in hangersRemainingFields"
          class="flex items-center gap-x-3"
        )
          f-input-text(
            v-model:textValue="field.value.source"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].source`])"
            :label="index === 0 ? 'source' : ''"
            placeholder="Info"
            class="w-18"
          )
          f-input-text(
            v-model:textValue="field.value.qtyInPcs"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].qtyInPcs`])"
            inputType="number"
            :label="index === 0 ? 'quantity' : ''"
            placeholder="1-999"
            class="w-37"
            addOnRight="pcs"
          )
          div(class="flex flex-row gap-x-1")
            f-input-text(
              v-model:textValue="field.value.shelf1"
              :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].shelf1`])"
              :label="index === 0 ? $t('RR0036') : ''"
              placeholder="Info"
              class="w-14"
            )
            f-input-text(
              v-model:textValue="field.value.shelf2"
              :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].shelf2`])"
              :label="index === 0 ? 'Shelf2' : ''"
              placeholder="Info"
              class="w-14"
            )
          f-input-text(
            v-model:textValue="field.value.location"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.hangersRemainingList[${index}].location`])"
            :label="index === 0 ? $t('RR0032') : ''"
            placeholder="Enter info"
            class="w-30"
          )
          f-svg-icon(
            size="20"
            iconName="delete"
            class="text-grey-600 cursor-pointer"
            @click="() => removeHangersRemainingField(index)"
          )
        f-svg-icon(
          size="24"
          iconName="add"
          @click="() => pushHangersRemainingField({ qtyInPcs: null, location: null, source: null, shelf1: null, shelf2: null })"
        )
      f-infobar(
        v-if="hangersRemainingAllErrors.length"
        :notifyType="NOTIFY_TYPE.CRITICAL"
      )
        p(v-for="errors in hangersRemainingAllErrors") {{ errors }}
    f-input-container(:label="$t('DD0023')")
      div(class="grid gap-y-3")
        div(
          v-for="(field, index) in yardageRemainingInfoFields"
          class="flex items-center gap-x-3"
          :style="{ zIndex: yardageRemainingInfoFields.length - index }"
        )
          f-input-text(
            v-model:textValue="field.value.productionNo"
            :label="index === 0 ? 'production#' : ''"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].productionNo`])"
            placeholder="Enter info"
            class="w-40"
          )
          f-input-text(
            v-model:textValue="field.value.source"
            :label="index === 0 ? 'source' : ''"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].source`])"
            placeholder="Info"
            class="w-18"
          )
          f-input-text(
            v-model:textValue="field.value.roll"
            :label="index === 0 ? 'Roll#' : ''"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].roll`])"
            placeholder="Info"
            class="w-18"
          )
          f-input-text(
            v-model:textValue="field.value.lot"
            :label="index === 0 ? 'Lot#' : ''"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].lot`])"
            placeholder="Info"
            class="w-18"
          )
          f-input-text(
            v-model:textValue="field.value.qty"
            :label="index === 0 ? 'Quantity' : ''"
            class="w-40"
            inputType="number"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].qty`])"
            placeholder="1-999,999"
            :rightSelectValue="yardageRemainingInfoUnit.value"
            @update:rightSelectValue="yardageRemainingInfoUnit.onInput"
            :rightDropdownOption="inventoryUnitList"
          )
            template(#slot:right-dropdown-trigger="{ selectedMenu }")
              p {{ selectedMenu?.title }}
          div(class="flex flex-row gap-x-1")
            f-input-text(
              v-model:textValue="field.value.shelf1"
              :label="index === 0 ? $t('RR0036') : ''"
              :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].shelf1`])"
              placeholder="Info"
              class="w-14"
            )
            f-input-text(
              v-model:textValue="field.value.shelf2"
              :label="index === 0 ? $t('RR0036') : ''"
              :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].shelf2`])"
              placeholder="Info"
              class="w-14"
            )
          f-input-text(
            v-model:textValue="field.value.location"
            :label="index === 0 ? $t('RR0032') : ''"
            :hintError="Boolean(displayErrors[`internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].location`])"
            placeholder="Enter info"
            class="w-30"
          )
          f-svg-icon(
            size="24"
            iconName="delete"
            @click="() => removeYardageRemainingInfoField(index)"
          )
        f-svg-icon(
          size="24"
          iconName="add"
          @click="pushYardageRemainingInfoField({ productionNo: null, location: null, source: null, shelf1: null, shelf2: null, roll: null, lot: null, qty: null })"
        )
        f-infobar(
          v-if="yardageRemainingInfoAllErrors.length"
          :notifyType="NOTIFY_TYPE.CRITICAL"
        )
          p(v-for="errors in yardageRemainingInfoAllErrors") {{ errors }}
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
const { inputMenu, defineInputBinds, displayErrors, totalInventoryQtyInY } =
  materialFormService
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

const sampleCardsRemainingAllErrors = computed(() => {
  let sourceError: string | null = null
  let qtyInPcsError: string | null = null
  let shelf1Error: string | null = null
  let shelf2Error: string | null = null
  let locationError: string | null = null

  for (let i = 0; i < sampleCardsRemainingFields.value.length; i++) {
    const rowSourceError = displayErrors.value[
      `internalInfo.inventoryInfo.sampleCardsRemainingList[${i}].source`
    ] as string
    const rowQtyValueError = displayErrors.value[
      `internalInfo.inventoryInfo.sampleCardsRemainingList[${i}].qtyInPcs`
    ] as string
    const rowShelf1Error = displayErrors.value[
      `internalInfo.inventoryInfo.sampleCardsRemainingList[${i}].shelf1`
    ] as string
    const rowShelf2Error = displayErrors.value[
      `internalInfo.inventoryInfo.sampleCardsRemainingList[${i}].shelf2`
    ] as string
    const rowLocationError = displayErrors.value[
      `internalInfo.inventoryInfo.sampleCardsRemainingList[${i}].location`
    ] as string

    if (rowSourceError && !sourceError) {
      sourceError = rowSourceError
    }
    if (rowShelf1Error && !shelf1Error) {
      shelf1Error = rowShelf1Error
    }
    if (rowShelf2Error && !shelf2Error) {
      shelf2Error = rowShelf2Error
    }
    if (rowLocationError && !locationError) {
      locationError = `Location : ${rowLocationError}`
    }
    if (rowQtyValueError && !qtyInPcsError) {
      qtyInPcsError = `Quantity : ${rowQtyValueError}`
    }
  }

  const errorKeys = [
    sourceError && 'Source',
    shelf1Error && 'Shelf1',
    shelf2Error && 'Shelf2',
  ].filter((e) => !!e)

  const sourceAndShelfError = errorKeys.length
    ? `${errorKeys.join('/')} : ${sourceError || shelf1Error || shelf2Error}`
    : null

  return [sourceAndShelfError, locationError, qtyInPcsError].filter((e) => !!e)
})

const {
  fields: hangersRemainingFields,
  push: pushHangersRemainingField,
  remove: removeHangersRemainingField,
} = useFieldArray<MaterialInternalInventoryInfoSampleCardsRemainingListInner>(
  'internalInfo.inventoryInfo.hangersRemainingList'
)

const hangersRemainingAllErrors = computed(() => {
  let sourceError: string | null = null
  let qtyInPcsError: string | null = null
  let shelf1Error: string | null = null
  let shelf2Error: string | null = null
  let locationError: string | null = null

  for (let i = 0; i < sampleCardsRemainingFields.value.length; i++) {
    const rowSourceError = displayErrors.value[
      `internalInfo.inventoryInfo.hangersRemainingList[${i}].source`
    ] as string
    const rowQtyValueError = displayErrors.value[
      `internalInfo.inventoryInfo.hangersRemainingList[${i}].qtyInPcs`
    ] as string
    const rowShelf1Error = displayErrors.value[
      `internalInfo.inventoryInfo.hangersRemainingList[${i}].shelf1`
    ] as string
    const rowShelf2Error = displayErrors.value[
      `internalInfo.inventoryInfo.hangersRemainingList[${i}].shelf2`
    ] as string
    const rowLocationError = displayErrors.value[
      `internalInfo.inventoryInfo.hangersRemainingList[${i}].location`
    ] as string

    if (rowSourceError && !sourceError) {
      sourceError = rowSourceError
    }
    if (rowShelf1Error && !shelf1Error) {
      shelf1Error = rowShelf1Error
    }
    if (rowShelf2Error && !shelf2Error) {
      shelf2Error = rowShelf2Error
    }
    if (rowLocationError && !locationError) {
      locationError = `Location : ${rowLocationError}`
    }
    if (rowQtyValueError && !qtyInPcsError) {
      qtyInPcsError = `Quantity : ${rowQtyValueError}`
    }
  }

  const errorKeys = [
    sourceError && 'Source',
    shelf1Error && 'Shelf1',
    shelf2Error && 'Shelf2',
  ].filter((e) => !!e)

  const sourceAndShelfError = errorKeys.length
    ? `${errorKeys.join('/')} : ${sourceError || shelf1Error || shelf2Error}`
    : null

  return [sourceAndShelfError, locationError, qtyInPcsError].filter((e) => !!e)
})

const {
  fields: yardageRemainingInfoFields,
  push: pushYardageRemainingInfoField,
  remove: removeYardageRemainingInfoField,
} = useFieldArray<MaterialInternalInventoryInfoYardageRemainingInfo['list'][0]>(
  'internalInfo.inventoryInfo.yardageRemainingInfo.list'
)

const yardageRemainingInfoAllErrors = computed(() => {
  let productionNoError: string | null = null
  let sourceError: string | null = null
  let rollError: string | null = null
  let lotError: string | null = null
  let qtyValueError: string | null = null
  let shelf1Error: string | null = null
  let shelf2Error: string | null = null
  let locationError: string | null = null

  for (let i = 0; i < sampleCardsRemainingFields.value.length; i++) {
    const rowProductionNoError = displayErrors.value[
      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${i}].productionNo`
    ] as string
    const rowSourceError = displayErrors.value[
      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${i}].source`
    ] as string
    const rowRollError = displayErrors.value[
      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${i}].roll`
    ] as string
    const rowLotError = displayErrors.value[
      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${i}].lot`
    ] as string
    const rowQtyValueError = displayErrors.value[
      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${i}].qty`
    ] as string
    const rowShelf1Error = displayErrors.value[
      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${i}].shelf1`
    ] as string
    const rowShelf2Error = displayErrors.value[
      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${i}].shelf2`
    ] as string
    const rowLocationError = displayErrors.value[
      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${i}].location`
    ] as string

    if (rowProductionNoError && !productionNoError) {
      productionNoError = `Production#: ${rowProductionNoError}`
    }
    if (rowSourceError && !sourceError) {
      sourceError = rowSourceError
    }
    if (rowRollError && !rollError) {
      rollError = rowRollError
    }
    if (rowLotError && !lotError) {
      lotError = rowLotError
    }
    if (rowShelf1Error && !shelf1Error) {
      shelf1Error = rowShelf1Error
    }
    if (rowShelf2Error && !shelf2Error) {
      shelf2Error = rowShelf2Error
    }
    if (rowLocationError && !locationError) {
      locationError = `Location : ${rowLocationError}`
    }
    if (rowQtyValueError && !qtyValueError) {
      qtyValueError = `Quantity : ${rowQtyValueError}`
    }
  }

  const errorKeys = [
    sourceError && 'Source',
    rollError && 'Roll#',
    lotError && 'Lot#',
    shelf1Error && 'Shelf1',
    shelf2Error && 'Shelf2',
  ].filter((e) => !!e)

  const sourceRollLotShelfError = errorKeys.length
    ? `${errorKeys.join('/')} : ${
        sourceError || rollError || lotError || shelf1Error || shelf2Error
      }`
    : null

  return [
    sourceRollLotShelfError,
    productionNoError,
    locationError,
    qtyValueError,
  ].filter((e) => !!e)
})
</script>
