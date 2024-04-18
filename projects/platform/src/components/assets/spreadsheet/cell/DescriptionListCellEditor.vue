<template lang="pug">
div(class="w-100 p-4 flex flex-col gap-y-4 bg-grey-100")
  f-select-input(
    ref="refInput"
    class="w-full"
    v-model:selectValue="inputValue"
    :dropdownMenuTree="menuTree"
    :placeholder="$t('MI0024')"
    multiple
    canAddNew
    @addNew="handleAdd($event)"
    :multipleTagInputValidations="[removeCommas, limitTo500Chars]"
  )
  confirm-button(@click="handleConfirm")
</template>

<script lang="ts">
import { computed, inject, ref, onMounted, nextTick } from 'vue'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import { MaterialType } from '@frontier/platform-web-sdk'
import type { SpreadsheetService } from '@/components/assets/spreadsheet/Spreadsheet.vue'
import ConfirmButton from '../button/ConfirmButton.vue'
import {
  removeCommas,
  limitTo500Chars,
} from '@/components/assets/spreadsheet/utils/validations'

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

    const handleConfirm = () => {
      props.params.api.stopEditing()
    }

    const menuTree = computed(() => {
      return descriptionList.value[getKey()]
    })

    onMounted(async () => {
      await nextTick()
      refInput.value.focus()
    })

    return {
      inputValue,
      addDescriptionOption,
      menuTree,
      handleAdd,
      handleConfirm,
      getValue,
      refInput,
      removeCommas,
      limitTo500Chars,
    }
  },
}
</script>

<style scoped></style>
