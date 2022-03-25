<template lang="pug">
div(class="w-100 px-8")
  div(class="flex flex-col items-center")
    svg-icon(iconName="send-mail" size="68" class="mb-4")
    p(class="text-h6 text-primary font-bold mb-4") {{ $t("AA0047") }}
    p(class="max-w-58 text-body2 text-primary text-center leading-1.6 mb-4") {{ $t("AA0048", { email }) }}
    input-text(v-model:textValue="verifyCode" class="w-72" size="lg" :placeholder="$t('AA0076')" :customErrorMsg="errorMsg")
  div(class="h-25 flex justify-center items-center")
    div(class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" class="h-10" @click="sendForgotPasswordEmail") {{ $t("UU0051") }}
      btn(size="md" class="h-10" @click="verifyForgotPasswordCode") {{ $t("UU0052") }}
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ModalForgotPasswordCode',
  props: {
    email: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const verifyCode = ref('')
    const errorMsg = ref('')
    const sendForgotPasswordEmail = () => store.dispatch('user/sendForgotPasswordEmail', { email: props.email })
    const verifyForgotPasswordCode = async () => {
      try {
        const verifyToken = await store.dispatch('user/verifyForgotPasswordCode', { verifyCode: verifyCode.value })
        store.dispatch('helper/openModal', {
          component: 'modal-reset-password',
          properties: {
            mode: 0,
            email: props.email,
            verifyToken
          }
        })
      } catch (error) {
        errorMsg.value = error
      }
    }
    return {
      verifyCode,
      errorMsg,
      sendForgotPasswordEmail,
      verifyForgotPasswordCode
    }
  }
}
</script>
