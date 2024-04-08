<template lang="pug">
div
  img(
    src="@/assets/images/private-view-overlay.png"
    class="fixed w-screen h-screen inset-0 object-cover z-1"
    alt="private-view-overlay"
  )
  div(
    class="fixed w-screen h-screen inset-0 z-2 bg-grey-900/70 flex items-center justify-center"
  )
    div(class="w-84 box-content bg-grey-0 rounded-lg py-12 px-10")
      f-svg-icon(icon-name="internal" size="40" class="text-grey-900 mx-auto")
      h5(class="text-grey-900 text-h5 font-bold text-center pt-3") {{ $t('RR0345') }}
      form(class="grid mt-6 mb-10" @keydown.enter.prevent="verify")
        f-input-text(
          v-model:textValue="privateInfo.email"
          :placeholder="$t('VV0038')"
          prependIcon="mail"
          :hintError="errorMsgUnderEmail"
          :disabled="showLoginView"
          class="mb-6"
        )
        f-input-password(
          v-model:textValue="privateInfo.accessCode"
          :placeholder="$t('RR0346')"
          :hintError="errorMsgUnderAccessCode"
          :disabled="showLoginView"
        )
        div(class="pt-6 pb-4 text-caption text-right")
          span {{ $t('RR0347') }} &nbsp;
          span(class="text-cyan-400 cursor-pointer" @click="copyContactEmail") {{ $t('RR0348') }}
        f-input-password(
          v-if="showLoginView"
          v-model:textValue="password"
          :placeholder="$t('AA0003')"
          :hintError="errorMsgUnderPassword"
        )
      f-button(v-if="!showLoginView" size="lg" class="w-full" @click="verify") {{ $t('UU0147') }}
      template(v-else) 
        f-button(size="lg" class="w-full" @click="generalSignIn") {{ $t('AA0001') }}
        f-button(size="lg" class="w-full mt-4" type="secondary" @click="skip") {{ $t('UU0148') }}
        template(v-if="!isGoogleLoadFail")
          div(class="grid grid-flow-col gap-x-3 items-center justify-center my-6")
            div(class="w-19 h-px border-b border-grey-250")
            span(class="w-30.5 text-grey-250 text-body2 text-center") {{ $t('AA0005') }}
            div(class="w-19 h-px border-b border-grey-250")
          button#google-sign-in(v-show="!isGoogleLoadFail && showLoginView")
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useOuterStore } from '@/stores/outer'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { ref, watch, nextTick } from 'vue'
import { inputValidator, copyText } from '@frontier/lib'
import { useI18n } from 'vue-i18n'
import { OUTER_TYPE } from '@/utils/constants'
import SignInWithGoogle from '@/utils/signInWithGoogle.js'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'

const route = useRoute()
const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const userStore = useUserStore()
const outerStore = useOuterStore()
const { ogBaseEmbedApi, ogBaseReceivedShareApi } = outerStore
const { privateInfo, outerType, hasVerified, contactEmail } =
  storeToRefs(outerStore)
const password = ref('')
const errorMsgUnderEmail = ref('')
const errorMsgUnderAccessCode = ref('')
const errorMsgUnderPassword = ref('')
watch(
  () => privateInfo.value.email,
  () => {
    errorMsgUnderEmail.value = ''
  }
)
watch(
  () => privateInfo.value.accessCode,
  () => {
    errorMsgUnderAccessCode.value = ''
  }
)
watch(
  () => password.value,
  () => {
    errorMsgUnderPassword.value = ''
  }
)
const showLoginView = ref(false)
const isGoogleLoadFail = ref(false)

const verify = async () => {
  const verifyEmail = () => {
    if (!inputValidator.required(privateInfo.value.email)) {
      return (errorMsgUnderEmail.value = t('WW0062'))
    }
    if (!inputValidator.emailFormat(privateInfo.value.email)) {
      return (errorMsgUnderEmail.value = t('WW0044'))
    }
  }
  const verifyAccessCode = () => {
    if (!inputValidator.required(privateInfo.value.accessCode)) {
      return (errorMsgUnderAccessCode.value = t('WW0163'))
    }
  }

  verifyEmail()
  verifyAccessCode()
  if (errorMsgUnderEmail.value !== '' || errorMsgUnderAccessCode.value !== '') {
    return
  }

  try {
    const sharingKey = route.params.sharingKey as string
    /**
     * need a verify api to check if the private info is correct
     */
    if (outerType.value === OUTER_TYPE.RECEIVED_SHARE) {
      const {
        data: { result },
      } = await ogBaseReceivedShareApi('checkReceiveSharePrivateInfo', {
        sharingKey,
        privateInfo: privateInfo.value,
      })

      if (!result.isFrontierUser || userStore.hasLogin) {
        hasVerified.value = true
        return
      }

      showLoginView.value = true
      await nextTick()
      try {
        const googleSignIn = new SignInWithGoogle({
          elementId: 'google-sign-in',
          callback: async (response: { credential: string }) => {
            store.dispatch('helper/openModalLoading')
            try {
              await store.dispatch('user/googleSignIn', {
                idToken: response.credential,
              })
              hasVerified.value = true
            } catch (error) {
              const code = (error as any).code as string
              switch (code) {
                case 'WW0064':
                  return (errorMsgUnderAccessCode.value = t('WW0064'))
                case 'WW0065':
                  return (errorMsgUnderAccessCode.value = t('WW0065'))
                default:
                  throw error
              }
            } finally {
              store.dispatch('helper/closeModalLoading')
            }
          },
        })
        isGoogleLoadFail.value = !googleSignIn.google
      } catch {
        isGoogleLoadFail.value = true
      }
    }
    if (outerType.value === OUTER_TYPE.EMBED) {
      await ogBaseEmbedApi('getEmbedInfo', {
        sharingKey,
        privateInfo: privateInfo.value,
      })
      hasVerified.value = true
    }
  } catch (error) {
    const code = (error as any).code as string

    switch (code) {
      case 'ERR0066':
        return (errorMsgUnderAccessCode.value = t('WW0162'))
      case 'ERR0065':
        return (errorMsgUnderEmail.value = t('WW0159'))
      case 'WW0044':
        return (errorMsgUnderEmail.value = t('WW0044'))
      default:
        throw error
    }
  }
}

const generalSignIn = async () => {
  if (!inputValidator.required(password.value)) {
    return (errorMsgUnderPassword.value = t('WW0063'))
  }
  try {
    await store.dispatch('user/generalSignIn', {
      email: privateInfo.value.email,
      password: password.value,
    })
  } catch (error) {
    const code = (error as any).code as string
    switch (code) {
      case 'WW0061':
        return (errorMsgUnderPassword.value = t('WW0074'))
      case 'WW0044':
        return (errorMsgUnderEmail.value = t('WW0044'))
      default:
        throw error
    }
  }
}

const skip = () => {
  showLoginView.value = false
  hasVerified.value = true
}

const copyContactEmail = () => {
  if (!contactEmail.value) {
    return
  }

  copyText(contactEmail.value)
  notify.showNotifySnackbar({ messageText: t('RR0359') })
}
</script>
