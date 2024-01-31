<template lang="pug">
div(class="w-100 p-4 flex flex-col gap-y-4 bg-grey-100")
  f-select-input(
    class="w-full"
    v-model:selectValue="inputValue"
    :dropdownMenuTree="menuTree"
    :placeholder="$t('MI0040')"
    multiple
    canAddNew
    @addNew="handleAdd($event)"
  )
  //- f-button(type="primary" size="md" @click="handleConfirm") Confirm
</template>

<script lang="ts">
import { computed, inject, ref } from 'vue'
import type { ZodString } from 'zod'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialFinish } from '@frontier/platform-web-sdk'
import type { MaterialRow } from '@/types'
import type { SpreadsheetService } from '../AssetsMaterialAgGrid.vue'

interface SelectEditorParams
  extends ICellEditorParams<MaterialRow, MaterialFinish> {
  schema: ZodString
}

export default {
  setup(props: { params: SelectEditorParams }) {
    const inputValue = ref(props.params.value)

    const spreadsheetService = inject<SpreadsheetService>('spreadsheetService')
    if (!spreadsheetService) {
      throw new Error('spreadsheetService not provided')
    }
    const { finishMenuTree, addFinishOption } = spreadsheetService

    const getValue = () => inputValue.value

    const handleAdd = (finishName: string) => {
      if (finishName) {
        addFinishOption(finishName)
      }
    }

    return {
      inputValue,
      addFinishOption,
      menuTree: finishMenuTree,
      handleAdd,
      getValue,
    }
  },
}
</script>

<style scoped></style>
