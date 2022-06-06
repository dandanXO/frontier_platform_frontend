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
import Modal from '@/components/common/modal/Modal.vue'
import ModalConfirm from '@/components/common/modal/ModalConfirm.vue'
import ModalLoading from '@/components/common/modal/ModalLoading.vue'
import { MODAL_TYPE } from '@/utils/constants'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'ModalPipeline',
  components: {
    Modal,
    ModalConfirm,
    ModalLoading,
    ModalManageMaterialQuota: defineAsyncComponent(() => import('@/components/billings/ModalManageMaterialQuota.vue')),
    ModalCloneTo: defineAsyncComponent(() => import('@/components/common/ModalCloneTo.vue')),
    ModalBackSideQrcode: defineAsyncComponent(() => import('@/components/assets/ModalBackSideQrcode.vue')),
    ModalSmartUpload: defineAsyncComponent(() => import('@/components/assets/ModalSmartUpload.vue')),
    ModalHowToScan: defineAsyncComponent(() => import('@/components/assets/ModalHowToScan.vue')),
    ModalMassUpload: defineAsyncComponent(() => import('@/components/assets/ModalMassUpload.vue')),
    ModalMassUploadErrorList: defineAsyncComponent(() => import('@/components/assets/ModalMassUploadErrorList.vue')),
    ModalUploadAttachment: defineAsyncComponent(() => import('@/components/assets/edit/ModalUploadAttachment.vue')),
    ModalMaterialNoList: defineAsyncComponent(() => import('@/components/assets/progress/ModalMaterialNoList.vue')),
    ModalCreateOrEditMoodboard: defineAsyncComponent(() => import('@/components/moodboard/ModalCreateOrEditMoodboard.vue')),
    ModalMoodboardShare: defineAsyncComponent(() => import('@/components/moodboard/ModalMoodboardShare.vue')),
    ModalMoodboardShareList: defineAsyncComponent(() => import('@/components/moodboard/ModalMoodboardShareList.vue')),
    ModalAssetsList: defineAsyncComponent(() => import('@/components/assets/ModalAssetsList.vue')),
    ModalCreateOrEditMoodboardCollection: defineAsyncComponent(() => import('@/components/moodboard/ModalCreateOrEditMoodboardCollection.vue')),
    ModalU3mInstruction: defineAsyncComponent(() => import('@/components/common/material/u3m/ModalU3mInstruction.vue')),
    ModalIndicatorMethodology: defineAsyncComponent(() => import('@/components/common/material/detail/ModalIndicatorMethodology.vue')),
    ModalSendFeedback: defineAsyncComponent(() => import('@/components/common/ModalSendFeedback.vue')),
    ModalMoodboardMaterialDetail: defineAsyncComponent(() => import('@/components/moodboard/ModalMoodboardMaterialDetail.vue')),
    ModalChooseSavePlace: defineAsyncComponent(() => import('@/components/common/ModalChooseSavePlace.vue')),
    ModalPrivacyPolicy: defineAsyncComponent(() => import('@/components/common/ModalPrivacyPolicy.vue')),
    ModalTermsOfUse: defineAsyncComponent(() => import('@/components/account/ModalTermsOfUse.vue')),
    ModalCreateMailOrg: defineAsyncComponent(() => import('@/components/lobby/ModalCreateMailOrg.vue')),
    ModalCreateOrg: defineAsyncComponent(() => import('@/components/lobby/ModalCreateOrg.vue')),
    ModalPersonalProfile: defineAsyncComponent(() => import('@/components/lobby/ModalPersonalProfile.vue')),
    ModalVerifyNotification: defineAsyncComponent(() => import('@/components/lobby/ModalVerifyNotification.vue')),
    ModalCreateGroup: defineAsyncComponent(() => import('@/components/management/ModalCreateGroup.vue')),
    ModalCreateMailGroup: defineAsyncComponent(() => import('@/components/management/ModalCreateMailGroup.vue')),
    ModalInviteToOrg: defineAsyncComponent(() => import('@/components/management/ModalInviteToOrg.vue')),
    ModalAddToGroup: defineAsyncComponent(() => import('@/components/management/ModalAddToGroup.vue')),
    ModalTypeTextToConfirm: defineAsyncComponent(() => import('@/components/management/ModalTypeTextToConfirm.vue')),
    ModalChooseStorage: defineAsyncComponent(() => import('@/components/management/ModalChooseStorage.vue')),
    ModalForgotPasswordEmail: defineAsyncComponent(() => import('@/components/account/ModalForgotPasswordEmail.vue')),
    ModalForgotPasswordCode: defineAsyncComponent(() => import('@/components/account/ModalForgotPasswordCode.vue')),
    ModalResetPassword: defineAsyncComponent(() => import('@/components/account/ModalResetPassword.vue')),
    ModalOrgUserProfile: defineAsyncComponent(() => import('@/components/account/ModalOrgUserProfile.vue')),
    ModalChangePassword: defineAsyncComponent(() => import('@/components/account/ModalChangePassword.vue')),
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
