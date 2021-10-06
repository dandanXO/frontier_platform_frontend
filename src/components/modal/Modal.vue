<template lang="pug">
div(class="fixed inset-0 z-index:modal w-screen h-screen bg-black-900 bg-opacity-70 flex justify-center items-center")
  div(class="w-screen h-screen" @click="closable && close()")
  div(class="absolute bg-black-0 rounded card-shadow")
    div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center")
      p(v-if="header !== ''" class="text-body1 text-primary") {{header}}
      svg-icon(v-if="closable" iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="close")
    component(:is="component" v-bind="properties")
</template>

<script>
import { useStore } from 'vuex'
import ModalCreateGroup from '@/components/management/ModalCreateGroup.vue'
import ModalUpload from '@/components/management/ModalUpload.vue'
import ModalInviteToOrg from '@/components/management/ModalInviteToOrg.vue'
import ModalAddToGroup from '@/components/management/ModalAddToGroup.vue'
import ModalCreateMailGroup from '@/components/management/ModalCreateMailGroup.vue'
import ModalCreateOrg from '@/components/lobby/ModalCreateOrg.vue'
import ModalDeleteOrgOrGroup from '@/components/management/ModalDeleteOrgOrGroup'
import ModalCreateMailOrg from '@/components/lobby/ModalCreateMailOrg.vue'
import ModalForgotPasswordEmail from '@/components/account/ModalForgotPasswordEmail.vue'
import ModalForgotPasswordCode from '@/components/account/ModalForgotPasswordCode.vue'
import ModalResetPassword from '@/components/account/ModalResetPassword.vue'
import ModalAskResetPassword from '@/components/account/ModalAskResetPassword.vue'
import ModalChooseStorage from '@/components/management/ModalChooseStorage'

export default {
  name: 'Modal',
  components: {
    ModalCreateGroup,
    ModalUpload,
    ModalInviteToOrg,
    ModalAddToGroup,
    ModalCreateMailGroup,
    ModalCreateOrg,
    ModalDeleteOrgOrGroup,
    ModalCreateMailOrg,
    ModalForgotPasswordEmail,
    ModalForgotPasswordCode,
    ModalResetPassword,
    ModalAskResetPassword,
    ModalChooseStorage
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
