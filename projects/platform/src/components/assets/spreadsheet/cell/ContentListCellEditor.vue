<template lang="pug">
div(class="w-200 p-4 flex flex-col gap-y-6 bg-grey-100 rounded")
  f-input-container(
    :label="$t('RR0021')"
    required
    :hintError="contentDisplayError"
  )
    div(class="flex flex-col gap-y-3")
      div(
        v-for="(field, index) in contentFields"
        :key="contentFields[index].key"
        class="flex flex-row items-center gap-x-3"
      )
        f-select-input(
          :selectValue="field.value.name"
          @update:selectValue="(name) => selectContent(name, index, field.value)"
          :dropdownMenuTree="contentList"
          @addNew="addContentOption($event)"
          :placeholder="$t('MI0035')"
          :hintError="Boolean(displayErrors[`contentList[${index}].name`])"
          class="w-100"
        )
        f-input-text(
          v-model:textValue="field.value.percentage"
          inputType="number"
          :placeholder="$t('MI0043')"
          addOnRight="%"
          :hintError="Boolean(displayErrors[`$contentList[${index}].percentage`])"
          class="w-40"
        )
        f-svg-icon(
          v-if="index === 0"
          class="text-grey-600 cursor-pointer"
          size="24"
          iconName="add_box"
          @click="pushContentField({ contentId: null, name: null, percentage: null })"
        )
        f-svg-icon(
          v-else
          class="text-grey-600 cursor-pointer"
          size="20"
          iconName="delete"
          @click="() => removeContentField(index)"
        )
  confirm-button(@click="handleConfirm")
</template>

<script lang="ts">
import { computed, inject } from 'vue'
import { z } from 'zod'
import { useForm, useFieldArray, configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { contentListSchema } from '@/composables/material/useMaterialSchema'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import type { MaterialSideAllOfContentList } from '@frontier/platform-web-sdk'
import { useI18n } from 'vue-i18n'
import ConfirmButton from '@/components/assets/spreadsheet/button/ConfirmButton.vue'

interface SelectEditorParams
  extends ICellEditorParams<MaterialRow, MaterialSideAllOfContentList[]> {
  label: string
  nameLabel: string
  namePlaceholder: string
  valueLabel: string
  valuePlaceholder: string
  onConfirm?: (name: MaterialSideAllOfContentList[], rowId: string) => void
}

configure({ validateOnInput: true })

export default {
  components: {
    ConfirmButton,
  },
  setup(props: { params: SelectEditorParams }) {
    const { t } = useI18n()

    if (props.params.value == null) {
      throw new Error('value is null or undefined')
    }

    const {
      values,
      errors: displayErrors,
      meta,
      validate,
      handleSubmit,
    } = useForm({
      initialValues: { contentList: props.params.value },
      validationSchema: toTypedSchema(
        z.object({ contentList: contentListSchema })
      ),
    })

    const submit = handleSubmit((values) => {
      props.params.onConfirm?.(values.contentList, props.params.node.id)
      props.params.api.stopEditing()
    })

    const contentService = inject('contentService')
    const {
      newContentList,
      contentCustomList,
      contentDefaultList,
      allContentList,
      addContentOption,
      contentList,
    } = contentService

    const getValue = () => values.contentList

    const {
      fields: contentFields,
      push: pushContentField,
      remove: removeContentField,
      update: updateContentField,
    } = useFieldArray<{
      contentId: number | null
      name: string | null
      percentage: number
    }>(`contentList`)

    const contentDisplayError = computed(() => {
      const errors = []
      if (displayErrors.value['contentList']) {
        errors.push(displayErrors.value[`contentList`])
      }

      for (let i = 0; i < contentFields.value.length; i++) {
        const fieldErrors = [
          displayErrors.value[`contentList[${i}].name`],
          displayErrors.value[`contentList[${i}].percentage`],
        ].filter(Boolean)
        if (fieldErrors.length) {
          errors.push(...fieldErrors)
        }
      }

      return errors.length ? [...new Set(errors)].join(', ') : ''
    })

    const selectContent = (
      name: string | null,
      index: number,
      fieldValue: {
        contentId: number | null
        name: string | null
        percentage: number
      }
    ) => {
      if (name == null || name.length === 0) {
        updateContentField(index, {
          ...fieldValue,
          contentId: null,
          name: null,
        })
        return
      }

      const targetContent = allContentList.value.find((c) => c.name === name)
      if (targetContent) {
        updateContentField(index, { ...fieldValue, ...targetContent })
        return
      }

      updateContentField(index, { ...fieldValue, contentId: null, name })
    }

    const handleConfirm = () => {
      props.params.api.stopEditing()
    }

    return {
      contentList,
      contentFields,
      pushContentField,
      removeContentField,
      selectContent,
      addContentOption,
      meta,
      contentDisplayError,
      displayErrors,
      submit,
      getValue,
      handleConfirm,
    }
  },
}
</script>

<style scoped></style>
