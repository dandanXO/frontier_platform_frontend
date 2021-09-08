<template lang="pug">
router-view
modal-confirm
modal
</template>

<script>
import ModalConfirm from '@/components/modal/ModalConfirm.vue'
import Modal from '@/components/modal/Modal.vue'

export default {
  name: 'App',
  components: {
    ModalConfirm,
    Modal
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
