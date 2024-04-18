<template lang="pug">
div(class="w-150 max-h-150 p-4 flex flex-col gap-y-6 bg-grey-100 rounded overflow-y-scroll")
  f-input-container(:label="title")
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
            :hintError="errors[`sampleCardsRemainingList[${index}].source`]"
            :label="$t('MI0061')"
            :placeholder="$t('MI0092')"
            @enter="handleEnter"
          )
          f-input-text(
            class="w-58"
            v-model:textValue="field.value.qtyInPcs"
            :hintError="errors[`sampleCardsRemainingList[${index}].qtyInPcs`]"
            inputType="number"
            :label="$t('RR0037')"
            :placeholder="$t('MI0056')"
            :addOnRight="$t('RR0307')"
            @enter="handleEnter"
          )
          f-input-container(class="w-full" :label="`${$t('RR0036')}`")
            div(class="flex flex-row gap-x-3 w-full")
              f-input-text(
                class="flex-grow"
                v-model:textValue="field.value.shelf1"
                :hintError="errors[`sampleCardsRemainingList[${index}].shelf1`]"
                :placeholder="$t('MI0093')"
                @enter="handleEnter"
              )
              f-input-text(
                class="flex-grow"
                v-model:textValue="field.value.shelf2"
                :hintError="errors[`sampleCardsRemainingList[${index}].shelf2`]"
                :placeholder="$t('MI0093')"
                @enter="handleEnter"
              )
          f-input-text(
            class="w-full"
            v-model:textValue="field.value.location"
            :hintError="errors[`sampleCardsRemainingList[${index}].location`]"
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
            @click="pushSampleCardsRemainingField({ qtyInPcs: null, location: null, source: null, shelf1: null, shelf2: null })"
          )
          f-svg-icon(
            v-else
            class="text-grey-600 cursor-pointer"
            size="20"
            iconName="delete"
            @click="removeSampleCardsRemainingField(index)"
          )
  f-button(type="primary" size="md" :disabled="!meta.valid" @click="submit") Confirm
</template>

<script lang="ts">
import { z } from 'zod'
import { useForm, useFieldArray, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { sampleCardsRemainingListSchema } from '@/composables/material/useMaterialSchema'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import type { MaterialInternalInventoryInfoSampleCardsRemainingListInner } from '@frontier/platform-web-sdk'
import { useIMEComposition } from '@/components/assets/spreadsheet/utils/hooks'
import { handleEnterKeyDuringIMEComposition } from '@/components/assets/spreadsheet/utils/handlers'

interface SelectEditorParams
  extends ICellEditorParams<
    MaterialRow,
    MaterialInternalInventoryInfoSampleCardsRemainingListInner[]
  > {
  title: string
  onConfirm?: (
    name: MaterialInternalInventoryInfoSampleCardsRemainingListInner[],
    rowId: string
  ) => void
}

configure({ validateOnInput: true })

export default {
  setup(props: { params: SelectEditorParams }) {
    if (props.params.value == null) {
      throw new Error('value is null or undefined')
    }
    const { values, errors, meta, validate, handleSubmit } = useForm({
      initialValues: { sampleCardsRemainingList: props.params.value },
      validationSchema: toTypedSchema(
        z.object({ sampleCardsRemainingList: sampleCardsRemainingListSchema })
      ),
    })

    const isComposing = useIMEComposition()

    const handleEnter = (event: KeyboardEvent) =>
      handleEnterKeyDuringIMEComposition(event, isComposing, props.params)

    const submit = handleSubmit((values) => {
      props.params.onConfirm?.(
        values.sampleCardsRemainingList,
        props.params.node.id
      )
      props.params.api.stopEditing()
    })

    const getValue = () => values.sampleCardsRemainingList

    const {
      fields: sampleCardsRemainingFields,
      push: pushSampleCardsRemainingField,
      remove: removeSampleCardsRemainingField,
    } = useFieldArray<MaterialInternalInventoryInfoSampleCardsRemainingListInner>(
      'sampleCardsRemainingList'
    )

    return {
      title: props.params.title,
      sampleCardsRemainingFields,
      pushSampleCardsRemainingField,
      removeSampleCardsRemainingField,
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
