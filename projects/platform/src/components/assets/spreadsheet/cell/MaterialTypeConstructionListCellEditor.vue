<template lang="pug">
div(class="w-100 p-4 flex flex-col gap-y-4 bg-grey-100")
  f-select-input(
    ref="refInput"
    class="w-full"
    v-model:selectValue="inputValue"
    :dropdownMenuTree="menuTree"
    :placeholder="$t('MI0024')"
    canAddNew
    @addNew="handleAdd($event)"
  )
  confirm-button(@click="handleConfirm")
</template>

<script lang="ts">
import { computed, inject, ref, onMounted, nextTick } from 'vue'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import { MaterialType } from '@frontier/platform-web-sdk'
import type {
  MaterialTypeConstructionKey,
  SpreadsheetService,
} from '@/components/assets/spreadsheet/Spreadsheet.vue'
import ConfirmButton from '../button/ConfirmButton.vue'
import { materialTypeMap } from '../utils/utils'

interface SelectEditorParams extends ICellEditorParams<MaterialRow, string> {
  side: 'faceSide' | 'backSide'
}

export default {
  components: {
    ConfirmButton,
  },
  setup(props: { params: SelectEditorParams }) {
    const refInput = ref<HTMLElement>()
    const inputValue = ref(props.params.value)
    const side = props.params.side
    const materialType = props.params.data[side]?.materialType

    const spreadsheetService = inject<SpreadsheetService>('spreadsheetService')
    if (!spreadsheetService) {
      throw new Error('spreadsheetService not provided')
    }
    const { materialTypeConstructionList, addMaterialTypeConstructionOption } =
      spreadsheetService

    const getValue = () => inputValue.value

    const handleAdd = async (description: string) => {
      if (!materialType) {
        return
      }
      addMaterialTypeConstructionOption(
        materialTypeMap[materialType],
        description
      )
    }

    const handleConfirm = () => {
      props.params.api.stopEditing()
    }

    const menuTree = computed(() => {
      return materialTypeConstructionList.value[materialTypeMap[materialType]]
    })

    onMounted(async () => {
      await nextTick()
      refInput.value?.focus()
    })

    return {
      inputValue,
      menuTree,
      handleAdd,
      handleConfirm,
      getValue,
      refInput,
    }
  },
}
</script>

<style scoped></style>
