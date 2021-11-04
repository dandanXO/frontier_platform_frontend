<template lang="pug">
router-view
flash-message
</template>

<script>
import ModalPipeline from '@/components/modal/ModalPipeline.vue'

export default {
  name: 'App',
  components: {
    ModalPipeline
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
