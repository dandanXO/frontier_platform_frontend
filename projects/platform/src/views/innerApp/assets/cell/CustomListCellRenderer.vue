<template lang="pug">
div(v-if="!hintError" class="h-400 w-full flex items-center")
  p(style="white-space: pre-line") {{ cellValueDisplay }}
f-tooltip-standard(
  v-else
  class="w-full h-full"
  :tooltipMessage="hintError"
  :placement="TOOLTIP_PLACEMENT.TOP_START"
  boundaryReference="search-table-header"
)
  template(#slot:tooltip-trigger)
    div(class="h-400 w-full flex items-center")
      p(style="white-space: pre-line") {{ cellValueDisplay }}
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'
import type { MaterialRow } from '@/types'
import { customPropertyListSchema } from '@/composables/material/useMaterialSchema'
import { TOOLTIP_PLACEMENT } from '@frontier/constants'
import type { MaterialPatternCustomPropertyBase } from '../../../../../../../packages/platform-web-sdk'

interface StringRendererParams
  extends ICellRendererParams<
    MaterialRow,
    MaterialPatternCustomPropertyBase[]
  > {}

export default {
  setup(props: { params: StringRendererParams }) {
    const cellValue = ref(props.params.value)

    const cellValueDisplay = computed(() => {
      return (
        cellValue.value
          ?.map((customProperty) => {
            const isPublicDisplay = customProperty.isPublic
              ? 'public'
              : 'private'
            return `${customProperty.name}:${customProperty.value}(${isPublicDisplay})`
          })
          ?.join(',\n') || null
      )
    })

    const hintError = computed(() => {
      const result = customPropertyListSchema.safeParse(cellValue.value)
      return result.success ? '' : result.error.errors[0].message
    })

    const refresh = (params: ICellRendererParams) => {
      cellValue.value = params.value
    }

    return {
      cellValue,
      cellValueDisplay,
      hintError,
      refresh,
      TOOLTIP_PLACEMENT,
    }
  },
}
</script>

<style scoped></style>
