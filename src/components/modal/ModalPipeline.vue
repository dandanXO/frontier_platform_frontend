<template lang="pug">
template(v-if="modalPipeline.length > 0")
  template(v-for="modal in modalPipeline")
    template(v-if="modal.type === MODAL_TYPE.MODAL")
      suspense
        modal(v-bind="modal.options" :key="modal.options.component")
        template(#fallback)
          modal-loading
    template(v-else-if="modal.type === MODAL_TYPE.BEHAVIOR")
      suspense
        component(:is="modal.options.component" :key="modal.options.component" v-bind="modal.options.properties")
        template(#fallback)
          modal-loading
    template(v-else-if="modal.type === MODAL_TYPE.CONFIRM")
      modal-confirm(v-bind="modal.options")
    template(v-else-if="modal.type === MODAL_TYPE.LOADING")
      modal-loading
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
import Modal from '@/components/modal/Modal.vue'
import ModalConfirm from '@/components/modal/ModalConfirm.vue'
import ModalLoading from '@/components/modal/ModalLoading.vue'
import { MODAL_TYPE } from '@/utils/constants'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'ModalPipeline',
  components: {
    Modal,
    ModalConfirm,
    ModalLoading,
    ModalManageMaterialQuota: defineAsyncComponent(() => import('@/components/billings/ModalManageMaterialQuota.vue')),
    ModalCloneTo: defineAsyncComponent(() => import('@/components/ModalCloneTo.vue')),
    ModalBackSideQrcode: defineAsyncComponent(() => import('@/components/assets/material/ModalBackSideQrcode.vue')),
    ModalSmartUpload: defineAsyncComponent(() => import('@/components/assets/material/ModalSmartUpload.vue')),
    ModalHowToScan: defineAsyncComponent(() => import('@/components/assets/material/ModalHowToScan.vue')),
    ModalMassUpload: defineAsyncComponent(() => import('@/components/assets/material/ModalMassUpload.vue')),
    ModalMassUploadErrorList: defineAsyncComponent(() => import('@/components/assets/material/ModalMassUploadErrorList.vue')),
    ModalUploadAttachment: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalUploadAttachment.vue')),
    ModalMaterialNoList: defineAsyncComponent(() => import('@/components/ModalMaterialNoList.vue')),
    ModalCreateOrEditMoodboard: defineAsyncComponent(() => import('@/components/moodboard/ModalCreateOrEditMoodboard.vue')),
    ModalMoodboardShare: defineAsyncComponent(() => import('@/components/moodboard/ModalMoodboardShare.vue')),
    ModalMoodboardShareList: defineAsyncComponent(() => import('@/components/moodboard/ModalMoodboardShareList.vue'))
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
