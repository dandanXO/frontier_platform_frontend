<template lang="pug">
modal-behavior(
  :header="$t('AA0030')"
  :primaryBtnText="$t('UU0031')"
  @click:primary="closeModal"
)
  div(class="w-84")
    p(class="text-body2 text-primary leading-1.6 pb-1.5") {{ $t("AA0052") }}
    p(class="text-body2 text-assist-blue leading-1.6 cursor-pointer" @click="resendVerifyEmail") {{ $t("UU0056") }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const { t } = useI18n()
const store = useStore()

const resendVerifyEmail = () => {
  store.dispatch('user/resendVerifyEmail')
  closeModal()
}
const closeModal = () => {
  store.dispatch('helper/closeModalBehavior')
  store.commit('helper/PUSH_message', t('AA0087'))
}
</script>
