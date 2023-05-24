<template lang="pug">
modal-behavior(
  :header="$t('AA0004')"
  :primaryBtnText="$t('UU0049')"
  :primaryBtnDisabled="!inputValidator.required(email)"
  @click:primary="sendEmail"
)
  div(class="w-80 grid justify-items-center content-start gap-y-4 mt-5")
    f-svg-icon(iconName="ic_forgot_key" size="68")
    p(class="max-w-57 text-body2 text-grey-900 text-center leading-1.6") {{ $t('AA0043') }}
    f-input-text(
      v-model:textValue="email"
      class="w-80"
      prependIcon="mail"
      size="lg"
      placeholder="example@gmail.com"
      :hintError="errorMsg"
    )
      template(#slot:hint-error v-if="!isEmailExist")
        p(class="text-caption text-red-400 whitespace-nowrap") {{ $t('WW0043') }}
        p(
          class="text-caption text-cyan-400 cursor-pointer pt-1"
          @click="openSignUpRequestModal"
        ) {{ $t('UU0050') }}
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

  isEmailExist.value = await store.dispatch('user/checkEmailExist', {
    email: email.value,
  })

  if (!isEmailExist.value) {
    return
  }

  store.dispatch('user/sendForgotPasswordEmail', { email: email.value })

  store.dispatch('helper/openModalBehavior', {
    component: 'modal-forgot-password-code',
    properties: {
      email: email.value,
    },
  })
}

const openSignUpRequestModal = () => {
  store.dispatch('helper/closeModal')
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-sign-up-request',
  })
}

watch(
  () => email.value,
  () => {
    isEmailExist.value = true
    errorMsg.value = ''
  }
)
</script>
