<template lang="pug">
div(class="w-screen h-screen flex justify-center items-center bg-grey-50" data-theme="new")
  div(class="fixed top-7.5 left-9 text-grey-600") {{ appVersion }}
  dropdown-locale(class="fixed top-7.5 right-9")
  div(class="h-125 flex items-center")
    div(
      class="w-97.5 h-full bg-contain mr-23"
      :style="{ backgroundImage: `url(${imgCover})` }"
    )
    otp-card(
      v-if="needPass2FA"
      :email="currentEmail"
      :isFromGoogle="isFromGoogle"
      :blockReasonType="blockReasonType"
    )
    sign-in-card(
      v-else
      :isGoogleLoadFail="isGoogleLoadFail"
      :errorMsgSignIn="errorMsgSignIn"
      @onSignIn="generalSignIn"
    )
</template>

<script setup lang="ts">
import { ref, toRaw, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import SignInWithGoogle from '@/utils/signInWithGoogle.js'
import { inputValidator } from '@frontier/lib'
import useNavigation from '@/composables/useNavigation'
import imgCover from '@/assets/images/cover.png'
import DropdownLocale from '@/components/common/DropdownLocale.vue'
import type {
  GeneralSignIn200ResponseAllOfResult,
  OneTimePasswordStatus,
  ResSuccessTrue,
  SignInGooglePost200ResponseAllOfResult,
} from '@frontier/platform-web-sdk'
import SignInCard, { type FormData } from '@/components/signIn/SignInCard.vue'
import OtpCard from '@/components/signIn/OtpCard.vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const { nextAfterSignIn } = useNavigation()

const needPass2FA = ref(false)
const isFromGoogle = ref(false)
const currentEmail = ref<string>()
const blockReasonType = ref<OneTimePasswordStatus['blockReason']>()

const onLogin = async (otpStatus?: OneTimePasswordStatus) => {
  otpStatus?.mustPass2Fa ? (needPass2FA.value = true) : await nextAfterSignIn()
  blockReasonType.value = otpStatus?.blockReason

  store.dispatch('helper/closeModalLoading')
}
const errorMsgSignIn = ref('')
//@ts-ignore __APP_VERSION__ handled via vite.config.ts
const appVersion = __APP_VERSION__ || ''

const generalSignIn = async (data: FormData) => {
  errorMsgSignIn.value = ''
  if (!inputValidator.required(data.email)) {
    return (errorMsgSignIn.value = t('WW0062'))
  } else if (!inputValidator.required(data.password)) {
    return (errorMsgSignIn.value = t('WW0063'))
  } else if (!inputValidator.emailFormat(data.email)) {
    return (errorMsgSignIn.value = t('WW0019'))
  }

  store.dispatch('helper/openModalLoading')

  const { isOldUser, oldUserVerifyToken, otpStatus } = (await store.dispatch(
    'user/generalSignIn',
    toRaw(data)
  )) as GeneralSignIn200ResponseAllOfResult

  if (isOldUser) {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-ask-reset-password',
      properties: {
        email: data.email,
        oldUserVerifyToken,
      },
    })
  } else {
    currentEmail.value = data.email
    isFromGoogle.value = false
    await onLogin(otpStatus)
  }
}

const isGoogleLoadFail = ref(false)

onMounted(() => {
  try {
    const googleSignIn = new SignInWithGoogle({
      elementId: 'google-sign-in',
      callback: async (response: any) => {
        try {
          store.dispatch('helper/openModalLoading')
          const { otpStatus } = (await store.dispatch('user/googleSignIn', {
            idToken: response.credential,
          })) as SignInGooglePost200ResponseAllOfResult

          const { email } = JSON.parse(atob(response.credential.split('.')[1]))
          currentEmail.value = email
          isFromGoogle.value = true
          await onLogin(otpStatus)
        } catch (error) {
          const isAccountNotFound = (error as ResSuccessTrue).code === 'WW0064'
          const { email, given_name, family_name } = JSON.parse(
            atob(response.credential.split('.')[1])
          )
          if (isAccountNotFound) {
            router.push({
              name: 'SignUp',
              query: { email, given_name, family_name },
            })
          }
          store.dispatch('helper/closeModalLoading')
        }
      },
    })
    isGoogleLoadFail.value = !googleSignIn.google
  } catch {
    isGoogleLoadFail.value = true
  }
})
</script>
