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
  setup () {
    const rootElement = ref(null)

    onMounted(() => {
      overlayscrollbars(rootElement.value, {
        overflowBehavior: {
          x: 'hidden',
          y: 'scroll'
        }
      })
    })

    return {
      rootElement
    }
  }
}
</script>
