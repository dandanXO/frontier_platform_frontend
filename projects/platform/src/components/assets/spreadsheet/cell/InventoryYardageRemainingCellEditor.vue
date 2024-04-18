<template lang="pug">
div(class="w-150 max-h-150 p-4 flex flex-col gap-y-6 bg-grey-100 rounded overflow-y-scroll")
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
            :hintError="errors[`list[${index}].productionNo`]"
            :placeholder="$t('MI0095')"
            @enter="handleEnter"
          )
          f-input-text(
            class="w-full"
            v-model:textValue="field.value.source"
            :label="$t('MI0061')"
            :hintError="errors[`list[${index}].source`]"
            :placeholder="$t('MI0096')"
            @enter="handleEnter"
          )
          f-input-text(
            class="w-58"
            v-model:textValue="field.value.roll"
            :label="$t('MI0063')"
            :hintError="errors[`list[${index}].roll`]"
            :placeholder="$t('MI0098')"
            @enter="handleEnter"
          )
          f-input-text(
            class="w-58"
            v-model:textValue="field.value.lot"
            :label="$t('MI0064')"
            :hintError="errors[`list[${index}].lot`]"
            :placeholder="$t('MI0099')"
            @enter="handleEnter"
          )
          f-input-text(
            v-model:textValue="field.value.qty"
            :label="$t('RR0037')"
            class="w-66"
            inputType="number"
            :hintError="errors[`list[${index}].qty`]"
            :placeholder="$t('MI0056')"
            :rightSelectValue="yardageRemainingInfoUnit.value"
            @update:rightSelectValue="yardageRemainingInfoUnit.onInput"
            :rightDropdownOption="inventoryUnitList"
            @enter="handleEnter"
          )
            template(#slot:right-dropdown-trigger="{ selectedMenu }")
              p {{ selectedMenu?.title }}
          f-input-container(class="w-full" :label="`${$t('RR0036')}`")
            div(class="flex flex-row gap-x-3 w-full")
              f-input-text(
                class="flex-grow"
                v-model:textValue="field.value.shelf1"
                :hintError="errors[`list[${index}].shelf1`]"
                :placeholder="$t('MI0093')"
                @enter="handleEnter"
              )
              f-input-text(
                class="flex-grow"
                v-model:textValue="field.value.shelf2"
                :hintError="errors[`list[${index}].shelf2`]"
                :placeholder="$t('MI0093')"
                @enter="handleEnter"
              )
          f-input-text(
            class="w-full"
            v-model:textValue="field.value.location"
            :hintError="errors[`list[${index}].location`]"
            :label="$t('RR0032')"
            :placeholder="$t('MI0094')"
            @enter="handleEnter"
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
  f-button(
    type="primary"
    size="md"
    :disabled="!meta.valid"
    @click="submit"
    parentIsFlex="true"
  ) Confirm
</template>

<script lang="ts">
import { useForm, useFieldArray, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { yardageRemainingInfoSchema } from '@/composables/material/useMaterialSchema'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import type { MaterialInternalInventoryInfoYardageRemainingInfo } from '@frontier/platform-web-sdk'
import useMaterialStaticMenu from '@/composables/material/useMaterialStaticMenu'
import { useIMEComposition } from '@/components/assets/spreadsheet/utils/hooks'
import { handleEnterKeyDuringIMEComposition } from '@/components/assets/spreadsheet/utils/handlers'

interface SelectEditorParams
  extends ICellEditorParams<
    MaterialRow,
    MaterialInternalInventoryInfoYardageRemainingInfo
  > {
  title: string
  onConfirm?: (
    name: MaterialInternalInventoryInfoYardageRemainingInfo,
    rowId: string
  ) => void
}

configure({ validateOnInput: true })

export default {
  setup(props: { params: SelectEditorParams }) {
    if (props.params.value == null) {
      throw new Error('value is null or undefined')
    }
    const { values, defineInputBinds, errors, meta, validate, handleSubmit } =
      useForm({
        initialValues: props.params.value,
        validationSchema: toTypedSchema(yardageRemainingInfoSchema),
      })

    const { inventoryUnitList } = useMaterialStaticMenu()

    const submit = handleSubmit((values) => {
      props.params.onConfirm?.(values, props.params.node.id)
      props.params.api.stopEditing()
    })

    const isComposing = useIMEComposition()

    const handleEnter = (event: KeyboardEvent) =>
      handleEnterKeyDuringIMEComposition(event, isComposing, props.params)

    const getValue = () => values

    const {
      fields: yardageRemainingInfoFields,
      push: pushYardageRemainingInfoField,
      remove: removeYardageRemainingInfoField,
    } = useFieldArray<
      MaterialInternalInventoryInfoYardageRemainingInfo['list'][0]
    >('list')

    const yardageRemainingInfoUnit = defineInputBinds('unit')

    return {
      title: props.params.title,
      yardageRemainingInfoFields,
      pushYardageRemainingInfoField,
      removeYardageRemainingInfoField,
      yardageRemainingInfoUnit,
      inventoryUnitList,
      meta,
      errors,
      submit,
      getValue,
      isComposing,
      handleEnter,
    }
  },
}
</script>

<style scoped></style>
