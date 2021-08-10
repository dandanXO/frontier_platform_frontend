<template lang="pug">
svg(class="svg-icon" arid-hidden="true" :class="iconSize")
  use(:xlink:href="`#${iconName}`")
</template>

<script>
import { computed } from '@vue/reactivity'
export default {
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '20'
    }
  },
  setup (props) {
    const iconSize = computed(() => {
      if (props.size === 'special') {
        return
      }

      const sizeNum = parseInt(props.size)

      return [
        `min-w-${sizeNum / 4}`,
        `min-h-${sizeNum / 4}`,
        `w-${sizeNum / 4}`,
        `h-${sizeNum / 4}`
      ]
    })
    return {
      iconSize
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
