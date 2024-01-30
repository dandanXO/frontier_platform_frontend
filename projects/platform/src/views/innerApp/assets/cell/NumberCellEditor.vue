<template lang="pug">
div(class="bg-grey-100 p-2 pb-10" @keydown.enter="handleKeyDown")
  f-input-text(
    ref="inputRef"
    class="w-69"
    size="md"
    inputType="number"
    v-model:textValue="inputValue"
    :hintError="hintError"
    :placeholder="params.placeholder"
    @enter="handleEnter"
  )
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import type { ZodNumber } from 'zod'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'

interface NumberEditorParams extends ICellEditorParams<MaterialRow, number> {
  placeholder: string
  schema: ZodNumber
}

// https://stackoverflow.com/questions/73032489/ag-grid-framework-component-is-missing-the-method-getvalue-in-production-buil
export default {
  setup(props: { params: NumberEditorParams }) {
    const inputRef = ref()
    const inputValue = ref(props.params.value)

    const handleEnter = () => {
      props.params.api.stopEditing()
    }

    const hintError = computed(() => {
      const result = props.params.schema.safeParse(inputValue.value)
      return result.success ? '' : result.error.errors[0].message
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      event.stopPropagation()
      if (event.key === 'Enter') {
        props.params.api.stopEditing()
      }
    }

    const getValue = () => {
      // if (hintError.value) {
      //   return props.params.value
      // }
      return inputValue.value
    }

    return {
      getValue,
      hintError,
      inputRef,
      inputValue,
      handleEnter,
      handleKeyDown,
    }
  },
}
</script>

<style scoped></style>
