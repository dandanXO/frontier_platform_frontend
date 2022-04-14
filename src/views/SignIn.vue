<template lang="pug">
div(class="w-screen h-screen flex justify-center items-center bg-black-100")
  //- div(class="fixed top-7.5 right-9")
  //-   dropdown-locale
  div(class="h-125 flex items-start")
    div(class="w-97.5 h-125 bg-contain mr-23" :style="{ backgroundImage: `url(${imgCover})` }")
    div(class="w-105")
      div(class="w-full h-110 rounded-lg card-shadow px-10 py-11 flex flex-col")
        p(class="text-primary text-h6 font-bold text-center pb-5.5 border-b border-black-400") {{ $t("AA0001") }}
        form(class="grid gap-y-3 mt-5 mb-1.5")
          input-text(v-model:textValue="formData.email" :placeholder="$t('AA0002')" prependIcon="mail")
          input-password(v-model:textValue="formData.password" :placeholder="$t('AA0003')")
        span(class="self-end text-caption text-black-800 mb-4 cursor-pointer" @click="openModalForgotPasswordEmail") {{ $t("UU0043") }}
        btn(size="lg" class="w-full font-bold self-center" @click="generalSignIn") {{ $t("AA0001") }}
        div(class="flex-grow text-caption mt-1.5")
          p(v-if="errorMsgSignIn !== ''" class="text-warn text-center") {{ errorMsgSignIn }}
        div(class="grid grid-flow-col gap-x-3 items-center justify-center mb-4")
          div(class="w-19 h-px border-b border-black-400")
          span(class="w-30.5 text-black-500 text-body2 text-center") {{ $t("AA0005") }}
          div(class="w-19 h-px border-b border-black-400")
        button(id="google-sign-in" class="w-85 h-11 rounded border text-body2 font-bold text-black-800 flex justify-center items-center")
          div(class="grid grid-flow-col gap-x-2.5 items-center")
            img(src="@/assets/images/google.png")
            span(class="w-40.5 text-center text-body2") {{ $t("UU0044") }}
      i18n-t(keypath="UU0045" tag="p" class="text-black-800 text-body2 font-normal text-center pt-3")
        template(#signUp)
          router-link-extending(class="text-primary font-bold ml-3" :to="{ path: '/sign-up', query: $route.query }") {{ $t("AA0016") }}
</template>

<script>
import { reactive, ref, toRaw, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import googleSignInApi from '@/utils/google-sign-in-api'
// import DropdownLocale from '@/components/DropdownLocale.vue'
import inputValidator from '@/utils/input-validator'
import useNavigation from '@/composables/useNavigation'
import imgCover from '@/assets/images/cover.png'

export default {
  name: 'SignIn',
  components: {
    // DropdownLocale
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const { nextAfterSignIn } = useNavigation()
    const formData = reactive({
      email: '',
      password: ''
    })
    const errorMsgSignIn = ref('')

    const openModalForgotPasswordEmail = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-forgot-password-email'
      })
    }

    const generalSignIn = async () => {
      errorMsgSignIn.value = ''
      if (!inputValidator.required(formData.email)) {
        return (errorMsgSignIn.value = t('WW0062'))
      } else if (!inputValidator.required(formData.password)) {
        return (errorMsgSignIn.value = t('WW0063'))
      } else if (!inputValidator.emailFormat(formData.email)) {
        return (errorMsgSignIn.value = t('WW0019'))
      }

      const isOldUser = await store.dispatch('user/generalSignIn', toRaw(formData))

      if (!isOldUser) {
        nextAfterSignIn()
      } else {
        store.dispatch('helper/openModal', {
          component: 'modal-ask-reset-password',
          properties: {
            email: formData.email
          }
        })
      }
    }

    const googleSignIn = async (googleUser) => {
      await store.dispatch('user/googleSignIn', { idToken: googleUser.getAuthResponse().id_token })
      nextAfterSignIn()
    }

    onMounted(async () => {
      await googleSignInApi.init()
      googleSignInApi.attachClickHandler({
        elementId: 'google-sign-in',
        successHandler: googleSignIn,
        failHandler (error) {
          if (error.error === 'popup_closed_by_user') { return }
          errorMsgSignIn.value = t('AA0065')
        }
      })
    })

    return {
      formData,
      errorMsgSignIn,
      generalSignIn,
      openModalForgotPasswordEmail,
      imgCover
    }
  }
}
</script>
