<template lang="pug">
div(
  class="flex-shrink-0 h-13 px-7.5 flex flex-row gap-4 items-center"
  :style="{ background: 'linear-gradient(180deg, #0F7F73 0%, #0A6665 207.69%)' }"
)
  p(class="font-bold text-h6 text-grey-0") {{ $t('TT0132') }}
  div(
    class="flex flex-row gap-2 items-center px-2 h-6"
    :style="{ background: '#0A6665', 'box-shadow': 'inset 0px 1px 3px rgba(0, 0, 0, 0.25)', 'border-radius': '21px' }"
  )
    div(class="w-3 h-3 rounded-sm" :style="{ background: '#8BC34A' }")
    span(class="text-body2 text-grey-100") {{ unit.ogName }}
  f-svg-icon(iconName="question" size="24" class="text-grey-50 cursor-pointer")
</template>

<script setup lang="ts">
import useCurrentUnit from '@/composables/useCurrentUnit'

const { unit } = useCurrentUnit()
</script>

<style scoped></style>
