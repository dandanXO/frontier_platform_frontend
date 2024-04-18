<template lang="pug">
div(class="w-100 p-4 flex flex-col gap-y-4 bg-grey-100")
  f-select-input(
    ref="refInput"
    class="w-full mb-2"
    v-model:selectValue="inputValue"
    :dropdownMenuTree="menuTree"
    :placeholder="$t('MI0040')"
    multiple
    canAddNew
    @addNew="handleAdd($event)"
    @update:selectValue="handleSelectValueUpdate"
    :hintError="isTagTooLong ? $t('WW0142', { limitNumber: 500 }) : ''"
    :rules="rules"
    :multipleTagInputValidations="[removeCommas, limitTo500Chars]"
  )
  confirm-button(@click="handleConfirm" :disabled="isTagTooLong")
</template>

<script lang="ts">
import { inject, ref, onMounted, nextTick } from 'vue'
import type { ZodString } from 'zod'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialFinish } from '@frontier/platform-web-sdk'
import type { MaterialRow } from '@/types'
import type { SpreadsheetService } from '@/components/assets/spreadsheet/Spreadsheet.vue'
import { useI18n } from 'vue-i18n'
import ConfirmButton from '@/components/assets/spreadsheet/button/ConfirmButton.vue'
import {
  removeCommas,
  limitTo500Chars,
} from '@/components/assets/spreadsheet/utils/validations'

interface SelectEditorParams
  extends ICellEditorParams<MaterialRow, MaterialFinish> {
  schema: ZodString
}

export default {
  components: {
    ConfirmButton,
  },
  setup(props: { params: SelectEditorParams }) {
    const { t } = useI18n()
    const refInput = ref<HTMLElement>()
    type FinishList = { finishId: number; name: string }[]

    const inputValue = ref<FinishList>(
      Array.isArray(props.params.value) ? props.params.value : []
    )

    const isTagTooLong = ref(
      inputValue.value.some((tag) => tag.name.length > 500)
    )

    const handleSelectValueUpdate = (value: FinishList) => {
      inputValue.value = value
      isTagTooLong.value = value.some((tag) => tag.name.length > 500)
    }

    const spreadsheetService = inject<SpreadsheetService>('spreadsheetService')
    if (!spreadsheetService) {
      throw new Error('spreadsheetService not provided')
    }
    const { finishMenuTree, addFinishOption } = spreadsheetService

    const getValue = () => inputValue.value

    const rules = [
      (value: string | null | undefined) =>
        (typeof value === 'string' && value.length <= 500) ||
        t('WW0142', { limitNumber: 500 }),
    ]

    const handleAdd = (finishName: string) => {
      if (finishName) {
        addFinishOption(finishName)
      }
    }

    const handleConfirm = () => {
      props.params.api.stopEditing()
    }

    onMounted(async () => {
      await nextTick()
      refInput.value!.focus()
    })

    return {
      refInput,
      inputValue,
      addFinishOption,
      menuTree: finishMenuTree,
      handleConfirm,
      handleAdd,
      getValue,
      isTagTooLong,
      rules,
      handleSelectValueUpdate,
      removeCommas,
      limitTo500Chars,
    }
  },
}
</script>

<style scoped></style>
