<template lang="pug">
template(v-if="modalPipeline.length > 0")
  template(v-for="modal in modalPipeline")
    template(v-if="modal.type === MODAL_TYPE.MODAL")
      modal(v-bind="modal.options")
    template(v-else-if="modal.type === MODAL_TYPE.FULLSCREEN")
      modal-fullscreen(v-bind="modal.options")
    template(v-else-if="modal.type === MODAL_TYPE.CONFIRM")
      modal-confirm(v-bind="modal.options")
    template(v-else-if="modal.type === MODAL_TYPE.LOADING")
      modal-loading
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
import Modal from '@/components/modal/Modal.vue'
import ModalFullscreen from '@/components/modal/ModalFullscreen.vue'
import ModalConfirm from '@/components/modal/ModalConfirm.vue'
import ModalLoading from '@/components/modal/ModalLoading'
import { MODAL_TYPE } from '@/utils/constants'

export default {
  name: 'ModalPipeline',
  components: {
    Modal,
    ModalFullscreen,
    ModalConfirm,
    ModalLoading
  },
  setup () {
    const store = useStore()
    const modalPipeline = computed(() => store.getters['helper/modalPipeline'])

    return {
      modalPipeline,
      MODAL_TYPE
    }
  }
}
</script>
