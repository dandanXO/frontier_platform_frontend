<template lang="pug">
div(class="flex flex-col gap-y-7.5 pb-10")
  f-input-container(:label="$t('MI0002')")
    div(class="flex items-center gap-x-3")
      f-select-dropdown(
        :selectValue="isDoubleSide.value"
        @update:selectValue="isDoubleSide.onInput"
        :dropdownMenuTree="singleOrDoubleMenuTree"
        class="w-50"
        data-cy="create-material-side-information-selecter"
      )
      f-select-dropdown(
        v-if="!isDoubleSide.value"
        :selectValue="sideType.value"
        @update:selectValue="sideType.onInput"
        :dropdownMenuTree="sideTypeMenuTree"
        class="w-25"
        data-cy="select-material-side"
      )
  f-input-container(:label="$t('MI0003')")
    f-input-checkbox(
      binary
      :inputValue="isComposite.value"
      @update:inputValue="isComposite.onInput"
      :label="$t('MI0004')"
      data-cy="create-material-check-box"
    )
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { MaterialFormService } from '@/types'
import { materialFormServiceKey } from '@/utils/constants'

const materialFormService = inject<MaterialFormService>(materialFormServiceKey)
if (!materialFormService) {
  throw new Error('useMaterialForm is not provided')
}
const { inputMenu, defineInputBinds } = materialFormService
const { singleOrDoubleMenuTree, sideTypeMenuTree } = inputMenu

const isDoubleSide = defineInputBinds('isDoubleSide')
const isComposite = defineInputBinds('isComposite')
const sideType = defineInputBinds('sideType')
</script>

<style scoped></style>
