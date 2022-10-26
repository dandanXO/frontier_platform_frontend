<template lang="pug">
svg(
  class="svg-icon"
  arid-hidden="true"
  :style="{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }"
)
  use(:xlink:href="`#${iconName}`")
</template>

<script>
import.meta.globEager('./icons/**/*.svg')

export default {
  name: 'FSvgIcon',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '20',
    },
  },
}
</script>

<style scoped>
.svg-icon {
  fill: currentColor !important;
  overflow: hidden;
}
</style>
