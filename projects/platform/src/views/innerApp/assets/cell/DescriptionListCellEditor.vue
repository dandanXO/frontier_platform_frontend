<template lang="pug">
div(class="w-100 p-4 flex flex-col gap-y-4 bg-grey-100")
  f-select-input(
    class="w-full"
    v-model:selectValue="inputValue"
    :dropdownMenuTree="menuTree"
    placeholder="description list"
    multiple
    @addNew="addDescriptionOption"
  )
  //- f-button(type="primary" size="md" @click="handleConfirm") Confirm
</template>

<script lang="ts">
import { computed, inject, ref } from 'vue'
import type { ZodString } from 'zod'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MenuTree } from '@frontier/ui-component'
import type { MaterialRow } from '@/types'
import { clone } from 'ramda'
import { MaterialType } from '@frontier/platform-web-sdk'

interface SelectEditorParams extends ICellEditorParams<MaterialRow, string> {
  schema: ZodString
  // dropdownMenuTree: () => MenuTree
  // placeholder: string
  // multiple: boolean
  // onAddNew?: (name: string) => void
  // onConfirm?: (name: string | null | undefined, rowId: string) => void
}

export default {
  setup(props: { params: SelectEditorParams }) {
    const inputValue = ref(props.params.value)
    const materialType = props.params.data.faceSide?.materialType
    // const dropdownMenuTree = ref(clone(props.params.dropdownMenuTree()))

    const descriptionListService = inject('descriptionList')
    const {
      descriptionList,
      newDescriptionList,
      descriptionMenuDefaultList,
      descriptionMenuCustomList,
      addDescriptionOption,
    } = descriptionListService

    const getValue = () => inputValue.value

    const handleAdd = (description) => {
      console.log({ materialType, description })
      addDescriptionOption(materialType, description)
    }

    const menuTree = computed(() => {
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
      return descriptionList.value[getKey()]
    })

    console.log(menuTree.value)
    console.log({ materialType, descriptionList, inputValue })

    return {
      inputValue,
      descriptionList,
      addDescriptionOption,
      menuTree,
      handleAdd,
      getValue,
    }
  },
}
</script>

<style scoped></style>
