<template lang="pug">
svg(class="svg-icon" arid-hidden="true")
  use(:xlink:href="`#${iconName}`")
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.svg-icon {
  fill: currentColor !important;
  overflow: hidden;
}
</style>
