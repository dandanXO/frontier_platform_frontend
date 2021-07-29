<style lang="scss" scoped>
.mt-signIn {
  margin-top: grow-shrink-y(498, 186);
}
</style>

<template lang="pug">
div(class="w-screen h-screen flex justify-center bg-black-100")
  div(class="fixed top-7.5 right-9")
    dropdown-locale
  div(class="w-229 h-124.5 flex justify-between mt-signIn")
    div(class="w-99 bg-black-400")
    div(class="w-105 mt-6.5 flex flex-col justify-between items-center")
      div(class="w-full h-110 rounded-lg card-shadow px-10 py-11 flex flex-col")
        p(class="text-primary text-h6 font-bold text-center pb-5.5 border-b border-black-400") {{$t('term.LOGIN')}}
        form(class="grid gap-y-3 mt-5 mb-1.5")
          input-text(v-model:value="formData.email" :placeholder="$t('word.email')" prependIcon="mail")
          input-password(v-model:value="formData.password" :placeholder="$t('word.password')" prependIcon="lock")
        span(class="self-end text-caption text-black-800 mb-4") {{$t('form.signIn.forgotPassword')}}
        btn(size="lg" class="font-bold" @click="generalSignIn") {{$t('term.LOGIN')}}
        div(class="flex-grow text-caption mt-1.5")
          p(v-if="errorMsg !== ''" class="text-warn text-center") {{errorMsg}}
        div(class="grid grid-flow-col gap-x-3 items-center justify-center mb-4")
          div(class="w-19 h-px border-b border-black-400")
          span(class="w-30.5 text-black-500 text-body2 text-center") {{$t('word.or')}}
          div(class="w-19 h-px border-b border-black-400")
        button(id="google-sign-in" class="w-85 h-11 rounded border text-body2 font-bold text-black-800 flex justify-center items-center")
          div(class="grid grid-flow-col gap-x-2.5 items-center")
            svg-icon(iconName="google")
            span(class="w-40.5 text-center text-body2") {{$t('form.signIn.signInWithGoogle')}}
      i18n-t(keypath="form.signIn.doNotHaveAnAccount" tag="p" class="text-black-800 text-body2 font-normal")
        template(#signUp)
          router-link-extending(class="text-primary font-bold ml-3" to="/sign-up") {{$t('term.SIGNUP')}}
div(
  v-if="stateOfResetPassword !== 0"
  class="fixed inset-0 z-10 w-screen h-screen flex justify-center items-center"
  :class="[ {'bg-opacity-70 bg-black': stateOfResetPassword === 1}, {'bg-black-100': stateOfResetPassword === 2 || stateOfResetPassword === 3 }]"
)
  div(v-if="stateOfResetPassword === 1" class="relative bg-black-0 w-115 h-85 px-8.5 pt-14 pb-9.5 rounded-md flex flex-col justify-between items-center")
    svg-icon(iconName="close" class="absolute top-3 right-3 cursor-pointer" color="black-700" @click="stateOfResetPassword = 0")
    p(class="text-primary text-body1 line-height-1.6") {{$t('sentence.askToResetPassword')}}
    btn(size="lg" @click="stateOfResetPassword = 2") {{$t('term.resetPassword')}}
  form-reset-password(v-else-if="stateOfResetPassword === 2" :email="formData.email" @submit="stateOfResetPassword = 3" @close="stateOfResetPassword = 0")
  div(v-else-if="stateOfResetPassword === 3" class="relative bg-black-0 w-112 h-92 rounded-md flex flex-col items-center")
    svg-icon(iconName="close" class="absolute top-3 right-3 cursor-pointer" color="black-700" @click="redirectToNextPage")
    svg-icon(iconName="frontier-logo" :width="136" :height="26" class="mt-10")
    svg-icon(iconName="reset-successfully" :width="88" :height="88" class="mt-15")
    p(class="text-body1 text-black-800 mt-9") {{$t('sentence.passwordResetSuccessfully')}}
</template>

<script>
import { reactive, ref, toRaw, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import googleSignInApi from '@/utils/google-sign-in-api'
import DropdownLocale from '@/components/DropdownLocale'
import FormResetPassword from '@/components/FormResetPassword'

export default {
  name: 'SignIn',
  components: {
    DropdownLocale,
    FormResetPassword
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()
    const formData = reactive({
      email: '',
      password: ''
    })
    const errorMsg = ref('')

    /**
     * state of reset password have three state
     * 0 -> not on resetting
     * 1 -> show confirm modal to ask user to reset password
     * 2 -> on resetting
     * 3 -> success
     */
    const stateOfResetPassword = ref(0)

    const redirectToNextPage = () => {
      /**
       * @todo need to according to organization amount to decide where to redirect
       */
      router.push('/')
    }

    const generalSignIn = async () => {
      try {
        errorMsg.value = ''
        if (formData.email === '') {
          throw t('error.enterEmail')
        } else if (formData.password === '') {
          throw t('error.enterPassword')
        } else if (!(/.+@.+/ig).test(formData.email)) {
          throw t('error.invalidEmail')
        }

        const isOldUser = await store.dispatch('user/generalSignIn', toRaw(formData))

        if (!isOldUser) {
          redirectToNextPage()
        } else {
          stateOfResetPassword.value = 1
        }
      } catch (error) {
        errorMsg.value = error
      }
    }

    const googleSignIn = async (googleUser) => {
      try {
        await store.dispatch('user/googleSignIn', { idToken: googleUser.getAuthResponse().id_token })
        redirectToNextPage()
      } catch (error) {
        errorMsg.value = error
      }
    }

    onMounted(async () => {
      await googleSignInApi.init()
      googleSignInApi.attachClickHandler({
        elementId: 'google-sign-in',
        successHandler: googleSignIn,
        failHandler (error) {
          console.log(error)
          if (error.error === 'popup_closed_by_user') { return }
          errorMsg.value = t('error.googleSideError')
        }
      })
    })

    return {
      formData,
      errorMsg,
      generalSignIn,
      stateOfResetPassword,
      redirectToNextPage
    }
  }
}
</script>
