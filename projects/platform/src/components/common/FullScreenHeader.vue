<template lang="pug">
div(class="fixed inset-0 z-modal pt-16 w-screen h-screen bg-grey-0 overflow-y-auto")
  div(
    ref="root"
    class="fixed inset-0 z-header w-screen h-16 bg-grey-0 px-36 flex justify-between items-center transition duration-300 ease-in"
    :class="{ 'header-shadow': isScrolling }"
  )
    div(class="flex items-center")
      slot(name="left")
    div(class="flex items-center")
      slot(name="right")
  slot(name="content")
</template>

<script>
import { onMounted } from 'vue'
import { ref } from 'vue'

export default {
  name: 'FullscreenHeader',
  setup() {
    const root = ref(null)
    const isScrolling = ref(false)

    onMounted(() => {
      const container = root.value.parentElement
      container.addEventListener('scroll', () => {
        isScrolling.value = container.scrollTop > 0
      })
    })

    return {
      root,
      isScrolling,
    }
  },
}
</script>
