<template lang="pug">
div(class="w-100 px-8")
  div(class="grid justify-items-center content-start gap-y-4")
    svg-icon(iconName="ic-forgot-key" size="68")
    p(class="text-h6 text-primary font-bold") {{$t('a.forgotPassword')}}
    p(class="max-w-57 text-body2 text-primary text-center line-height-1.6") {{$t('a.emailToReceiveCode')}}
    input-text(v-model:textValue="email" class="w-72 pb-7.5" prependIcon="mail" size="lg" placeholder="example@gmail.com" :customErrorMsg="errorMsg")
      template(#errorMsg v-if="!isEmailExist")
        div(class="absolute pt-1 text-caption pt-1")
          p(class="text-warn whitespace-nowrap") {{$t('a.emailNotExist')}}
          p(class="text-assist-blue cursor-pointer pt-1") {{$t('a.createAccount')}}
  div(class="h-25 flex justify-center items-center")
    btn(size="lg" class="w-full" @click="sendEmail" :disabled="!inputValidator.required(email)") {{$t('a.send')}}
</template>

<script>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import inputValidator from '@/utils/input-validator'

export default {
  name: 'ModalForgotPasswordEmail',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const email = ref('')
    const errorMsg = ref('')
    const isEmailExist = ref(true)

    const sendForgotPasswordEmail = () => store.dispatch('user/sendForgotPasswordEmail', { email: email.value })
    const sendEmail = async () => {
      try {
        if (!inputValidator.emailFormat(email.value)) {
          throw t('err.invalidEmail')
        }

        isEmailExist.value = await store.dispatch('user/checkEmailExist', { email: email.value })

        if (!isEmailExist.value) { return }

        await sendForgotPasswordEmail({ email: email.value })

        store.dispatch('helper/openModal', {
          component: 'modal-forgot-password-code',
          properties: {
            email: email.value
          }
        })
      } catch (error) {
        errorMsg.value = error
      }
    }

    watch(
      () => email.value,
      () => {
        isEmailExist.value = true
        errorMsg.value = ''
      }
    )

    return {
      email,
      errorMsg,
      isEmailExist,
      inputValidator,
      sendEmail
    }
  }
}
</script>
