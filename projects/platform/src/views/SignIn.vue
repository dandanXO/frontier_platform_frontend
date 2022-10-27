<template lang="pug">
div(class="w-screen h-screen flex justify-center items-center bg-grey-50")
  dropdown-locale(class="fixed top-7.5 right-9")
  div(class="h-125 flex items-center")
    div(
      class="w-97.5 h-full bg-contain mr-23"
      :style="{ backgroundImage: `url(${imgCover})` }"
    )
    div(class="w-105")
      div(class="w-full rounded-lg card-shadow px-10 py-11 flex flex-col")
        p(
          class="text-grey-900 text-h6 font-bold text-center pb-5.5 border-b border-grey-200"
        ) {{ $t('AA0001') }}
        form(class="grid gap-y-3 mt-5 mb-1.5")
          f-input-text(
            v-model:textValue="formData.email"
            :placeholder="$t('AA0002')"
            prependIcon="mail"
            data-cy="email"
          )
          f-input-password(
            v-model:textValue="formData.password"
            :placeholder="$t('AA0003')"
            data-cy="password"
          )
        span(
          class="self-end text-caption text-grey-600 mb-4 cursor-pointer"
          @click="openModalForgotPasswordEmail"
        ) {{ $t('UU0043') }}
        f-button(
          size="lg"
          class="w-full font-bold self-center"
          @click="generalSignIn"
          data-cy="login"
        ) {{ $t('AA0001') }}
        div(class="flex-grow text-caption mt-1.5 h-5")
          p(
            v-if="errorMsgSignIn !== ''"
            class="text-red-400 text-center"
            data-cy="errorMsg"
          ) {{ errorMsgSignIn }}
        template(v-if="!isGoogleLoadFail")
          div(class="grid grid-flow-col gap-x-3 items-center justify-center mb-4")
            div(class="w-19 h-px border-b border-grey-200")
            span(class="w-30.5 text-grey-200 text-body2 text-center") {{ $t('AA0005') }}
            div(class="w-19 h-px border-b border-grey-200")
          button#google-sign-in
      i18n-t(
        keypath="UU0045"
        tag="p"
        class="text-grey-600 text-body2 font-normal text-center pt-3"
        scope="global"
      )
        template(#signUp)
          router-link(
            class="text-grey-900 font-bold ml-3"
            :to="{ path: '/sign-up', query: $route.query }"
            data-cy="sign-up-page"
          ) {{ $t('AA0016') }}
</template>

<script setup>
import { reactive, ref, toRaw, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import SignInWithGoogle from '@/utils/signInWithGoogle.js'
import inputValidator from '@/utils/input-validator'
import useNavigation from '@/composables/useNavigation'
import imgCover from '@/assets/images/cover.png'
import DropdownLocale from '@/components/common/DropdownLocale.vue'

const { t } = useI18n()
const store = useStore()
const { nextAfterSignIn } = useNavigation()
const formData = reactive({
  email: '',
  password: '',
})
const errorMsgSignIn = ref('')

const openModalForgotPasswordEmail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-forgot-password-email',
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

  store.dispatch('helper/openModalLoading')

  const { isOldUser, oldUserVerifyToken } = await store.dispatch(
    'user/generalSignIn',
    toRaw(formData)
  )

  if (isOldUser) {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-ask-reset-password',
      properties: {
        email: formData.email,
        oldUserVerifyToken,
      },
    })
  } else {
    await nextAfterSignIn()
    store.dispatch('helper/closeModalLoading')
  }
}

const isGoogleLoadFail = ref(false)

onMounted(() => {
  const googleSignIn = new SignInWithGoogle({
    elementId: 'google-sign-in',
    callback: async (response) => {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('user/googleSignIn', {
        idToken: response.credential,
      })
      await nextAfterSignIn()
      store.dispatch('helper/closeModalLoading')
    },
  })
  isGoogleLoadFail.value = !googleSignIn.google
})
</script>
