<template lang="pug">
// Bubble-style hover tooltip with white background
f-tooltip(
  v-if="tooltipMessage && tooltipType === 'bubble'"
  :offset="[0, 8]"
  :title="te(tooltipTitle) ? $t(tooltipTitle) : tooltipTitle"
  :desc="te(tooltipMessage) ? $t(tooltipMessage) : tooltipMessage"
  classContainer="shadow-[0px_0px_8px_0px_rgba(19,20,20,0.10),0px_4px_8px_0px_rgba(19,20,20,0.05)]"
  classContent="bg-[#FAFCFC] text-grey-900"
  :placement="TOOLTIP_PLACEMENT.BOTTOM"
)
  template(#slot:tooltip-trigger)
    svg(
      class="svg-icon"
      arid-hidden="true"
      :style="{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }"
      :data-cy="testId"
    )
      use(:xlink:href="`#${iconName}`")
// Standard tooltip by default
f-tooltip-standard(
  v-else-if="tooltipMessage"
  :tooltipTitle="te(tooltipTitle) ? $t(tooltipTitle) : tooltipTitle"
  :tooltipMessage="te(tooltipMessage) ? $t(tooltipMessage) : tooltipMessage"
)
  template(#slot:tooltip-trigger)
    svg(
      class="svg-icon"
      arid-hidden="true"
      :style="{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }"
      :data-cy="testId"
    )
      use(:xlink:href="`#${iconName}`")
// No tooltip
svg(
  v-else
  class="svg-icon"
  arid-hidden="true"
  :data-cy="testId"
  :style="{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }"
)
  use(:xlink:href="`#${iconName}`")
</template>

<script lang="ts">
export default {
  name: 'FSvgIcon',
}
</script>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FTooltip from '../FTooltip/FTooltip/FTooltip.vue'
import FTooltipStandard from '../FTooltip/FTooltipStandard/FTooltipStandard.vue'
import { TOOLTIP_PLACEMENT } from '@frontier/constants'
import.meta.glob('./icons/**/*.svg', { eager: true })

const { te } = useI18n()

withDefaults(
  defineProps<{
    iconName: string
    size?: string
    tooltipTitle?: string
    tooltipMessage?: string
    tooltipType?: 'standard' | 'bubble'
    testId?: string
  }>(),
  {
    size: '20',
    tooltipTitle: '',
    tooltipMessage: '',
    tooltipType: 'standard',
  }
)
</script>

<style scoped>
.svg-icon {
  fill: currentColor !important;
  overflow: hidden;
}
</style>
