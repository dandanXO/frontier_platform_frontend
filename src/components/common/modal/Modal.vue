<template lang="pug">
div(class="fixed inset-0 z-modal w-screen h-screen bg-black-900/30 flex justify-center items-center")
  div(class="w-screen h-screen" @click="closable && close()")
  div(class="absolute bg-black-0 rounded card-shadow")
    div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center")
      p(v-if="header !== ''" class="text-h6 font-bold text-primary") {{ header }}
      svg-icon(v-if="closable" iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="close")
    component(:is="component" v-bind="properties")
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import ModalLoading from '@/components/common/modal/ModalLoading.vue'

export default {
  name: 'Modal',
  components: {
    ModalLoading,
    ModalAskResetPassword: defineAsyncComponent(() => import('@/components/account/ModalAskResetPassword.vue')),
    ModalChangeAvatar: defineAsyncComponent(() => import('@/components/account/ModalChangeAvatar.vue')),
    ModalUploadLogo: defineAsyncComponent(() => import('@/components/management/ModalUploadLogo.vue')),
    ModalChangeCover: defineAsyncComponent(() => import('@/components/assets/edit/ModalChangeCover.vue')),
    ModalEditSimpleInfo: defineAsyncComponent(() => import('@/components/assets/ModalEditSimpleInfo.vue')),
    ModalViewer: defineAsyncComponent(() => import('@/components/common/material/u3m/ModalViewer.vue')),
    ModalCloneTo: defineAsyncComponent(() => import('@/components/ModalCloneTo.vue')),
    ModalUploadCoverImage: defineAsyncComponent(() => import('@/components/assets/edit/ModalUploadCoverImage.vue')),
    ModalWorkspaceNodeList: defineAsyncComponent(() => import('@/components/workspace/ModalWorkspaceNodeList.vue')),
    ModalCreateOrEditCollection: defineAsyncComponent(() => import('@/components/workspace/ModalCreateOrEditCollection.vue')),
    ModalCreateCollectionSimple: defineAsyncComponent(() => import('@/components/workspace/ModalCreateCollectionSimple.vue')),
    ModalCollectionDetail: defineAsyncComponent(() => import('@/components/ModalCollectionDetail.vue')),
    ModalAddToWorkspaceFail: defineAsyncComponent(() => import('@/components/assets/ModalAddToWorkspaceFail.vue')),
    ModalPreviewAttachment: defineAsyncComponent(() => import('@/components/common/material/attachment/ModalPreviewAttachment.vue')),
    ModalCropImage: defineAsyncComponent(() => import('@/components/ModalCropImage.vue')),
    ModalEditScannedImage: defineAsyncComponent(() => import('@/components/assets/edit/ModalEditScannedImage.vue')),
    ModalAssetsList: defineAsyncComponent(() => import('@/components/assets/ModalAssetsList.vue')),
    ModalU3mPreview: defineAsyncComponent(() => import('@/components/assets/ModalU3mPreview.vue')),
    ModalU3mSelectFileFormat: defineAsyncComponent(() => import('@/components/common/material/u3m/ModalU3mSelectFileFormat.vue')),
    ModalU3mDownloadConfirm: defineAsyncComponent(() => import('@/components/common/material/u3m/ModalU3mDownloadConfirm.vue')),
    ModalU3mRecut: defineAsyncComponent(() => import('@/components/assets/ModalU3mRecut.vue')),
    ModalPublish: defineAsyncComponent(() => import('@/components/workspace/ModalPublish.vue')),
    ModalMaterialMerge: defineAsyncComponent(() => import('@/components/assets/merge/ModalMaterialMerge.vue')),
    ModalMaterialMergePreview: defineAsyncComponent(() => import('@/components/assets/merge/ModalMaterialMergePreview.vue')),
    ModalShare: defineAsyncComponent(() => import('@/components/workspace/ModalShare.vue')),
    ModalShareAssigned: defineAsyncComponent(() => import('@/components/workspace/ModalShareAssigned.vue')),
    ModalShareAssignedList: defineAsyncComponent(() => import('@/components/workspace/ModalShareAssignedList.vue')),
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
    ModalPreviewInvoice: defineAsyncComponent(() => import('@/components/billings/ModalPreviewInvoice.vue')),
    ModalDeactivate: defineAsyncComponent(() => import('@/components/billings/ModalDeactivate.vue')),
    ModalDeactivateSuccess: defineAsyncComponent(() => import('@/components/billings/ModalDeactivateSuccess.vue')),
    ModalPaymentLastMonthFail: defineAsyncComponent(() => import('@/components/billings/ModalPaymentLastMonthFail.vue'))
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
