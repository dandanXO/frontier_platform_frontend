<template lang="pug">
div(class="w-100 px-8")
  div(class="grid justify-items-center content-start gap-y-4")
    svg-icon(iconName="ic-forgot-key" size="68")
    p(class="text-h6 text-primary font-bold") {{$t('AA0004')}}
    p(class="max-w-57 text-body2 text-primary text-center line-height-1.6") {{$t('AA0043')}}
    input-text(v-model:textValue="email" class="w-72 pb-7.5" prependIcon="mail" size="lg" placeholder="example@gmail.com" :customErrorMsg="errorMsg")
      template(#errorMsg v-if="!isEmailExist")
        div(class="absolute pt-1 text-caption pt-1")
          p(class="text-warn whitespace-nowrap") {{$t('WW0043')}}
          p(class="text-assist-blue cursor-pointer pt-1" @click="goToSignup") {{$t('UU0050')}}
  div(class="h-25 flex justify-center items-center")
    btn(size="lg" class="w-full" @click="sendEmail" :disabled="!inputValidator.required(email)") {{$t('UU0049')}}
</template>

<script>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import inputValidator from '@/utils/input-validator'
import { useRouter } from 'vue-router'

export default {
  name: 'ModalForgotPasswordEmail',
  setup () {
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore()
    const email = ref('')
    const errorMsg = ref('')
    const isEmailExist = ref(true)

    const sendEmail = async () => {
      try {
        if (!inputValidator.emailFormat(email.value)) {
          throw t('WW0019')
        }

        isEmailExist.value = await store.dispatch('user/checkEmailExist', { email: email.value })

        if (!isEmailExist.value) { return }

        store.dispatch('user/sendForgotPasswordEmail', { email: email.value })

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

    const goToSignup = () => {
      store.dispatch('helper/closeModal')
      router.push('/sign-up')
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
      sendEmail,
      goToSignup
    }
  }
}
</script>
