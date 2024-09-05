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
    template(v-if="modal.type === MODAL_TYPE.COMMON")
      suspense(:key="modal.options.component")
        modal-common(v-bind="modal.options")
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
import ModalCommon from '@/components/common/modal/ModalCommon.vue'
import ModalLoading from '@/components/common/modal/ModalLoading.vue'
import { MODAL_TYPE } from '@/utils/constants'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'ModalPipeline',
  components: {
    Modal,
    ModalConfirm,
    ModalLoading,
    ModalCommon,
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
    ModalCollectionDetail: defineAsyncComponent(() =>
      import('@/components/common/collection/ModalCollectionDetail.vue')
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
    ModalSignUpRequest: defineAsyncComponent(() =>
      import('@/components/account/ModalSignUpRequest.vue')
    ),
    ModalSmartUpload: defineAsyncComponent(() =>
      import('@/components/assets/ModalSmartUpload.vue')
    ),
    ModalPictureCheckUpload: defineAsyncComponent(() =>
      import('@/components/assets/ModalPictureCheckUpload.vue')
    ),
    Modal3DFileUpload: defineAsyncComponent(() =>
      import('@/components/assets/Modal3DFileUpload.vue')
    ),
    ModalHowToScan: defineAsyncComponent(() =>
      import('@/components/assets/ModalHowToScan.vue')
    ),
    ModalMaterialNoList: defineAsyncComponent(() =>
      import('@/components/assets/progress/ModalMaterialNoList.vue')
    ),
    ModalItemNoList: defineAsyncComponent(() =>
      import('@/components/common/material/ModalItemNoList.vue')
    ),
    ModalAssetsList: defineAsyncComponent(() =>
      import('@/components/assets/ModalAssetsList.vue')
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
    ModalShareOg: defineAsyncComponent(() =>
      import('@/components/workspace/ModalShareOg.vue')
    ),
    ModalShareAssignedMessage: defineAsyncComponent(() =>
      import('@/components/workspace/ModalShareAssignedMessage.vue')
    ),
    ModalShareEmail: defineAsyncComponent(() =>
      import('@/components/workspace/ModalShareEmail.vue')
    ),
    ModalShareEmailEmbed: defineAsyncComponent(() =>
      import('@/components/workspace/ModalShareEmailEmbed.vue')
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
    ModalShowroomContactForm: defineAsyncComponent(() =>
      import('@/components/showroom/ModalShowroomContactForm.vue')
    ),
    ModalChangeLocale: defineAsyncComponent(() =>
      import('@/components/common/ModalChangeLocale.vue')
    ),
    ModalMaterialEditSimpleSpec: defineAsyncComponent(() =>
      import('@/components/assets/edit/ModalMaterialEditSimpleSpec.vue')
    ),
    ModalMaterialEditSimpleInventory: defineAsyncComponent(() =>
      import('@/components/assets/edit/ModalMaterialEditSimpleInventory.vue')
    ),
    ModalMaterialEditSimplePublicPrice: defineAsyncComponent(() =>
      import('@/components/assets/edit/ModalMaterialEditSimplePublicPrice.vue')
    ),
    ModalMaterialEditSimpleTag: defineAsyncComponent(() =>
      import('@/components/assets/edit/ModalMaterialEditSimpleTag.vue')
    ),
    Modal3dViewer: defineAsyncComponent(() =>
      import('@/components/common/material/u3m/Modal3dViewer.vue')
    ),
    Modal3dViewerReact: defineAsyncComponent(() =>
      import('@/components/common/material/u3m/Modal3DViwerReact.vue')
    ),
    ModalDigitalThreadSummary: defineAsyncComponent(() =>
      import('@/components/sticker/ModalDigitalThreadSummary.vue')
    ),
    ModalStickerDetail: defineAsyncComponent(() =>
      import('@/components/sticker/ModalStickerDetail.vue')
    ),
    ModalChooseStickerAddFrom: defineAsyncComponent(() =>
      import('@/components/outerApp/ModalChooseStickerAddFrom.vue')
    ),
    ModalStickerMaterialDetail: defineAsyncComponent(() =>
      import('@/components/sticker/ModalStickerMaterialDetail.vue')
    ),
    ModalWorkflowStageDeleteErrorList: defineAsyncComponent(() =>
      import('@/components/threadBoard/ModalWorkflowStageDeleteErrorList.vue')
    ),
    ModalCreateOrEditBookmarkFolder: defineAsyncComponent(() =>
      import(
        '@/components/threadBoard/bookmark/ModalCreateOrEditBookmarkFolder.vue'
      )
    ),
    ModalBookmarkManager: defineAsyncComponent(() =>
      import(
        '@/components/threadBoard/bookmark/modalBookmarkManager/ModalBookmarkManager.vue'
      )
    ),
    ModalU3mDownload: defineAsyncComponent(() =>
      import('@/components/common/material/u3m/ModalU3mDownload.vue')
    ),
    ModalUploadU3mFile: defineAsyncComponent(() =>
      import('@/components/common/material/u3m/ModalUploadU3mFile.vue')
    ),
    ModalRenameFile: defineAsyncComponent(() =>
      import('@/components/common/material/file/ModalRenameFile.vue')
    ),
    ModalUploadAttachment: defineAsyncComponent(() =>
      import('@/components/assets/edit/ModalUploadAttachment.vue')
    ),
    ModalScannedImageUpdate: defineAsyncComponent(() =>
      import(
        '@/components/common/material/scannedImage/ModalScannedImageUpdate.vue'
      )
    ),
    ModalMaterialSpecification: defineAsyncComponent(() =>
      import(
        '@/components/common/material/detail/external/ModalMaterialSpecification.vue'
      )
    ),
    ModalLabelPreview: defineAsyncComponent(() =>
      import('@/components/assets/labelPreview/ModalLabelPreview.vue')
    ),
    ModalLabelPreviewCustom: defineAsyncComponent(() =>
      import('@/components/assets/labelPreview/custom/ModalLabelPreview.vue')
    ),
    ModalVideoShow: defineAsyncComponent(() =>
      import('@/components/common/ModalvideoShow.vue')
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
