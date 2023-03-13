<template lang="pug">
f-tooltip(v-if="tooltip")
  template(#trigger)
    svg(
      class="svg-icon"
      arid-hidden="true"
      :style="{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }"
    )
      use(:xlink:href="`#${iconName}`")
  template(#content)
    p {{ te(tooltip) ? $t(tooltip) : tooltip }}
svg(
  v-else
  class="svg-icon"
  arid-hidden="true"
  :style="{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }"
)
  use(:xlink:href="`#${iconName}`")
</template>

<script>
export default {
  name: 'FSvgIcon',
}
</script>

<script setup>
import { useI18n } from 'vue-i18n'
import.meta.globEager('./icons/**/*.svg')

const { te } = useI18n()

defineProps({
  iconName: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '20',
  },
  tooltip: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.svg-icon {
  fill: currentColor !important;
  overflow: hidden;
}
</style>
