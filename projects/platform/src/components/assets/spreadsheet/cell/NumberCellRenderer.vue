<template lang="pug">
div(v-if="!hintError" class="h-400 w-full h-full flex items-center")
  p {{ cellValue }}
f-tooltip-standard(
  v-else
  class="w-full h-full"
  :tooltipMessage="hintError"
  :placement="TOOLTIP_PLACEMENT.TOP_START"
  boundaryReference="search-table-header"
)
  template(#slot:tooltip-trigger)
    div(class="h-400 w-full h-full flex items-center")
      p {{ cellValue }}
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import type { ZodNumber } from 'zod'
import type { ICellRendererParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import { TOOLTIP_PLACEMENT } from '@frontier/constants'

interface NumberRendererParams
  extends ICellRendererParams<MaterialRow, number> {
  schema: ZodNumber
}

export default {
  setup(props: { params: NumberRendererParams }) {
    const cellValue = ref(props.params.value)

    const hintError = computed(() => {
      const result = props.params.schema.safeParse(cellValue.value)
      return result.success ? '' : result.error.errors[0].message
    })

    const refresh = (params: ICellRendererParams) => {
      cellValue.value = params.value
    }

    return {
      cellValue,
      hintError,
      refresh,
      TOOLTIP_PLACEMENT,
    }
  },
}
</script>

<style scoped></style>
