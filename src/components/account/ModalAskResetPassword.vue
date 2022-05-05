<template lang="pug">
div(class="w-115 px-8")
  p(class="text-primary text-body1 leading-1.6") {{ $t("AA0059") }}
  div(class="h-25 flex items-center justify-center")
    btn(size="lg" class="w-85" @click="openResetPassword") {{ $t("AA0060") }}
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'ModalAskResetPassword',
  props: {
    email: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const openResetPassword = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-reset-password',
        properties: {
          mode: 1,
          email: props.email
        }
      })
    }
    return {
      openResetPassword
    }
  }
}
</script>
