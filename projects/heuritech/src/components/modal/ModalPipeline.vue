<template lang="pug">
template(v-if="modalPipeline.length > 0")
  template(v-for="modal in modalPipeline")
    template(v-if="modal.type === MODAL_TYPE.MODAL")
      suspense
        modal(v-bind="modal.options" :key="modal.options.component")
        template(#fallback)
          modal-loading(v-bind="modal.options")
    template(v-else-if="modal.type === MODAL_TYPE.BEHAVIOR")
      suspense
        component(
          :is="modal.options.component"
          :key="modal.options.component"
          v-bind="modal.options.properties"
        )
        template(#fallback)
          modal-loading(v-bind="modal.options")
    template(v-else-if="modal.type === MODAL_TYPE.CONFIRM")
      modal-confirm(v-bind="modal.options")
    template(v-else-if="modal.type === MODAL_TYPE.LOADING")
      modal-loading(v-bind="modal.options")
</template>

<script>
import Modal from '@/components/modal/Modal.vue'
import ModalConfirm from '@/components/modal/ModalConfirm.vue'
import ModalLoading from '@/components/modal/ModalLoading.vue'
import { MODAL_TYPE } from '@/utils/constants'
import { defineAsyncComponent } from 'vue'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

export default {
  name: 'ModalPipeline',
  components: {
    Modal,
    ModalConfirm,
    ModalLoading,

    Modal3dViewer: defineAsyncComponent(() =>
      import('@/components/material/u3m/Modal3dViewer.vue')
    ),
  },
  setup() {
    const { modalPipeline } = storeToRefs(useModalStore())

    return {
      modalPipeline,
      MODAL_TYPE,
    }
  },
}
</script>
