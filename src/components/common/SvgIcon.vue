<template lang="pug">
svg(class="svg-icon" arid-hidden="true" :style="style" :class="`text-${color}`")
  use(:xlink:href="`#${iconName}`")
</template>

<script>
import { reactive } from '@vue/reactivity'
export default {
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    },
    color: {
      type: String,
      default: 'black-800'
    }
  },
  setup (props) {
    const style = reactive({
      width: props.width + 'px',
      height: props.height + 'px',
      'min-width': props.width + 'px',
      'min-height:': props.height + 'px'
    })

    return {
      style
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
