<template lang="pug">
div(class="w-140 p-4 flex flex-col gap-y-6 bg-grey-100 rounded")
  f-input-container(:label="params.label")
    div(class="flex flex-col gap-y-6")
      div(
        class="flex items-center gap-x-3"
        v-for="(field, index) in customPropertyFields"
        :key="field.key"
      )
        f-input-text(
          v-model:textValue="field.value.name"
          :hintError="errors[`customPropertyList[${index}].name`]"
          :label="params.nameLabel"
          class="w-50"
          :onInputValidations="[removeCommas, limitTo15Chars]"
          @enter="handleEnter"
        )
        f-input-text(
          v-model:textValue="field.value.value"
          :hintError="errors[`customPropertyList[${index}].value`]"
          :label="params.valueLabel"
          :placeholder="'Enter your info'"
          class="w-50"
          :onInputValidations="[removeCommas, limitTo50Chars]"
          @enter="handleEnter"
        )
        f-input-switch(
          v-model:inputValue="field.value.isPublic"
          label="Publish"
          class="w-50"
        )
        f-svg-icon(
          class="text-grey-600 cursor-pointer"
          iconName="delete"
          size="20"
          @click="() => removeCustomPropertyField(index)"
        )
      f-button(
        type="text"
        size="sm"
        prependIcon="add"
        @click="() => pushCustomPropertyField({ isPublic: false, name: 'Untitled', value: '' })"
      ) {{ $t('MI0034') }}
    span(v-for="(error, index) in customPropertyDisplayErrorList" :key="index") {{ error }}
  f-button(type="primary" size="md" :disabled="!meta.valid" @click="submit") Confirm
</template>

<script lang="ts">
import { computed } from 'vue'
import { z } from 'zod'
import { useForm, useFieldArray, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { customPropertyListSchema } from '@/composables/material/useMaterialSchema'
import IconButton from '@/components/assets/edit/blockMaterialSpecification/IconButton.vue'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import type { MaterialPatternCustomPropertyBase } from '@frontier/platform-web-sdk'
import {
  removeCommas,
  limitTo15Chars,
  limitTo50Chars,
} from '@/components/assets/spreadsheet/utils/validations'
import { useIMEComposition } from '@/components/assets/spreadsheet/utils/hooks'
import { handleEnterKeyDuringIMEComposition } from '@/components/assets/spreadsheet/utils/handlers'

interface SelectEditorParams
  extends ICellEditorParams<MaterialRow, MaterialPatternCustomPropertyBase[]> {
  label: string
  nameLabel: string
  namePlaceholder: string
  valueLabel: string
  valuePlaceholder: string
  onConfirm?: (name: MaterialPatternCustomPropertyBase[], rowId: string) => void
}

configure({ validateOnInput: true })

export default {
  setup(props: { params: SelectEditorParams }) {
    let customPropertyList = props.params.value
      ? props.params.value.map((item) => ({
          isPublic: item.isPublic,
          name: item.name,
          value: item.value,
        }))
      : []

    const { values, errors, meta, handleSubmit } = useForm({
      initialValues: { customPropertyList },
      validationSchema: toTypedSchema(
        z.object({
          customPropertyList: customPropertyListSchema,
        })
      ),
    })

    const isComposing = useIMEComposition()

    const handleEnter = (event: KeyboardEvent) =>
      handleEnterKeyDuringIMEComposition(event, isComposing, props.params)

    const submit = handleSubmit((values) => {
      let nodeId = props.params.node.id ?? ''
      props.params.onConfirm?.(values.customPropertyList, nodeId)
      props.params.api.stopEditing()
    })

    const getValue = () => values.customPropertyList

    const {
      fields: customPropertyFields,
      push: pushCustomPropertyField,
      remove: removeCustomPropertyField,
    } = useFieldArray<MaterialPatternCustomPropertyBase>('customPropertyList')

    const customPropertyDisplayErrorList = computed(() => {
      const customPropertyListErrors = []
      for (let i = 0; i < customPropertyFields.value.length; i++) {
        const fieldError =
          errors.value.customPropertyList && errors.value.customPropertyList[i]
        if (fieldError) {
          customPropertyListErrors.push(fieldError)
        }
      }

      return customPropertyListErrors
    })

    return {
      IconButton,
      customPropertyFields,
      customPropertyDisplayErrorList,
      pushCustomPropertyField,
      removeCustomPropertyField,
      meta,
      errors,
      submit,
      getValue,
      removeCommas,
      limitTo15Chars,
      limitTo50Chars,
      isComposing,
      handleEnter,
    }
  },
}
</script>

<style scoped></style>
