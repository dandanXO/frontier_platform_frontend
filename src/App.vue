<template lang="pug">
router-view
flash-message
modal(v-if="isShowModalError" component="modal-error" :closable="false")
modal-pipeline
</template>

<script>
import Modal from '@/components/modal/Modal.vue'
import ModalPipeline from '@/components/modal/ModalPipeline.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'App',
  components: {
    Modal,
    ModalPipeline
  },
  setup () {
    const store = useStore()
    const isShowModalError = computed(() => store.getters['helper/isShowModalError'])

    return {
      isShowModalError
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
