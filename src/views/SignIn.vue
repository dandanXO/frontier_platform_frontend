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
        p(class="text-primary text-h6 font-bold text-center pb-5.5 border-b border-black-400") {{$t('a.LOGIN')}}
        form(class="grid gap-y-3 mt-5 mb-1.5")
          input-text(v-model:value="formData.email" :placeholder="$t('a.email')" prependIcon="mail")
          input-password(v-model:value="formData.password" :placeholder="$t('a.password')")
        span(class="self-end text-caption text-black-800 mb-4 cursor-pointer" @click="stateOfForgotPassword = 1") {{$t('a.forgotPassword')}}?
        btn(size="lg" class="w-full font-bold self-center" @click="generalSignIn") {{$t('a.LOGIN')}}
        div(class="flex-grow text-caption mt-1.5")
          p(v-if="errorMsgSignIn !== ''" class="text-warn text-center") {{errorMsgSignIn}}
        div(class="grid grid-flow-col gap-x-3 items-center justify-center mb-4")
          div(class="w-19 h-px border-b border-black-400")
          span(class="w-30.5 text-black-500 text-body2 text-center") {{$t('a.or')}}
          div(class="w-19 h-px border-b border-black-400")
        button(id="google-sign-in" class="w-85 h-11 rounded border text-body2 font-bold text-black-800 flex justify-center items-center")
          div(class="grid grid-flow-col gap-x-2.5 items-center")
            svg-icon(iconName="google" size="24")
            span(class="w-40.5 text-center text-body2") {{$t('a.signInWithGoogle')}}
      i18n-t(keypath="a.doNotHaveAnAccount" tag="p" class="text-black-800 text-body2 font-normal")
        template(#signUp)
          router-link-extending(class="text-primary font-bold ml-3" to="/sign-up") {{$t('a.SIGNUP')}}

div(
  v-if="stateOfResetPassword !== 0"
  class="fixed inset-0 z-10 w-screen h-screen flex justify-center items-center"
  :class="[ {'bg-opacity-70 bg-black': stateOfResetPassword === 1}, {'bg-black-100': stateOfResetPassword === 2 || stateOfResetPassword === 3 }]"
)
  div(v-if="stateOfResetPassword === 1" class="relative bg-black-0 w-115 h-85 px-8.5 pt-14 pb-9.5 rounded-md flex flex-col justify-between items-center")
    svg-icon(iconName="close" size="24" class="absolute top-3 right-3 cursor-pointer text-black-700" @click="stateOfResetPassword = 0")
    p(class="text-primary text-body1 line-height-1.6") {{$t('a.askToResetPassword')}}
    btn(size="lg" class="w-85" @click="stateOfResetPassword = 2") {{$t('a.resetPassword')}}
  form-reset-password(
    v-else-if="stateOfResetPassword === 2"
    v-model:newPassword="newPassword"
    :email="formData.email"
    @submit="changePassword"
    @close="stateOfResetPassword = 0"
  )
  div(v-else-if="stateOfResetPassword === 3" class="relative bg-black-0 w-112 h-92 rounded-md flex flex-col items-center")
    svg-icon(iconName="close" size="24" class="absolute top-3 right-3 cursor-pointer text-black-700" @click="redirectToNextPage")
    svg-icon(iconName="frontier-logo" size="special" class="mt-10 w-34 h-6.5")
    svg-icon(iconName="reset-successfully" size="88" class="mt-15")
    p(class="text-body1 text-black-800 mt-9") {{$t('a.passwordResetSuccessfully')}}

div(
  v-if="stateOfForgotPassword !== 0"
  class="fixed inset-0 z-10 w-screen h-screen flex justify-center items-center bg-black-100"
)
  div(v-if="stateOfForgotPassword === 1" class="bg-black-0 w-100 h-100 rounded-md flex flex-col")
    div(class="h-12 pr-3 grid items-center")
      svg-icon(iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="closeProcessForgotPassword")
    div(class="flex-grow grid justify-items-center content-start gap-y-4")
      svg-icon(iconName="ic-forgot-key" size="68")
      p(class="text-h6 text-primary font-bold") {{$t('a.forgotPassword')}}
      p(class="max-w-57 text-body2 text-primary text-center line-height-1.6") {{$t('a.emailToReceiveCode')}}
      input-text(v-model:value="emailForgotPassword" class="w-72" prependIcon="mail" size="lg" placeholder="example@gmail.com" :customErrorMsg="errorMsgSendForgotPasswordEmail")
        template(#errorMsg v-if="!isEmailExist")
          div(class="text-caption pt-1")
            p(class="text-warn whitespace-nowrap") {{$t('a.emailNotExist')}}
            p(class="text-assist-blue cursor-pointer pt-1" @click="closeProcessForgotPassword") {{$t('a.createAccount')}}
    div(class="h-21 flex justify-center")
      btn(size="lg" class="w-85" @click="sendEmail" :disabled="!inputValidator.required(emailForgotPassword)") {{$t('a.send')}}
  div(v-else-if="stateOfForgotPassword === 2" class="bg-black-0 w-105 h-96.5 rounded-md flex flex-col")
    div(class="h-12 pr-3 grid items-center")
      svg-icon(iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="closeProcessForgotPassword")
    div(class="flex-grow px-8 flex flex-col items-center")
      svg-icon(iconName="send-mail" size="68" class="mb-4")
      p(class="text-h6 text-primary font-bold mb-4") {{$t('a.verification')}}
      p(class="max-w-58 text-body2 text-primary text-center line-height-1.6 mb-4") {{$t('a.enter6DigitCode', { email: emailForgotPassword })}}
      input-text(v-model:value="verifyCode" class="w-72" size="lg" :placeholder="$t('a.enter6digit')" :customErrorMsg="errorMsgVerifyCode")
      //- todo: fix custom error msg
    div(class="h-25 flex justify-center items-center")
      div(class="grid grid-cols-2 gap-x-3")
        btn(size="md" type="secondary" class="h-10" @click="sendForgotPasswordEmail") {{$t('a.resend')}}
        btn(size="md" class="h-10" @click="verifyForgotPasswordCode") {{$t('a.verify')}}
  form-reset-password(
    v-else-if="stateOfForgotPassword === 3"
    v-model:newPassword="newPassword"
    :email="emailForgotPassword"
    @submit="resetPassword"
    @close="closeProcessForgotPassword"
  )
  div(v-else-if="stateOfForgotPassword === 4" class="relative bg-black-0 w-112 h-92 rounded-md flex flex-col items-center")
    svg-icon(iconName="close" size="24" class="absolute top-3 right-3 cursor-pointer text-black-700" @click="redirectToNextPage")
    svg-icon(iconName="frontier-logo" size="special" class="mt-10 w-34 h-6.5")
    svg-icon(iconName="reset-successfully" size="88" class="mt-15")
    p(class="text-body1 text-black-800 mt-9") {{$t('a.passwordResetSuccessfully')}}
</template>

<script>
import { reactive, ref, toRaw, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import googleSignInApi from '@/utils/google-sign-in-api'
import DropdownLocale from '@/components/DropdownLocale'
import FormResetPassword from '@/components/FormResetPassword'
import inputValidator from '@/utils/input-validator'

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
    const emailForgotPassword = ref('')
    const newPassword = ref('')
    const errorMsgSignIn = ref('')
    const errorMsgSendForgotPasswordEmail = ref('')
    const errorMsgVerifyCode = ref('')
    const isEmailExist = ref(true)
    const verifyCode = ref('')
    const verifyToken = ref('')

    /**
     * state of forgot password
     * 0 -> not on verifying (sigin page)
     * 1 -> key in email which will receive verify code
     * 2 -> key in verify code
     * 3 -> on resetting
     * 4 -> success
     */
    const stateOfForgotPassword = ref(0)

    /**
     * state of reset password
     * 0 -> not on resetting (sigin page)
     * 1 -> show confirm modal to ask user to reset password
     * 2 -> on resetting
     * 3 -> success
     */
    const stateOfResetPassword = ref(0)

    const closeProcessForgotPassword = () => {
      stateOfForgotPassword.value = 0
      emailForgotPassword.value = ''
      isEmailExist.value = true
      errorMsgSendForgotPasswordEmail.value = ''
    }

    const redirectToNextPage = async () => {
      await store.dispatch('user/getUser')
      const organizationList = store.getters['user/organizationList']

      if (organizationList.length === 1) {
        return router.push(`/${organizationList[0].orgName}/public-library`)
      }

      router.push('/')
    }

    const generalSignIn = async () => {
      try {
        errorMsgSignIn.value = ''
        if (!inputValidator.required(formData.email)) {
          throw t('a.enterEmail')
        } else if (!inputValidator.required(formData.password)) {
          throw t('a.enterPassword')
        } else if (!inputValidator.emailFormat(formData.email)) {
          throw t('a.invalidEmail')
        }

        const isOldUser = await store.dispatch('user/generalSignIn', toRaw(formData))

        if (!isOldUser) {
          redirectToNextPage()
        } else {
          stateOfResetPassword.value = 1
        }
      } catch (error) {
        errorMsgSignIn.value = error
      }
    }

    const googleSignIn = async (googleUser) => {
      try {
        await store.dispatch('user/googleSignIn', { idToken: googleUser.getAuthResponse().id_token })
        redirectToNextPage()
      } catch (error) {
        errorMsgSignIn.value = error
      }
    }

    const changePassword = async () => {
      await store.dispatch('user/changePassword', { password: newPassword.value })
      stateOfResetPassword.value = 3
    }

    const sendForgotPasswordEmail = () => store.dispatch('user/sendForgotPasswordEmail', { email: emailForgotPassword.value })

    const sendEmail = async () => {
      try {
        if (!inputValidator.emailFormat(emailForgotPassword.value)) {
          throw t('a.invalidEmail')
        }

        isEmailExist.value = await store.dispatch('user/checkEmailExist', { email: emailForgotPassword.value })

        if (!isEmailExist.value) { return }

        await sendForgotPasswordEmail({ email: emailForgotPassword.value })
        stateOfForgotPassword.value = 2
      } catch (error) {
        errorMsgSendForgotPasswordEmail.value = error
      }
    }

    const verifyForgotPasswordCode = async () => {
      try {
        verifyToken.value = await store.dispatch('user/verifyForgotPasswordCode', { verifyCode: verifyCode.value })
        stateOfForgotPassword.value = 3
      } catch (error) {
        errorMsgVerifyCode.value = error
      }
    }

    const resetPassword = async () => {
      await store.dispatch('user/resetPassword', { password: newPassword.value, verifyToken: verifyToken.value })
      stateOfForgotPassword.value = 4
    }

    onMounted(async () => {
      await googleSignInApi.init()
      googleSignInApi.attachClickHandler({
        elementId: 'google-sign-in',
        successHandler: googleSignIn,
        failHandler (error) {
          console.log(error)
          if (error.error === 'popup_closed_by_user') { return }
          errorMsgSignIn.value = t('a.googleSideError')
        }
      })
    })

    watch(
      () => emailForgotPassword.value,
      () => {
        isEmailExist.value = true
        errorMsgSendForgotPasswordEmail.value = ''
      }
    )

    return {
      formData,
      errorMsgSignIn,
      generalSignIn,
      stateOfResetPassword,
      stateOfForgotPassword,
      redirectToNextPage,
      sendEmail,
      emailForgotPassword,
      errorMsgSendForgotPasswordEmail,
      inputValidator,
      isEmailExist,
      closeProcessForgotPassword,
      sendForgotPasswordEmail,
      errorMsgVerifyCode,
      verifyForgotPasswordCode,
      newPassword,
      changePassword,
      resetPassword,
      verifyCode
    }
  }
}
</script>
