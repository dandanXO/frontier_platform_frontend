<template lang="pug">
div(class="w-screen h-screen flex justify-center items-center bg-grey-50")
  dropdown-locale(class="fixed top-7.5 right-9")
  div(class="flex gap-x-23 items-center")
    div(class="w-97.5 h-126 bg-contain" :style="{ backgroundImage: `url(${imgCover}` }")
    div(class="w-105")
      div(class="w-full rounded-lg shadow-4 px-10 pt-10 pb-9.5 flex flex-col")
        p(
          class="text-grey-900 text-h6 font-bold text-center pb-5.5 border-b border-grey-250"
        ) {{ $t('AA0016') }}
        template(v-if="!isGoogleLoadFail")
          div(class="h-10")
            button#google-sign-up(class="mt-5 mb-3") 
          div(class="grid grid-flow-col gap-x-3 items-center justify-center")
            div(class="w-19 h-px border-b border-grey-250")
            span(class="w-30.5 text-grey-250 text-body2 text-center") {{ $t('AA0005') }}
            div(class="w-19 h-px border-b border-grey-250")
        span(class="self-end text-grey-250 text-caption my-1.5") *{{ $t('RR0163') }}
        form
          div(class="grid grid-cols-2 gap-3")
            f-input-text(
              v-model:textValue="formData.firstName"
              :placeholder="$t('AA0017') + '*'"
              data-cy="firstName"
              @blur="validateNameFormat"
            )
            f-input-text(
              v-model:textValue="formData.lastName"
              :placeholder="$t('AA0018') + '*'"
              data-cy="lastName"
              @blur="validateNameFormat"
            )
            p(v-if="nameErrorMsg !== ''" class="col-span-2 text-caption text-red-400") {{ nameErrorMsg }}
            f-input-text(
              v-model:textValue="formData.email"
              :placeholder="$t('AA0002') + '*'"
              prependIcon="mail"
              class="col-span-2"
              data-cy="email"
              @blur="validateEmailFormat"
            )
            f-input-password(
              v-model:textValue="formData.password"
              :placeholder="$t('AA0003') + '*'"
              class="col-span-2"
              data-cy="password"
            )
          password-validator(
            v-model:isValid="isPasswordValid"
            :password="formData.password"
            class="mt-1 mb-2"
          )
        div(class="flex-grow text-caption h-8")
          i18n-t(
            v-if="isEmailExist"
            keypath="WW0066"
            tag="p"
            class="text-red-400 text-caption leading-none"
            scope="global"
          )
            template(#signIn)
              router-link(class="text-cyan-400 pl-1 text-caption" to="/sign-in") {{ $t('AA0001') }}
          p(v-else-if="errorMsg !== '' && !isEmailExist" class="text-red-400") {{ errorMsg }}
        f-button(
          size="lg"
          class="font-bold w-85"
          :disabled="!availableToSignUp"
          data-cy="sign-up"
          @click="signUp"
        ) {{ $t('AA0016') }}
        div(class="flex items-center mt-1.5")
          div(
            class="w-3 h-3 border flex justify-center items-center"
            :class="[agreeTermsAndPrivacy ? 'border-grey-900' : 'border-grey-250']"
            data-cy="agree"
            @click="agreeTermsAndPrivacy = !agreeTermsAndPrivacy"
          )
            f-svg-icon(
              v-if="agreeTermsAndPrivacy"
              iconName="tick"
              size="10"
              class="text-grey-900"
            )
          i18n-t(
            keypath="AA0021"
            tag="p"
            class="text-caption text-grey-600 ml-1"
            scope="global"
          )
            template(#terms)
              span(class="text-grey-900 cursor-pointer" @click="openModalTermsOfUse") {{ $t('AA0012') }}
            template(#privacy)
              span(
                class="text-grey-900 cursor-pointer"
                @click="openModalPrivacyPolicy"
              ) {{ $t('AA0029') }}
      i18n-t(
        keypath="UU0048"
        tag="p"
        class="text-grey-600 text-body2 font-normal text-center pt-3"
        scope="global"
      )
        template(#signIn)
          router-link(
            class="text-grey-900 font-bold"
            :to="{ path: '/sign-in', query: $route.query }"
          ) {{ $t('AA0001') }}
div(
  v-if="isSignUpSuccessfully"
  class="fixed inset-0 w-full h-full bg-grey-50 flex justify-center items-center"
)
  div(
    class="w-112 h-92 rounded-md bg-grey-0 shadow-32 pt-22.5 px-14 pb-15 flex flex-col items-center"
  )
    i18n-t(keypath="AA0025" tag="h4" class="text-grey-900 text-h4 mb-3" scope="global")
      template(#name) {{ formData.firstName }}
    h4(class="text-grey-900 text-h4 mb-9") {{ $t('AA0026') }}
    p(class="text-grey-600 text-body2 text-center mb-10 leading-1.4") {{ $t('AA0027') }}
    f-button(
      size="special"
      class="w-35 h-10.5"
      data-cy="next"
      @click="nextAfterSignIn"
    ) {{ $t('UU0021') }}
</template>

<script setup>
import { reactive, ref } from 'vue'
import { computed, onMounted, toRaw, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import SignInWithGoogle from '@/utils/signInWithGoogle.js'
import useNavigation from '@/composables/useNavigation'
import PasswordValidator from '@/components/account/PasswordValidator.vue'
import imgCover from '@/assets/images/cover.png'
import DropdownLocale from '@/components/common/DropdownLocale.vue'
import { inputValidator } from '@frontier/lib'
import { useRoute } from 'vue-router'
import { SIGNUP_SOURCE } from '@/utils/constants'
import { PRAVICY_POLICY_URL, TERMS_SERVICE_URL } from '@/utils/constants'

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const formData = reactive({
  lastName: route.query.family_name ?? '',
  firstName: route.query.given_name ?? '',
  email: route.query.email ?? '',
  password: '',
})
const signupSourceType = ref(SIGNUP_SOURCE.NORMAL)
const errorMsg = ref('')
const nameErrorMsg = ref('')
const agreeTermsAndPrivacy = ref(false)
const isSignUpSuccessfully = ref(false)
const isEmailExist = ref(false)
const isPasswordValid = ref(false)
const { nextAfterSignIn } = useNavigation()

const isEmailValid = computed(() => inputValidator.emailFormat(formData.email))
const availableToSignUp = computed(
  () =>
    !!formData.firstName &&
    !!formData.lastName &&
    !nameErrorMsg.value &&
    isEmailValid.value &&
    isPasswordValid.value &&
    agreeTermsAndPrivacy.value
)
const validateNameFormat = async () => {
  nameErrorMsg.value = ''
  if (formData.firstName.length > 120 || formData.lastName.length > 120) {
    return (nameErrorMsg.value = t('WW0116', { maxNum: 120 }))
  }
}
const validateEmailFormat = async () => {
  isEmailExist.value = false
  errorMsg.value = ''

  if (!formData.email) {
    return
  }

  if (!!formData.email && !isEmailValid.value) {
    return (errorMsg.value = t('WW0019'))
  }
  isEmailExist.value = await store.dispatch('user/checkEmailExist', {
    email: formData.email,
  })
}

const signUp = async () => {
  isEmailExist.value = await store.dispatch('user/generalSignUp', {
    ...toRaw(formData),
    signupSourceType: signupSourceType.value,
  })

  !isEmailExist.value && (isSignUpSuccessfully.value = true)
}

const openModalTermsOfUse = () => window.open(TERMS_SERVICE_URL, '_blank')
const openModalPrivacyPolicy = () => window.open(PRAVICY_POLICY_URL, '_blank')

watch(
  () => formData.email,
  () => {
    isEmailExist.value = false
  }
)

const isGoogleLoadFail = ref(false)

onMounted(() => {
  if ('signupSourceType' in route.query) {
    signupSourceType.value = Number(route.query.signupSourceType)
  }

  try {
    const googleSignUp = new SignInWithGoogle({
      elementId: 'google-sign-up',
      callback: async (response) => {
        store.dispatch('helper/openModalLoading')
        isEmailExist.value = await store.dispatch('user/googleSignUp', {
          idToken: response.credential,
          signupSourceType: signupSourceType.value,
        })
        !isEmailExist.value && (await nextAfterSignIn())
        store.dispatch('helper/closeModalLoading')
      },
    })
    isGoogleLoadFail.value = !googleSignUp.google
  } catch {
    isGoogleLoadFail.value = true
  }
})
</script>
