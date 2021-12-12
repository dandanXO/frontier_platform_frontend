<template lang="pug">
div(class="fixed inset-0 z-index:modal w-screen h-screen bg-black-900 bg-opacity-70 flex justify-center items-center")
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
import ModalLoading from '@/components/modal/ModalLoading'

export default {
  name: 'Modal',
  components: {
    ModalLoading,
    ModalCreateGroup: defineAsyncComponent(() => import('@/components/management/ModalCreateGroup')),
    ModalUploadLogo: defineAsyncComponent(() => import('@/components/management/ModalUploadLogo')),
    ModalInviteToOrg: defineAsyncComponent(() => import('@/components/management/ModalInviteToOrg')),
    ModalAddToGroup: defineAsyncComponent(() => import('@/components/management/ModalAddToGroup')),
    ModalCreateMailGroup: defineAsyncComponent(() => import('@/components/management/ModalCreateMailGroup')),
    ModalCreateOrg: defineAsyncComponent(() => import('@/components/lobby/ModalCreateOrg')),
    ModalDeleteOrgOrGroup: defineAsyncComponent(() => import('@/components/management/ModalDeleteOrgOrGroup')),
    ModalCreateMailOrg: defineAsyncComponent(() => import('@/components/lobby/ModalCreateMailOrg')),
    ModalForgotPasswordEmail: defineAsyncComponent(() => import('@/components/account/ModalForgotPasswordEmail')),
    ModalForgotPasswordCode: defineAsyncComponent(() => import('@/components/account/ModalForgotPasswordCode')),
    ModalResetPassword: defineAsyncComponent(() => import('@/components/account/ModalResetPassword')),
    ModalAskResetPassword: defineAsyncComponent(() => import('@/components/account/ModalAskResetPassword')),
    ModalChooseStorage: defineAsyncComponent(() => import('@/components/management/ModalChooseStorage')),
    ModalHowToScan: defineAsyncComponent(() => import('@/components/assets/material/ModalHowToScan')),
    ModalChangeCover: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalChangeCover')),
    ModalEditSimpleInfo: defineAsyncComponent(() => import('@/components/assets/material/list/ModalEditSimpleInfo')),
    ModalViewer: defineAsyncComponent(() => import('@/components/assets/material/ModalViewer')),
    ModalCloneTo: defineAsyncComponent(() => import('@/components/ModalCloneTo')),
    ModalError: defineAsyncComponent(() => import('@/components/modal/ModalError')),
    ModalUploadAttachment: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalUploadAttachment.vue')),
    ModalWorkspaceNodeList: defineAsyncComponent(() => import('@/components/workspace/ModalWorkspaceNodeList.vue')),
    ModalCreateOrEditCollection: defineAsyncComponent(() => import('@/components/workspace/ModalCreateOrEditCollection.vue')),
    ModalCreateCollectionSimple: defineAsyncComponent(() => import('@/components/workspace/ModalCreateCollectionSimple.vue')),
    ModalCollectionDetail: defineAsyncComponent(() => import('@/components/workspace/ModalCollectionDetail.vue')),
    ModalAddToWorkspaceFail: defineAsyncComponent(() => import('@/components/assets/material/ModalAddToWorkspaceFail.vue')),
    ModalPreviewAttachment: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalPreviewAttachment')),
    ModalCropImage: defineAsyncComponent(() => import('@/components/imageCropper/ModalCropImage')),
    ModalEditScannedImage: defineAsyncComponent(() => import('@/components/imageCropper/scannedImageCropper/ModalEditScannedImage')),
    ModalAssetsList: defineAsyncComponent(() => import('@/components/assets/material/ModalAssetsList.vue')),
    ModalVerifyNotification: defineAsyncComponent(() => import('@/components/lobby/ModalVerifyNotification.vue')),
    ModalPublish: defineAsyncComponent(() => import('@/components/workspace/ModalPublish.vue')),
    ModalPublicLibraryCollectionDetail: defineAsyncComponent(() => import('@/components/publicLibrary/ModalPublicLibraryCollectionDetail.vue'))
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
