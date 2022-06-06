<template lang="pug">
modal-behavior(
  :header="$t('AA0047')"
  :primaryBtnText="$t('UU0052')"
  :secondaryBtnText="$t('UU0051')"
  @click:primary="verifyForgotPasswordCode"
  @click:secondary="sendForgotPasswordEmail"
)
  div(class="flex flex-col items-center")
    svg-icon(iconName="send-mail" size="68" class="mb-4")
    p(class="text-h6 text-primary font-bold mb-4") {{ $t("AA0047") }}
    p(class="max-w-58 text-body2 text-primary text-center leading-1.6 mb-4") {{ $t("AA0048", { email }) }}
    input-text(v-model:textValue="verifyCode" class="w-72" size="lg" :placeholder="$t('AA0076')")
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  email: {
    type: String,
    required: true
  }
})

const store = useStore()
const verifyCode = ref('')
const sendForgotPasswordEmail = () => store.dispatch('user/sendForgotPasswordEmail', { email: props.email })
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
