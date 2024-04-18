<template lang="pug">
div(class="w-100 p-4 flex flex-col gap-y-4 bg-grey-100")
  f-select-input(
    class="w-full mb-2"
    v-model:selectValue="inputValue"
    :dropdownMenuTree="seasonMenuTree"
    :placeholder="t('MI0012')"
    :multiple="params.multiple"
    @addNew="addSeasonOption"
    :rules="rules"
    :hintError="isInputValueInvalid ? $t('WW0142', { limitNumber: 50 }) : ''"
    :multipleTagInputValidations="[limitTo10Chars]"
  )
  f-button(
    type="primary"
    size="md"
    @click="handleConfirm"
    :disabled="isInputValueInvalid"
  ) Confirm
</template>

<script lang="ts">
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ZodString } from 'zod'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MenuTree } from '@frontier/ui-component'
import type { MaterialRow } from '@/types'
import type { SpreadsheetService } from '@/components/assets/spreadsheet/Spreadsheet.vue'
import { limitTo10Chars } from '@/components/assets/spreadsheet/utils/validations'

interface SelectEditorParams extends ICellEditorParams<MaterialRow, string> {
  schema: ZodString
  dropdownMenuTree: () => MenuTree
  placeholder: string
  multiple: boolean
  onAddNew?: (name: string) => void
  onConfirm?: (name: string | null | undefined, rowId: string) => void
}

export default {
  setup(props: { params: SelectEditorParams }) {
    const spreadsheetService = inject<SpreadsheetService>('spreadsheetService')
    const { seasonMenuTree, addSeasonOption, allSeasonList } =
      spreadsheetService

    const { t } = useI18n()
    const inputValue = ref(props.params.value ?? '')
    const isInputValueInvalid = computed(() => {
      return inputValue.value !== undefined && inputValue.value.length > 50
    })
    const rules = [
      (value: string) => value.length <= 50 || t('WW0142', { limitNumber: 50 }),
    ]

    const handleConfirm = () => {
      const rowId = props.params.node.id
      const targetSeason = allSeasonList.value.find((s) => s.name === name)
      const node = props.params.node
      const data = node?.data
      node?.setData({
        ...data,
        seasonInfo: {
          ...data?.seasonInfo,
          season: {
            seasonId: targetSeason?.seasonId ?? null,
            name,
          },
        },
      })
      props.params.api.stopEditing()
    }

    const getValue = () => inputValue.value

    return {
      t,
      inputValue,
      seasonMenuTree,
      handleConfirm,
      addSeasonOption,
      getValue,
      rules,
      isInputValueInvalid,
      limitTo10Chars,
    }
  },
}
</script>

<style scoped></style>
