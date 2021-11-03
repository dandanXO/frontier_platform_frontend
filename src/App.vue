<template lang="pug">
router-view(v-if="isRouterAlive")
modal-pipeline
flash-message
</template>

<script>
import { ref, nextTick, provide } from 'vue'
import ModalPipeline from '@/components/modal/ModalPipeline.vue'

export default {
  name: 'App',
  components: {
    ModalPipeline
  },
  setup () {
    const isRouterAlive = ref(true)

    const reloadRootRoute = async () => {
      isRouterAlive.value = false
      await nextTick()
      isRouterAlive.value = true
    }

    provide('reloadRootRoute', reloadRootRoute)

    return {
      isRouterAlive
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
