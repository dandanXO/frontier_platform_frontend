<template lang="pug">
router-view
flash-message
modal-pipeline
</template>

<script>
import Modal from '@/components/modal/Modal.vue'
import ModalPipeline from '@/components/modal/ModalPipeline.vue'

export default {
  name: 'App',
  components: {
    Modal,
    ModalPipeline
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
