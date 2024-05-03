<template lang="pug">
div(ref="containerRef" class="bg-grey-100 p-2 pb-10" @keydown.enter="handleKeyDown")
  f-input-text(
    ref="inputRef"
    class="min-w-80 max-w-full"
    size="md"
    inputType="bigNumber"
    v-model:textValue="inputValue"
    :hintError="hintError"
    :placeholder="params.placeholder"
    @enter="handleEnter"
  )
</template>

<script lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { ZodString } from 'zod'
import type { ICellEditorParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'

interface BigNumberEditorParams extends ICellEditorParams<MaterialRow, string> {
  placeholder: string
  schema: ZodString
}

export default {
  setup(props: { params: BigNumberEditorParams }) {
    const containerRef = ref<HTMLElement>()
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

    const getValue = () => inputValue.value

    onClickOutside(containerRef, () => {
      props.params.api.stopEditing()
    })

    onMounted(async () => {
      await nextTick()
      inputRef.value.focus()
    })

    return {
      getValue,
      hintError,
      containerRef,
      inputRef,
      inputValue,
      handleEnter,
      handleKeyDown,
    }
  },
}
</script>

<style scoped></style>
