<template lang="pug">
router-view
modal-confirm
</template>

<script>
import ModalConfirm from '@/components/modal/ModalConfirm.vue'

export default {
  name: 'App',
  components: {
    ModalConfirm
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
