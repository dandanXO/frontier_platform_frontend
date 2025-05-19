<template lang="pug">
div(class="w-105 flex flex-col gap-5")
  div(class="w-full rounded-lg shadow-4 p-8 flex flex-col gap-5")
    p(class="text-primary-inverse text-xl font-bold text-center" data-cy="login-title") {{ $t('AA0093') }}
    div(class="border-b border-primary-border")
    form(class="grid gap-5" @submit.prevent)
      f-input-text(
        v-model:textValue="formData.email"
        :label="$t('AA0002')"
        placeholder="name@mail.com"
        data-cy="email"
      )
      div(class="flex flex-col gap-2")
        f-input-password(
          v-model:textValue="formData.password"
          :label="$t('AA0003')"
          :placeholder="$t('AA0094')"
          data-cy="password"
        )
        f-button(
          type="text"
          class="self-end w-fit underline font-semibold"
          size="sm"
          @click="openModalForgotPasswordEmail"
        ) {{ $t('AA0095') }}
      f-button(
        htmlType="submit"
        size="lg"
        class="w-full font-bold self-center"
        @click="$emit('onSignIn', formData)"
        data-cy="login"
      ) {{ $t('AA0093') }}
    div(class="flex-grow text-caption h-5" v-if="errorMsgSignIn !== ''")
      p(class="text-red-400 text-center" data-cy="errorMsg") {{ errorMsgSignIn }}
    template(v-if="!isGoogleLoadFail")
      div(class="flex flex-row gap-x-1 items-center justify-center")
        div(class="h-px bg-primary-border w-full")
        span(class="text-grey-250 text-body2 text-center") {{ $t('AA0005') }}
        div(class="h-px bg-primary-border w-full gap-2")
      button#google-sign-in(class="h-10 self-center")
  i18n-t(
    keypath="UU0045"
    tag="p"
    class="text-grey-600 text-body2 font-normal items-center flex flex-row self-center"
    scope="global"
  )
    template(#signUp)
      //- span(
      //-   class="text-grey-900 font-bold ml-3 cursor-pointer"
      //-   data-cy="sign-up-page"
      //-   @click="openSignUpRequestModal"
      //- ) {{ $t('AA0016') }}
      //- Considering that competitors can use Frontier Platform at will, a sign up review mechanism is added. 
      //- Only the application form is sent, and direct registration is not possible.
      //- However, considering that it may be added back in the future, I only commented it out.
      router-link(
        :to="{ path: '/sign-up', query: $route.query }"
        data-cy="sign-up-page"
      ) 
        f-button(type="text" class="self-end w-fit underline font-semibold" size="sm") {{ $t('AA0096') }}
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useStore } from 'vuex'

export interface FormData {
  email: string
  password: string
}

defineProps<{
  isGoogleLoadFail: boolean
  errorMsgSignIn: string
}>()

defineEmits<{
  (e: 'onSignIn', data: FormData): void
}>()

const store = useStore()
const formData = reactive({
  email: '',
  password: '',
})

const openModalForgotPasswordEmail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-forgot-password-email',
  })
}

// maybe used in the future, based on the UI above
// const openSignUpRequestModal = () => {
//   store.dispatch('helper/openModalBehavior', {
//     component: 'modal-sign-up-request',
//   })
// }
</script>
