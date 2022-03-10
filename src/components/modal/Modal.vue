<template lang="pug">
div(class="fixed inset-0 z-index:modal w-screen h-screen bg-black-900 bg-opacity-30 flex justify-center items-center")
  div(class="w-screen h-screen" @click="closable && close()")
  div(class="absolute bg-black-0 rounded card-shadow")
    div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center")
      p(v-if="header !== ''" class="text-h6 font-bold text-primary") {{header}}
      svg-icon(v-if="closable" iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="close")
    component(:is="component" v-bind="properties")
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import ModalLoading from '@/components/modal/ModalLoading.vue'

export default {
  name: 'Modal',
  components: {
    ModalLoading,
    ModalCreateGroup: defineAsyncComponent(() => import('@/components/management/ModalCreateGroup.vue')),
    ModalUploadLogo: defineAsyncComponent(() => import('@/components/management/ModalUploadLogo.vue')),
    ModalInviteToOrg: defineAsyncComponent(() => import('@/components/management/ModalInviteToOrg.vue')),
    ModalAddToGroup: defineAsyncComponent(() => import('@/components/management/ModalAddToGroup.vue')),
    ModalCreateMailGroup: defineAsyncComponent(() => import('@/components/management/ModalCreateMailGroup.vue')),
    ModalCreateOrg: defineAsyncComponent(() => import('@/components/lobby/ModalCreateOrg.vue')),
    ModalDeleteOrgOrGroup: defineAsyncComponent(() => import('@/components/management/ModalDeleteOrgOrGroup.vue')),
    ModalCreateMailOrg: defineAsyncComponent(() => import('@/components/lobby/ModalCreateMailOrg.vue')),
    ModalForgotPasswordEmail: defineAsyncComponent(() => import('@/components/account/ModalForgotPasswordEmail.vue')),
    ModalForgotPasswordCode: defineAsyncComponent(() => import('@/components/account/ModalForgotPasswordCode.vue')),
    ModalResetPassword: defineAsyncComponent(() => import('@/components/account/ModalResetPassword.vue')),
    ModalAskResetPassword: defineAsyncComponent(() => import('@/components/account/ModalAskResetPassword.vue')),
    ModalChooseStorage: defineAsyncComponent(() => import('@/components/management/ModalChooseStorage.vue')),
    ModalHowToScan: defineAsyncComponent(() => import('@/components/assets/material/ModalHowToScan.vue')),
    ModalChangeCover: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalChangeCover.vue')),
    ModalEditSimpleInfo: defineAsyncComponent(() => import('@/components/assets/material/list/ModalEditSimpleInfo.vue')),
    ModalViewer: defineAsyncComponent(() => import('@/components/assets/material/ModalViewer.vue')),
    ModalCloneTo: defineAsyncComponent(() => import('@/components/ModalCloneTo.vue')),
    ModalError: defineAsyncComponent(() => import('@/components/modal/ModalError.vue')),
    ModalUploadAttachment: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalUploadAttachment.vue')),
    ModalUploadCoverImage: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalUploadCoverImage.vue')),
    ModalWorkspaceNodeList: defineAsyncComponent(() => import('@/components/workspace/ModalWorkspaceNodeList.vue')),
    ModalCreateOrEditCollection: defineAsyncComponent(() => import('@/components/workspace/ModalCreateOrEditCollection.vue')),
    ModalCreateCollectionSimple: defineAsyncComponent(() => import('@/components/workspace/ModalCreateCollectionSimple.vue')),
    ModalCollectionDetail: defineAsyncComponent(() => import('@/components/ModalCollectionDetail.vue')),
    ModalAddToWorkspaceFail: defineAsyncComponent(() => import('@/components/assets/material/ModalAddToWorkspaceFail.vue')),
    ModalPreviewAttachment: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalPreviewAttachment.vue')),
    ModalCropImage: defineAsyncComponent(() => import('@/components/ModalCropImage.vue')),
    ModalEditScannedImage: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalEditScannedImage.vue')),
    ModalAssetsList: defineAsyncComponent(() => import('@/components/assets/material/ModalAssetsList.vue')),
    ModalVerifyNotification: defineAsyncComponent(() => import('@/components/lobby/ModalVerifyNotification.vue')),
    ModalU3mInstruction: defineAsyncComponent(() => import('@/components/assets/material/ModalU3mInstruction.vue')),
    ModalU3mPreview: defineAsyncComponent(() => import('@/components/assets/material/ModalU3mPreview.vue')),
    ModalU3mSelectFileFormat: defineAsyncComponent(() => import('@/components/assets/material/ModalU3mSelectFileFormat.vue')),
    ModalU3mDownloadConfirm: defineAsyncComponent(() => import('@/components/assets/material/ModalU3mDownloadConfirm.vue')),
    ModalU3mCreateSuccess: defineAsyncComponent(() => import('@/components/assets/material/ModalU3mCreateSuccess.vue')),
    ModalU3mCreateFail: defineAsyncComponent(() => import('@/components/assets/material/ModalU3mCreateFail.vue')),
    ModalU3mRecut: defineAsyncComponent(() => import('@/components/assets/material/ModalU3mRecut.vue')),
    ModalPublish: defineAsyncComponent(() => import('@/components/workspace/ModalPublish.vue')),
    ModalOrgUserProfile: defineAsyncComponent(() => import('@/components/account/ModalOrgUserProfile.vue')),
    ModalChangePassword: defineAsyncComponent(() => import('@/components/account/ModalChangePassword.vue')),
    ModalChangeAvatar: defineAsyncComponent(() => import('@/components/account/ModalChangeAvatar.vue')),
    ModalPersonalProfile: defineAsyncComponent(() => import('@/components/lobby/ModalPersonalProfile.vue')),
    ModalPrivacyPolicy: defineAsyncComponent(() => import('@/components/ModalPrivacyPolicy.vue')),
    ModalTermsOfUse: defineAsyncComponent(() => import('@/components/ModalTermsOfUse.vue')),
    ModalMassUpload: defineAsyncComponent(() => import('@/components/assets/material/ModalMassUpload.vue')),
    ModalMassUploadErrorList: defineAsyncComponent(() => import('@/components/assets/material/ModalMassUploadErrorList.vue')),
    ModalSendFeedback: defineAsyncComponent(() => import('@/components/ModalSendFeedback.vue')),
    ModalMaterialMerge: defineAsyncComponent(() => import('@/components/assets/merge/ModalMaterialMerge.vue')),
    ModalMaterialMergePreview: defineAsyncComponent(() => import('@/components/assets/merge/ModalMaterialMergePreview.vue')),
    ModalShare: defineAsyncComponent(() => import('@/components/workspace/ModalShare.vue')),
    ModalShareAssigned: defineAsyncComponent(() => import('@/components/workspace/ModalShareAssigned.vue')),
    ModalShareAssignedList: defineAsyncComponent(() => import('@/components/workspace/ModalShareAssignedList.vue')),
    ModalReceivedShareChooseStorage: defineAsyncComponent(() => import('@/components/receivedShare/ModalReceivedShareChooseStorage.vue')),
    ModalPublicLibraryShare: defineAsyncComponent(() => import('@/components/publicLibrary/ModalPublicLibraryShare.vue')),
    ModalPublicLibraryShareAssigned: defineAsyncComponent(() => import('@/components/publicLibrary/ModalPublicLibraryShareAssigned.vue')),
    ModalShareMessage: defineAsyncComponent(() => import('@/components/ModalShareMessage.vue')),
    ModalEditBillingInfo: defineAsyncComponent(() => import('@/components/billings/ModalEditBillingInfo.vue')),
    ModalSetupCard: defineAsyncComponent(() => import('@/components/billings/ModalSetupCard.vue')),
    ModalChoosePlan: defineAsyncComponent(() => import('@/components/billings/ModalChoosePlan.vue')),
    ModalPaymentSuccess: defineAsyncComponent(() => import('@/components/billings/ModalPaymentSuccess.vue')),
    ModalPlanIntroduction: defineAsyncComponent(() => import('@/components/billings/ModalPlanIntroduction.vue')),
    ModalUpgradeEnterprise: defineAsyncComponent(() => import('@/components/billings/ModalUpgradeEnterprise.vue')),
    ModalManageMaterialQuota: defineAsyncComponent(() => import('@/components/billings/ModalManageMaterialQuota.vue')),
    ModalPurchaseU3mQuota: defineAsyncComponent(() => import('@/components/billings/ModalPurchaseU3mQuota.vue')),
    ModalCheckoutList: defineAsyncComponent(() => import('@/components/billings/ModalCheckoutList.vue')),
    ModalTermsOfSubscription: defineAsyncComponent(() => import('@/components/ModalTermsOfSubscription.vue')),
    ModalPaymentFail: defineAsyncComponent(() => import('@/components/billings/ModalPaymentFail.vue')),
    ModalPreviewInvoice: defineAsyncComponent(() => import('@/components/billings/ModalPreviewInvoice.vue'))
  },
  props: {
    component: {
      type: String,
      required: true
    },
    header: {
      type: String,
      default: ''
    },
    properties: {
      type: Object
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  setup () {
    const store = useStore()
    const close = () => {
      store.dispatch('helper/closeModal')
    }

    return {
      close
    }
  }
}
</script>
