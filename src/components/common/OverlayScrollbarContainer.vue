<template lang="pug">
div(ref="rootElement")
  slot
</template>

<script>
import { onMounted, ref } from 'vue'
import overlayscrollbars from 'overlayscrollbars'
// https://kingsora.github.io/OverlayScrollbars/#!overview

export default {
  name: 'OverlayScrollbarContainer',
  emits: ['reach-bottom'],
  setup (props, { emit }) {
    const rootElement = ref(null)

    onMounted(() => {
      const instance = overlayscrollbars(rootElement.value, {
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

    return {
      rootElement
    }
  }
}
</script>
