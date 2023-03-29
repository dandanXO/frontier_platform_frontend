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
import { computed } from 'vue'
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
    ModalCreateOrEditMoodboard: defineAsyncComponent(() =>
      import('@/components/moodboard/ModalCreateOrEditMoodboard.vue')
    ),
    ModalMoodboardShare: defineAsyncComponent(() =>
      import('@/components/moodboard/ModalMoodboardShare.vue')
    ),
    ModalMoodboardShareList: defineAsyncComponent(() =>
      import('@/components/moodboard/ModalMoodboardShareList.vue')
    ),
    ModalCreateOrEditMoodboardCollection: defineAsyncComponent(() =>
      import('@/components/moodboard/ModalCreateOrEditMoodboardCollection.vue')
    ),
    ModalMoodboardCollectionDetail: defineAsyncComponent(() =>
      import('@/components/moodboard/ModalMoodboardCollectionDetail.vue')
    ),
    ModalMoodboardMaterialDetail: defineAsyncComponent(() =>
      import('@/components/moodboard/ModalMoodboardMaterialDetail.vue')
    ),
    ModalU3mInstruction: defineAsyncComponent(() =>
      import('@/components/common/material/u3m/ModalU3mInstruction.vue')
    ),
    ModalIndicatorMethodology: defineAsyncComponent(() =>
      import(
        '@/components/common/material/detail/ModalIndicatorMethodology.vue'
      )
    ),
    ModalSendFeedback: defineAsyncComponent(() =>
      import('@/components/common/ModalSendFeedback.vue')
    ),
    ModalChooseSavePlace: defineAsyncComponent(() =>
      import('@/components/common/ModalChooseSavePlace.vue')
    ),
    ModalPrivacyPolicy: defineAsyncComponent(() =>
      import('@/components/common/ModalPrivacyPolicy.vue')
    ),
    ModalCloneTo: defineAsyncComponent(() =>
      import('@/components/common/ModalCloneTo.vue')
    ),
    ModalUploadFileGeneral: defineAsyncComponent(() =>
      import('@/components/common/ModalUploadFileGeneral.vue')
    ),
    ModalCropImage: defineAsyncComponent(() =>
      import('@/components/common/cropper/ModalCropImage.vue')
    ),
    ModalU3mSelectFileFormat: defineAsyncComponent(() =>
      import('@/components/common/material/u3m/ModalU3mSelectFileFormat.vue')
    ),
    ModalU3mDownloadConfirm: defineAsyncComponent(() =>
      import('@/components/common/material/u3m/ModalU3mDownloadConfirm.vue')
    ),
    ModalCollectionDetail: defineAsyncComponent(() =>
      import('@/components/common/ModalCollectionDetail.vue')
    ),
    ModalShareMessage: defineAsyncComponent(() =>
      import('@/components/common/ModalShareMessage.vue')
    ),
    ModalUploadThumbnail: defineAsyncComponent(() =>
      import('@/components/common/ModalUploadThumbnail.vue')
    ),
    ModalCreateMailOrg: defineAsyncComponent(() =>
      import('@/components/lobby/ModalCreateMailOrg.vue')
    ),
    ModalCreateOrg: defineAsyncComponent(() =>
      import('@/components/lobby/ModalCreateOrg.vue')
    ),
    ModalPersonalProfile: defineAsyncComponent(() =>
      import('@/components/lobby/ModalPersonalProfile.vue')
    ),
    ModalCreateGroup: defineAsyncComponent(() =>
      import('@/components/management/ModalCreateGroup.vue')
    ),
    ModalCreateMailGroup: defineAsyncComponent(() =>
      import('@/components/management/ModalCreateMailGroup.vue')
    ),
    ModalInviteToOrg: defineAsyncComponent(() =>
      import('@/components/management/ModalInviteToOrg.vue')
    ),
    ModalAddToGroup: defineAsyncComponent(() =>
      import('@/components/management/ModalAddToGroup.vue')
    ),
    ModalTypeTextToConfirm: defineAsyncComponent(() =>
      import('@/components/management/ModalTypeTextToConfirm.vue')
    ),
    ModalChooseStorage: defineAsyncComponent(() =>
      import('@/components/management/ModalChooseStorage.vue')
    ),
    ModalTermsOfUse: defineAsyncComponent(() =>
      import('@/components/account/ModalTermsOfUse.vue')
    ),
    ModalAskResetPassword: defineAsyncComponent(() =>
      import('@/components/account/ModalAskResetPassword.vue')
    ),
    ModalForgotPasswordEmail: defineAsyncComponent(() =>
      import('@/components/account/ModalForgotPasswordEmail.vue')
    ),
    ModalForgotPasswordCode: defineAsyncComponent(() =>
      import('@/components/account/ModalForgotPasswordCode.vue')
    ),
    ModalResetPassword: defineAsyncComponent(() =>
      import('@/components/account/ModalResetPassword.vue')
    ),
    ModalOrgUserProfile: defineAsyncComponent(() =>
      import('@/components/account/ModalOrgUserProfile.vue')
    ),
    ModalChangePassword: defineAsyncComponent(() =>
      import('@/components/account/ModalChangePassword.vue')
    ),
    ModalBackSideQrcode: defineAsyncComponent(() =>
      import('@/components/assets/ModalBackSideQrcode.vue')
    ),
    ModalSmartUpload: defineAsyncComponent(() =>
      import('@/components/assets/ModalSmartUpload.vue')
    ),
    ModalHowToScan: defineAsyncComponent(() =>
      import('@/components/assets/ModalHowToScan.vue')
    ),
    ModalMassUpload: defineAsyncComponent(() =>
      import('@/components/assets/ModalMassUpload.vue')
    ),
    ModalMassUploadErrorList: defineAsyncComponent(() =>
      import('@/components/assets/ModalMassUploadErrorList.vue')
    ),
    ModalMaterialNoList: defineAsyncComponent(() =>
      import('@/components/assets/progress/ModalMaterialNoList.vue')
    ),
    ModalAssetsList: defineAsyncComponent(() =>
      import('@/components/assets/ModalAssetsList.vue')
    ),
    ModalChangeCover: defineAsyncComponent(() =>
      import('@/components/assets/edit/ModalChangeCover.vue')
    ),
    ModalEditScannedImage: defineAsyncComponent(() =>
      import('@/components/assets/edit/ModalEditScannedImage.vue')
    ),
    ModalU3mPreview: defineAsyncComponent(() =>
      import('@/components/assets/ModalU3mPreview.vue')
    ),
    ModalWorkspaceNodeList: defineAsyncComponent(() =>
      import('@/components/workspace/ModalWorkspaceNodeList.vue')
    ),
    ModalCreateOrEditCollection: defineAsyncComponent(() =>
      import('@/components/workspace/ModalCreateOrEditCollection.vue')
    ),
    ModalCreateCollectionSimple: defineAsyncComponent(() =>
      import('@/components/workspace/ModalCreateCollectionSimple.vue')
    ),
    ModalShare: defineAsyncComponent(() =>
      import('@/components/workspace/ModalShare.vue')
    ),
    ModalPublish: defineAsyncComponent(() =>
      import('@/components/workspace/ModalPublish.vue')
    ),
    ModalShareAssigned: defineAsyncComponent(() =>
      import('@/components/workspace/ModalShareAssigned.vue')
    ),
    ModalShareAssignedList: defineAsyncComponent(() =>
      import('@/components/workspace/ModalShareAssignedList.vue')
    ),
    ModalManageMaterialQuota: defineAsyncComponent(() =>
      import('@/components/billings/ModalManageMaterialQuota.vue')
    ),
    ModalEditBillingInfo: defineAsyncComponent(() =>
      import('@/components/billings/ModalEditBillingInfo.vue')
    ),
    ModalSetupCard: defineAsyncComponent(() =>
      import('@/components/billings/ModalSetupCard.vue')
    ),
    ModalUpgradeEnterprise: defineAsyncComponent(() =>
      import('@/components/billings/ModalUpgradeEnterprise.vue')
    ),
    ModalPurchaseU3mQuota: defineAsyncComponent(() =>
      import('@/components/billings/ModalPurchaseU3mQuota.vue')
    ),
    ModalCheckoutList: defineAsyncComponent(() =>
      import('@/components/billings/ModalCheckoutList.vue')
    ),
    ModalTermsOfSubscription: defineAsyncComponent(() =>
      import('@/components/billings/ModalTermsOfSubscription.vue')
    ),
    ModalPaymentLastMonthFail: defineAsyncComponent(() =>
      import('@/components/billings/ModalPaymentLastMonthFail.vue')
    ),
    ModalPublicLibraryShare: defineAsyncComponent(() =>
      import('@/components/publicLibrary/ModalPublicLibraryShare.vue')
    ),
    ModalPublicLibraryShareAssigned: defineAsyncComponent(() =>
      import('@/components/publicLibrary/ModalPublicLibraryShareAssigned.vue')
    ),
    ModalTitasContactForm: defineAsyncComponent(() =>
      import('@/components/titas/ModalTitasContactForm.vue')
    ),
    ModalChangeLocale: defineAsyncComponent(() =>
      import('@/components/common/ModalChangeLocale.vue')
    ),
    ModalMaterialEditSimpleSpec: defineAsyncComponent(() =>
      import('@/components/assets/ModalMaterialEditSimpleSpec.vue')
    ),
    ModalMaterialEditSimpleInventory: defineAsyncComponent(() =>
      import('@/components/assets/ModalMaterialEditSimpleInventory.vue')
    ),
    ModalMaterialEditSimplePublicPrice: defineAsyncComponent(() =>
      import('@/components/assets/ModalMaterialEditSimplePublicPrice.vue')
    ),
    ModalMaterialEditSimpleTag: defineAsyncComponent(() =>
      import('@/components/assets/ModalMaterialEditSimpleTag.vue')
    ),
    ModalModelEditor: defineAsyncComponent(() =>
      import('@frontier/3d-viewer/src/components/ModelEditor.vue')
    ),
    ModalDigitalThreadSummary: defineAsyncComponent(() =>
      import('@/components/sticker/ModalDigitalThreadSummary.vue')
    ),
    ModalStickerDetail: defineAsyncComponent(() =>
      import('@/components/sticker/ModalStickerDetail.vue')
    ),
    ModalChooseStickerAddFrom: defineAsyncComponent(() =>
      import('@/components/receivedShare/ModalChooseStickerAddFrom.vue')
    ),
    ModalStickerMaterialDetail: defineAsyncComponent(() =>
      import('@/components/sticker/ModalStickerMaterialDetail.vue')
    ),
  },
  setup() {
    const store = useStore()
    const modalPipeline = computed(() => store.getters['helper/modalPipeline'])

    return {
      modalPipeline,
      MODAL_TYPE,
    }
  },
}
</script>
