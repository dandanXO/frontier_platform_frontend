<template lang="pug">
div(class="h-400 w-full" :class="hintError ? 'bg-red-400 border' : ''")
  p {{ itemNo }}
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import useMaterialSchema from '@/composables/material/useMaterialSchema'
import type { ICellRendererParams } from 'ag-grid-community'

export default {
  setup(props: { params: ICellRendererParams }) {
    const itemNo = ref(props.params.value)

    const materialSchema = useMaterialSchema()

    const hintError = computed(() => {
      const result = materialSchema.shape.itemNo.safeParse(itemNo.value)
      return result.success ? '' : result.error.errors[0].message
    })

    const refresh = (params: ICellRendererParams) => {
      itemNo.value = params.value
    }

    return {
      itemNo,
      hintError,
      refresh,
    }
  },
}
</script>

<style scoped></style>
