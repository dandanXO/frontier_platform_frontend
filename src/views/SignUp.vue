<style lang="scss" scoped>
.mt-sign-up {
  margin-top: grow-shrink-y(534, 186);
}

.mt-sign-up-success {
  margin-top: grow-shrink-y(386, 210);
}
</style>

<template lang="pug">
div(class="w-screen h-screen flex justify-center bg-black-100")
  div(class="fixed top-7.5 right-9")
    dropdown-locale
  div(class="w-229 h-133.5 flex justify-between mt-sign-up")
    div(class="w-99 h-124 bg-black-400 self-center")
    div(class="w-105 flex flex-col justify-between items-center")
      div(class="w-full h-127.5 rounded-lg card-shadow px-10 pt-10 pb-9.5 flex flex-col")
        p(class="text-primary text-h6 font-bold text-center pb-5.5 border-b border-black-400") {{$t('term.SIGNUP')}}
        button(id="google-sign-up" class="w-85 h-11 rounded border text-body2 font-bold text-black-800 mt-5 mb-3 flex justify-center items-center")
          div(class="grid grid-flow-col gap-x-2.5 items-center")
            svg-icon(iconName="google" size="24")
            span(class="w-40.5 text-center text-body2") {{$t('form.signUp.signUpWithGoogle')}}
        div(class="grid grid-flow-col gap-x-3 items-center justify-center")
          div(class="w-19 h-px border-b border-black-400")
          span(class="w-30.5 text-black-500 text-body2 text-center") {{$t('word.or')}}
          div(class="w-19 h-px border-b border-black-400")
        span(class="self-end text-black-500 text-caption my-1.5") *{{$t('term.required')}}
        form(class="grid grid-cols-2 gap-3")
          input-text(v-model:value="formData.firstName" :placeholder="$t('word.firstName')+'*'")
          input-text(v-model:value="formData.lastName" :placeholder="$t('word.lastName')+'*'")
          input-text(v-model:value="formData.email" :placeholder="$t('word.email')+'*'" prependIcon="mail" class="col-span-2" @blur="validateEmailFormat")
          input-password(v-model:value="formData.password" :placeholder="$t('word.password')+'*'" class="col-span-2")
        div(class="grid gap-y-1.5 text-caption mt-1 mb-2")
          div(class="flex")
            p(:class="[moreThanSix && moreThanSix ? 'text-black-800' : 'text-black-500']")  {{$t('form.signUp.atLeast6Char')}}
            svg-icon(v-if="moreThanSix && lessThanEighteen" iconName="tick-bold" class="ml-0.5 text-black-800" size="12")
          div(class="flex")
            p(:class="[containsLetter ? 'text-black-800' : 'text-black-500']") {{$t('form.signUp.atLeast1Letter')}}
            svg-icon(v-if="containsLetter" iconName="tick-bold" class="ml-0.5 text-black-800" size="12")
        div(class="flex-grow text-caption")
          i18n-t(v-if="isEmailExist" keypath="error.emailAlreadyExist" tag="p" class="text-warn")
            template(#signIn)
              router-link-extending(class="text-primary" to="/sign-in") {{$t('term.LOGIN')}}
          p(v-else-if="errorMsg !== '' && !isEmailExist" class="text-warn") {{errorMsg}}
        btn(size="lg" class="font-bold w-85" :disabled="!avaliableToSignUp" @click="signUp") {{$t('term.SIGNUP')}}
        div(class="flex items-center mt-1.5")
          div(class="w-3 h-3 border  flex justify-center items-center"
            :class="[agreeTermsAndPrivacy ? 'border-primary' : 'border-black-400']"
            @click="agreeTermsAndPrivacy = !agreeTermsAndPrivacy"
          )
            svg-icon(v-if="agreeTermsAndPrivacy" iconName="tick" size="10" class="text-primary")
          i18n-t(keypath="sentence.agreeTermsAndPrivacy" tag="p" class="text-caption text-black-600 ml-1")
            template(#terms)
              span(class="text-primary") {{$t('word.terms')}}
            template(#privacy)
              span(class="text-primary") {{$t('word.privacyPolicy')}}
      i18n-t(keypath="form.signUp.alreadyHaveAnAccount" tag="p" class="text-black-800 text-body2 font-normal")
        template(#signIn)
          router-link-extending(class="text-primary font-bold" to="/sign-in") {{$t('term.LOGIN')}}
div(v-if="isSignUpSuccessfully" class="fixed inset-0 w-full h-full bg-black-100 flex justify-center")
  div(class="w-112 h-92 rounded-md bg-black-0 mt-sign-up-success card-shadow pt-22.5 px-14 pb-15 flex flex-col items-center")
    i18n-t(keypath="sentence.greeting" tag="h4" class="text-primary text-h4 mb-3")
      template(#name) {{`${formData.lastName} ${formData.firstName}`}}
    h4(class="text-primary text-h4 mb-9") {{$t('sentence.welcomeToFrontier')}}
    p(class="text-black-650 text-body2 text-center mb-10 line-height-1.4") {{$t('sentence.signUpSuccessfully')}}
    btn(size="special" class="w-35 h-10.5" @click="redirectToNextPage") {{$t('word.next')}}
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed, onMounted, toRaw } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import googleSignInApi from '@/utils/google-sign-in-api'
import DropdownLocale from '@/components/DropdownLocale'

export default {
  name: 'SignUp',
  components: {
    DropdownLocale
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()
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

    const containsLetter = computed(() => (/[a-zA-Z]/ig).test(formData.password))
    const moreThanSix = computed(() => formData.password.length >= 6)
    const lessThanEighteen = computed(() => formData.password.length <= 18)
    const isEmailValid = computed(() => (/.+@.+/ig).test(formData.email))
    const isPasswordValid = computed(() => containsLetter.value && moreThanSix.value && lessThanEighteen.value)
    const avaliableToSignUp = computed(() => formData.firstName !== '' && formData.lastName !== '' && isEmailValid.value && isPasswordValid.value && agreeTermsAndPrivacy.value)

    const validateEmailFormat = async () => {
      try {
        isEmailExist.value = false
        errorMsg.value = ''

        if (formData.email !== '' && !isEmailValid.value) {
          throw t('error.invalidEmail')
        }

        isEmailExist.value = await store.dispatch('user/checkEmailExist', { email: formData.email })
      } catch (error) {
        errorMsg.value = error
      }
    }

    const redirectToNextPage = async () => {
      await store.dispatch('user/getUserOrgList')
      const organizationList = store.getters['user/organizationList']

      if (organizationList.length === 1) {
        return router.push(`/${organizationList[0].orgName}/public-library`)
      }

      router.push('/')
    }

    const signUp = async () => {
      try {
        await store.dispatch('user/generalSignUp', toRaw(formData))
        isSignUpSuccessfully.value = true
      } catch (error) {
        errorMsg.value = error
      }
    }

    const googleSignUp = async (googleUser) => {
      try {
        await store.dispatch('user/googleSignUp', { idToken: googleUser.getAuthResponse().id_token })
        redirectToNextPage()
      } catch (error) {
        errorMsg.value = error
      }
    }

    onMounted(async () => {
      await googleSignInApi.init()
      googleSignInApi.attachClickHandler({
        elementId: 'google-sign-up',
        successHandler: googleSignUp,
        failHandler (error) {
          if (error.error === 'popup_closed_by_user') { return }
          errorMsg.value = t('error.googleSideError')
        }
      })
    })

    return {
      formData,
      containsLetter,
      moreThanSix,
      lessThanEighteen,
      agreeTermsAndPrivacy,
      errorMsg,
      validateEmailFormat,
      signUp,
      avaliableToSignUp,
      isSignUpSuccessfully,
      redirectToNextPage,
      isEmailExist
    }
  }
}
</script>
