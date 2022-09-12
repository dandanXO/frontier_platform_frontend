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

const emit = defineEmits(['reach-bottom'])
const props = defineProps({
  /**
   * Indicates whether the host element is capable of "auto" sizes such as: width: auto and height: auto. If set to false and the property width or height is "auto", the rendered width or height of the content will be zero.
   * If you are applying OverlayScrollbars to a flexbox-element set this option to false to ensure correct functionality.
   * 
   * This option is ignored if the target-element is the body element, because in this case the size must be 100% (on both axis) to simulate the viewport correctly.
   */
  sizeAutoCapable: {
    type: Boolean,
    default: true
  }
})

const rootElement = ref(null)

onMounted(() => {
  const instance = overlayscrollbars(rootElement.value, {
    sizeAutoCapable: props.sizeAutoCapable,
    overflowBehavior: {
      x: 'hidden',
      y: 'scroll'
    },
    callbacks: {
      onScroll: () => {
        const scrollInfo = instance.scroll()

        if (scrollInfo.ratio.y >= 0.9) {
          emit('reach-bottom')
        }
      }
    }
  })
})
</script>
