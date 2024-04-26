<template lang="pug">
div(class="w-100 p-4 flex flex-col gap-y-4 bg-grey-100")
  f-select-input(
    class="w-full mb-2"
    v-model:selectValue="inputValue"
    :dropdownMenuTree="dropdownMenuTree"
    :placeholder="params.placeholder"
    :multiple="params.multiple"
    :canAddNew="false"
    :hintError="isTagTooLong ? $t('WW0142', { limitNumber: 500 }) : ''"
    :multipleTagInputValidations="[removeCommas, limitTo500Chars]"
  )
  confirm-button(@click="handleConfirm" :disabled="isTagTooLong")
</template>

<script lang="ts">
import { ref, computed, inject } from 'vue'
import type { ZodString, string } from 'zod'
import type { ICellEditorParams } from 'ag-grid-community'
import { clone } from 'ramda'
import type { MenuTree } from '@frontier/ui-component'
import type { MaterialRow } from '@/types'
import ConfirmButton from '@/components/assets/spreadsheet/button/ConfirmButton.vue'
import {
  removeCommas,
  limitTo500Chars,
} from '@/components/assets/spreadsheet/utils/validations'
import type { SpreadsheetService } from '../Spreadsheet.vue'
import type { MaterialCertification } from '@frontier/platform-web-sdk'

interface SelectEditorParams extends ICellEditorParams<MaterialRow, string> {
  schema: ZodString
  dropdownMenuTree: () => MenuTree
  placeholder: string
  multiple: boolean
  onAddNew?: (name: string) => void
  onConfirm?: (name: string | null | undefined, rowId: string) => void
}

export default {
  components: {
    ConfirmButton,
  },
  setup(props: { params: SelectEditorParams }) {
    const spreadsheetService = inject<SpreadsheetService>('spreadsheetService')
    const inputValue = ref(props.params.value)

    const mapCertificateList = ({
      name,
      certificateId,
    }: MaterialCertification) => ({
      title: name,
      selectValue: certificateId,
    })

    const dropdownMenuTree = computed(() => ({
      blockList: [
        {
          menuList:
            spreadsheetService?.materialOptions.certificateList.map(
              mapCertificateList
            ) || [],
        },
      ],
    }))

    const isTagTooLong = computed(
      () =>
        Array.isArray(inputValue.value) &&
        inputValue.value.some((tag) => tag.length > 500)
    )

    const handleConfirm = () => {
      props.params.api.stopEditing()
    }

    const getValue = () => inputValue.value

    return {
      inputValue,
      dropdownMenuTree,
      handleConfirm,
      getValue,
      isTagTooLong,
      removeCommas,
      limitTo500Chars,
    }
  },
}
</script>

<style scoped></style>
