<style lang="scss" scoped>
.card-shadow {
  box-shadow: 2px 3px 15px 5px rgba(0, 0, 0, 0.03);
}

.mt-signIn {
  margin-top: calc((100vh - 498px) * (186 / (900 - 498)));
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
          input-field(v-model:value="formData.email" :placeholder="$t('word.email')" prependIcon="mail")
          input-field-password(v-model:value="formData.password" :placeholder="$t('word.password')" prependIcon="lock")
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
</template>

<script>
import { reactive, ref, toRaw, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import googleSignInApi from '@/utils/google-sign-in-api'
import DropdownLocale from '@/components/DropdownLocale'

export default {
  name: 'SignIn',
  components: {
    DropdownLocale
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()

    const formData = reactive({
      email: '',
      password: ''
    })
    const errorMsg = ref('')

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

        await store.dispatch('account/generalSignIn', toRaw(formData))
      } catch (error) {
        errorMsg.value = error
      }
    }

    const googleSignIn = async (googleUser) => {
      try {
        await store.dispatch('account/googleSignIn', { idToken: googleUser.getAuthResponse().id_token })
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
      generalSignIn
    }
  }
}
</script>
