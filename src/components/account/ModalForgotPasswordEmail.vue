<template lang="pug">
modal-behavior(
  :header="$t('AA0004')"
  :primaryBtnText="$t('UU0049')"
  :primaryButtonDisabled="!inputValidator.required(email)"
  @click:primary="sendEmail"
)
  div(class="w-80 grid justify-items-center content-start gap-y-4 mt-5")
    svg-icon(iconName="ic-forgot-key" size="68")
    p(class="max-w-57 text-body2 text-primary text-center leading-1.6") {{ $t("AA0043") }}
    input-text(v-model:textValue="email" class="w-full pb-8" prependIcon="mail" size="lg" placeholder="example@gmail.com" :customErrorMsg="errorMsg")
      template(#errorMsg v-if="!isEmailExist")
        div(class="absolute pt-1 text-caption")
          p(class="text-warn whitespace-nowrap") {{ $t("WW0043") }}
          p(class="text-assist-blue cursor-pointer pt-1" @click="goToSignup") {{ $t("UU0050") }}
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import inputValidator from '@/utils/input-validator'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const store = useStore()
const email = ref('')
const errorMsg = ref('')
const isEmailExist = ref(true)

const sendEmail = async () => {
  if (!inputValidator.emailFormat(email.value)) {
    return (errorMsg.value = t('WW0019'))
  }

  isEmailExist.value = await store.dispatch('user/checkEmailExist', { email: email.value })

  if (!isEmailExist.value) { return }

  store.dispatch('user/sendForgotPasswordEmail', { email: email.value })

  store.dispatch('helper/openModalBehavior', {
    component: 'modal-forgot-password-code',
    properties: {
      email: email.value
    }
  })
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
</script>
