<template lang="pug">
div(class="w-100 p-4 flex flex-col gap-y-4 bg-grey-100")
  f-select-input(
    class="w-full"
    v-model:selectValue="inputValue"
    :dropdownMenuTree="menuTree"
    :placeholder="$t('MI0024')"
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
import type { MaterialRow } from '@/types'
import { MaterialType } from '@frontier/platform-web-sdk'
import type { SpreadsheetService } from '../AssetsMaterialAgGrid.vue'

interface SelectEditorParams extends ICellEditorParams<MaterialRow, string> {
  schema: ZodString
  side: 'faceSide' | 'backSide'
}

export default {
  setup(props: { params: SelectEditorParams }) {
    const inputValue = ref(props.params.value)
    const side = props.params.side
    const materialType = props.params.data[side]?.materialType

    const spreadsheetService = inject<SpreadsheetService>('spreadsheetService')
    if (!spreadsheetService) {
      throw new Error('spreadsheetService not provided')
    }
    const { descriptionList, addDescriptionOption } = spreadsheetService

    const getValue = () => inputValue.value

    const getKey = () => {
      switch (materialType) {
        case MaterialType.WOVEN:
          return 'woven'
        case MaterialType.KNIT:
          return 'knit'
        case MaterialType.LEATHER:
          return 'leather'
        case MaterialType.NON_WOVEN:
          return 'nonWoven'
        case MaterialType.TRIM:
          return 'trim'
        case MaterialType.OTHERS:
          return 'others'
      }
    }

    const handleAdd = async (description: string) => {
      if (!materialType) {
        return
      }
      addDescriptionOption(getKey(materialType), description)
    }

    const menuTree = computed(() => {
      return descriptionList.value[getKey()]
    })

    return {
      inputValue,
      addDescriptionOption,
      menuTree,
      handleAdd,
      getValue,
    }
  },
}
</script>

<style scoped></style>
