<template lang="pug">
div(class="w-100 p-4 flex flex-col gap-y-4 bg-grey-100")
  f-select-input(
    ref="refInput"
    class="w-full"
    v-model:selectValue="inputValue"
    :dropdownMenuTree="dropdownMenuTree"
    :placeholder="params.placeholder"
    :multiple="params.multiple"
    @addNew="handleAdd"
  )
  confirm-button(@click="handleConfirm")
</template>

<script lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { ZodString } from 'zod'
import type { ICellEditorParams } from 'ag-grid-community'
import { clone } from 'ramda'
import type { MenuTree } from '@frontier/ui-component'
import type { MaterialRow } from '@/types'
import ConfirmButton from '@/components/assets/spreadsheet/button/ConfirmButton.vue'

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
    const refInput = ref<HTMLElement>()
    const inputValue = ref(props.params.value)
    const dropdownMenuTree = ref(clone(props.params.dropdownMenuTree()))

    const handleAdd = (name: string) => {
      dropdownMenuTree.value.blockList[0].menuList.push({
        selectValue: name,
        title: name,
      })
      props.params.onAddNew?.(name)
    }

    const handleConfirm = () => {
      props.params.onConfirm?.(inputValue.value, props.params.node.id)
      props.params.api.stopEditing()
    }

    const getValue = () => inputValue.value

    onMounted(async () => {
      await nextTick()
      refInput.value.focus()
    })

    return {
      refInput,
      inputValue,
      dropdownMenuTree,
      handleConfirm,
      handleAdd,
      getValue,
    }
  },
}
</script>

<style scoped></style>
