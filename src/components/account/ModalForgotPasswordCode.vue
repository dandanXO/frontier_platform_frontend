<template lang="pug">
modal-behavior(
  :header="$t('AA0047')"
  :primaryBtnText="$t('UU0052')"
  :secondaryBtnText="$t('UU0051')"
  @click:primary="verifyForgotPasswordCode"
  @click:secondary="sendForgotPasswordEmail"
)
  div(class="w-80 flex flex-col items-center")
    svg-icon(iconName="send-mail" size="68" class="mb-4")
    p(class="text-h6 text-primary font-bold mb-4") {{ $t("AA0047") }}
    i18n-t(keypath="AA0048" tag="div" class="text-body2 text-primary text-center leading-1.6 mb-4")
      template(#email)
        br
        div(class="font-bold line-clamp-1") {{ email }}
    input-text(v-model:textValue="verifyCode" class="w-full pb-8" size="lg" :placeholder="$t('AA0076')")
</template>

<script setup>
import { ref } from 'vue'
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

const sendForgotPasswordEmail = async () => {
  await store.dispatch('user/sendForgotPasswordEmail', { email: props.email })
  store.commit('helper/PUSH_message', t('AA0088'))
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
</script>
