<template lang="pug">
div(ref="rootElement")
  slot
</template>

<script>
export default {
  name: 'FScrollbarContainer',
}
</script>

<script setup>
import 'overlayscrollbars/css/OverlayScrollbars.css'
import { onMounted, ref } from 'vue'
import overlayscrollbars from 'overlayscrollbars'
// https://kingsora.github.io/OverlayScrollbars/#!overview

const emit = defineEmits(['reach-bottom', 'scroll', 'overflowAmountChanged'])
const props = defineProps({
  /**
   * Indicates whether the host element is capable of "auto" sizes such as: width: auto and height: auto. If set to false and the property width or height is "auto", the rendered width or height of the content will be zero.
   * If you are applying OverlayScrollbars to a flexbox-element set this option to false to ensure correct functionality.
   *
   * This option is ignored if the target-element is the body element, because in this case the size must be 100% (on both axis) to simulate the viewport correctly.
   */
  sizeAutoCapable: {
    type: Boolean,
    default: true,
  },
  direction: {
    type: String,
    default: 'vertical', // Another option is 'horizontal'
    validator(v) {
      return ['horizontal', 'vertical'].includes(v)
    },
  },
})

const rootElement = ref(null)
const instance = ref(null)

onMounted(() => {
  instance.value = overlayscrollbars(rootElement.value, {
    sizeAutoCapable: props.sizeAutoCapable,
    overflowBehavior: {
      x: props.direction === 'vertical' ? 'hidden' : 'scroll',
      y: props.direction === 'vertical' ? 'scroll' : 'hidden',
    },
    callbacks: {
      onScroll: () => {
        const scrollInfo = instance.value.scroll()
        if (scrollInfo.ratio.y >= 0.9) {
          emit('reach-bottom')
        }
        emit('scroll', scrollInfo)
      },
      onOverflowAmountChanged: ({ x, y }) => {
        emit('overflowAmountChanged', { x, y })
      },
    },
  })
})

defineExpose({
  instance,
})
</script>
