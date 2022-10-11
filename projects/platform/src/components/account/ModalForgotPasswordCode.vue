<template lang="pug">
modal-behavior(
  :header="$t('AA0047')"
  :primaryBtnText="$t('UU0052')"
  :primaryBtnDisabled="verifyCode.length !== 6"
  @click:primary="verifyForgotPasswordCode"
)
  div(class="w-80 flex flex-col items-center")
    f-svg-icon(iconName="send_mail" size="68" class="mb-4")
    i18n-t(keypath="AA0048" tag="div" class="text-body2 text-grey-900 text-center leading-1.6 mb-4" scope="global")
      template(#email)
        br
        div(class="font-bold line-clamp-1") {{ email }}
    f-input-text(v-model:textValue="verifyCode" class="w-80 mb-8" size="lg" :placeholder="$t('AA0076')")
    p(
      ref="refText"
      class="text-body2 leading-1.6 w-fit"
      :class="[secRemains > 0 ? 'text-grey-200 cursor-not-allowed' : 'text-cyan-400 cursor-pointer']"
      @click="sendForgotPasswordEmail"
    )
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  email: {
    type: String,
    required: true
  }
})

const { t } = useI18n()
const store = useStore()
const verifyCode = ref('')
const refText = ref(null)
const secRemains = ref(0)

const sendForgotPasswordEmail = async () => {
  if (secRemains.value > 0) return
  startCountDown()
  await store.dispatch('user/sendForgotPasswordEmail', { email: props.email })
  store.dispatch('helper/pushFlashMessage', t('AA0088'))
}

let timerId
const startCountDown = () => {
  secRemains.value = 30
  refText.value.textContent = `${t('UU0051')}... (${secRemains.value})`

  timerId = setInterval(() => {
    secRemains.value--
    refText.value.textContent = `${t('UU0051')}... (${secRemains.value})`
    if (secRemains.value <= 0) {
      refText.value.textContent = t('UU0051')
      clearInterval(timerId)
    }
  }, 1000)
}

const verifyForgotPasswordCode = async () => {
  const verifyToken = await store.dispatch('user/verifyForgotPasswordCode', { verifyCode: verifyCode.value })
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-reset-password',
    properties: {
      mode: 0,
      email: props.email,
      verifyToken
    }
  })
}

onMounted(() => {
  if (refText.value) {
    refText.value.textContent = t('UU0051')
    startCountDown()
  }
})

onUnmounted(() => {
  clearInterval(timerId)
})
</script>
