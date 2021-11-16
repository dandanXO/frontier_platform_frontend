<template lang="pug">
div(class="fixed inset-0 z-index:modal w-screen h-screen bg-black-900 bg-opacity-70 flex justify-center items-center")
  div(class="w-screen h-screen" @click="closable && close()")
  div(class="absolute bg-black-0 rounded card-shadow")
    div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center")
      p(v-if="header !== ''" class="text-h6 font-bold text-primary") {{header}}
      svg-icon(v-if="closable" iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="close")
    suspense
      component(:is="component" v-bind="properties")
      template(#fallback)
        modal-loading
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import ModalLoading from '@/components/modal/ModalLoading'

export default {
  name: 'Modal',
  components: {
    ModalLoading,
    ModalCreateGroup: defineAsyncComponent(() => import('@/components/management/ModalCreateGroup.vue')),
    ModalUpload: defineAsyncComponent(() => import('@/components/management/ModalUpload.vue')),
    ModalInviteToOrg: defineAsyncComponent(() => import('@/components/management/ModalInviteToOrg.vue')),
    ModalAddToGroup: defineAsyncComponent(() => import('@/components/management/ModalAddToGroup.vue')),
    ModalCreateMailGroup: defineAsyncComponent(() => import('@/components/management/ModalCreateMailGroup.vue')),
    ModalCreateOrg: defineAsyncComponent(() => import('@/components/lobby/ModalCreateOrg.vue')),
    ModalDeleteOrgOrGroup: defineAsyncComponent(() => import('@/components/management/ModalDeleteOrgOrGroup')),
    ModalCreateMailOrg: defineAsyncComponent(() => import('@/components/lobby/ModalCreateMailOrg.vue')),
    ModalForgotPasswordEmail: defineAsyncComponent(() => import('@/components/account/ModalForgotPasswordEmail.vue')),
    ModalForgotPasswordCode: defineAsyncComponent(() => import('@/components/account/ModalForgotPasswordCode.vue')),
    ModalResetPassword: defineAsyncComponent(() => import('@/components/account/ModalResetPassword.vue')),
    ModalAskResetPassword: defineAsyncComponent(() => import('@/components/account/ModalAskResetPassword.vue')),
    ModalChooseStorage: defineAsyncComponent(() => import('@/components/management/ModalChooseStorage')),
    ModalHowToScan: defineAsyncComponent(() => import('@/components/assets/material/ModalHowToScan')),
    ModalChangeCover: defineAsyncComponent(() => import('@/components/assets/material/edit/ModalChangeCover')),
    ModalEditSimpleInfo: defineAsyncComponent(() => import('@/components/assets/material/list/ModalEditSimpleInfo')),
    ModalViewer: defineAsyncComponent(() => import('@/components/assets/material/ModalViewer')),
    ModalError: defineAsyncComponent(() => import('@/components/modal/ModalError'))
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
