<template lang="pug">
f-tooltip-standard(
  v-if="tooltipMessage"
  :tooltipTitle="te(tooltipTitle) ? $t(tooltipTitle) : tooltipTitle"
  :tooltipMessage="te(tooltipMessage) ? $t(tooltipMessage) : tooltipMessage"
)
  template(#slot:tooltip-trigger)
    svg(
      class="svg-icon"
      arid-hidden="true"
      :style="{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }"
    )
      use(:xlink:href="`#${iconName}`")
svg(
  v-else
  class="svg-icon"
  arid-hidden="true"
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
import.meta.globEager('./icons/**/*.svg')

const { te } = useI18n()

withDefaults(
  defineProps<{
    iconName: string
    size?: string
    tooltipTitle?: string
    tooltipMessage?: string
  }>(),
  {
    size: '20',
    tooltipTitle: '',
    tooltipMessage: '',
  }
)
</script>

<style scoped>
.svg-icon {
  fill: currentColor !important;
  overflow: hidden;
}
</style>
