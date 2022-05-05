<template lang="pug">
div(class="w-screen h-screen flex justify-center items-center  bg-black-100")
  //- div(class="fixed top-7.5 right-9")
  //-   dropdown-locale
  div(class="flex gap-x-23 items-start")
    div(class="w-97.5 h-126 bg-contain" :style="{ backgroundImage: `url(${imgCover}` }")
    div(class="w-105")
      div(class="w-full rounded-lg card-shadow px-10 pt-10 pb-9.5 flex flex-col")
        p(class="text-primary text-h6 font-bold text-center pb-5.5 border-b border-black-400") {{ $t("AA0016") }}
        button(id="google-sign-up" class="w-85 h-11 rounded border text-body2 font-bold text-black-800 mt-5 mb-3 flex justify-center items-center")
          div(class="grid grid-flow-col gap-x-2.5 items-center")
            img(src="@/assets/images/google.png")
            span(class="w-40.5 text-center text-body2") {{ $t("UU0047") }}
        div(class="grid grid-flow-col gap-x-3 items-center justify-center")
          div(class="w-19 h-px border-b border-black-400")
          span(class="w-30.5 text-black-500 text-body2 text-center") {{ $t("AA0005") }}
          div(class="w-19 h-px border-b border-black-400")
        span(class="self-end text-black-500 text-caption my-1.5") *{{ $t("RR0163") }}
        form
          div(class="grid grid-cols-2 gap-3")
            input-text(v-model:textValue="formData.firstName" :placeholder="$t('AA0017') + '*'")
            input-text(v-model:textValue="formData.lastName" :placeholder="$t('AA0018') + '*'")
            input-text(v-model:textValue="formData.email" :placeholder="$t('AA0002') + '*'" prependIcon="mail" class="col-span-2" @blur="validateEmailFormat")
            input-password(v-model:textValue="formData.password" :placeholder="$t('AA0003') + '*'" class="col-span-2")
          password-validator(v-model:isValid="isPasswordValid" :password="formData.password" class="mt-1 mb-2")
        div(class="flex-grow text-caption h-6")
          i18n-t(v-if="isEmailExist" keypath="WW0066" tag="p" class="text-warn text-caption leading-none")
            template(#signIn)
              router-link-extending(class="text-assist-blue pl-1 text-caption" to="/sign-in") {{ $t("AA0001") }}
          p(v-else-if="errorMsg !== '' && !isEmailExist" class="text-warn") {{ errorMsg }}
        btn(size="lg" class="font-bold w-85" :disabled="!availableToSignUp" @click="signUp") {{ $t("AA0016") }}
        div(class="flex items-center mt-1.5")
          div(class="w-3 h-3 border  flex justify-center items-center"
            :class="[agreeTermsAndPrivacy ? 'border-primary' : 'border-black-400']"
            @click="agreeTermsAndPrivacy = !agreeTermsAndPrivacy"
          )
            svg-icon(v-if="agreeTermsAndPrivacy" iconName="tick" size="10" class="text-primary")
          i18n-t(keypath="AA0021" tag="p" class="text-caption text-black-600 ml-1")
            template(#terms)
              span(class="text-primary cursor-pointer" @click="openModalTermsOfUse") {{ $t("AA0012") }}
            template(#privacy)
              span(class="text-primary cursor-pointer" @click="openModalPrivacyPolicy") {{ $t("AA0029") }}
      i18n-t(keypath="UU0048" tag="p" class="text-black-800 text-body2 font-normal text-center pt-3")
        template(#signIn)
          router-link-extending(class="text-primary font-bold" to="/sign-in") {{ $t("AA0001") }}
div(v-if="isSignUpSuccessfully" class="fixed inset-0 w-full h-full bg-black-100 flex justify-center items-center")
  div(class="w-112 h-92 rounded-md bg-black-0 card-shadow pt-22.5 px-14 pb-15 flex flex-col items-center")
    i18n-t(keypath="AA0025" tag="h4" class="text-primary text-h4 mb-3")
      template(#name) {{ formData.firstName }}
    h4(class="text-primary text-h4 mb-9") {{ $t("AA0026") }}
    p(class="text-black-650 text-body2 text-center mb-10 leading-1.4") {{ $t("AA0027") }}
    btn(size="special" class="w-35 h-10.5" @click="nextAfterSignIn") {{ $t("UU0021") }}
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed, onMounted, toRaw, watch } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import googleSignInApi from '@/utils/google-sign-in-api'
// import DropdownLocale from '@/components/DropdownLocale.vue'
import useNavigation from '@/composables/useNavigation'
import PasswordValidator from '@/components/account/PasswordValidator.vue'
import imgCover from '@/assets/images/cover.png'

export default {
  name: 'SignUp',
  components: {
    // DropdownLocale,
    PasswordValidator
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const formData = reactive({
      lastName: '',
      firstName: '',
      email: '',
      password: ''
    })
    const errorMsg = ref('')
    const agreeTermsAndPrivacy = ref(false)
    const isSignUpSuccessfully = ref(false)
    const isEmailExist = ref(false)
    const isPasswordValid = ref(false)
    const { nextAfterSignIn } = useNavigation()

    const isEmailValid = computed(() => (/.+@.+/ig).test(formData.email))
    const availableToSignUp = computed(() => formData.firstName !== '' && formData.lastName !== '' && isEmailValid.value && isPasswordValid.value && agreeTermsAndPrivacy.value)

    const validateEmailFormat = async () => {
      isEmailExist.value = false
      errorMsg.value = ''

      if (formData.email === '') { return }

      if (formData.email !== '' && !isEmailValid.value) {
        return (errorMsg.value = t('WW0019'))
      }

      isEmailExist.value = await store.dispatch('user/checkEmailExist', { email: formData.email })
    }

    const signUp = async () => {
      isEmailExist.value = await store.dispatch('user/generalSignUp', Object.assign({ locale: 'en-US' }, toRaw(formData)))

      !isEmailExist.value && (isSignUpSuccessfully.value = true)
    }

    const googleSignUp = async (googleUser) => {
      isEmailExist.value = await store.dispatch('user/googleSignUp', { idToken: googleUser.getAuthResponse().id_token, locale: 'en-US' })

      !isEmailExist.value && nextAfterSignIn()
    }

    const openModalTermsOfUse = () => store.dispatch('helper/openModal', { component: 'modal-terms-of-use' })
    const openModalPrivacyPolicy = () => store.dispatch('helper/openModal', { component: 'modal-privacy-policy' })

    watch(
      () => formData.email,
      () => {
        isEmailExist.value = false
      }
    )

    onMounted(async () => {
      await googleSignInApi.init()
      googleSignInApi.attachClickHandler({
        elementId: 'google-sign-up',
        successHandler: googleSignUp,
        failHandler (error) {
          if (error.error === 'popup_closed_by_user') { return }
          errorMsg.value = t('WW0065')
        }
      })
    })

    return {
      formData,
      agreeTermsAndPrivacy,
      errorMsg,
      validateEmailFormat,
      signUp,
      availableToSignUp,
      isSignUpSuccessfully,
      nextAfterSignIn,
      isEmailExist,
      isPasswordValid,
      openModalTermsOfUse,
      openModalPrivacyPolicy,
      imgCover
    }
  }
}
</script>
