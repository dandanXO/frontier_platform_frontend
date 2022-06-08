<template lang="pug">
modal-behavior(
  :header="$t('AA0088')"
  :primaryBtnText="$t('UU0111')"
  :textBtnText="$t('UU0110')"
  @click:primary="openResetPassword"
  @click:text="closeModal"
)
  p(class="w-94 text-primary text-body1 leading-1.6") {{ $t("AA0059") }}
</template>

<script setup>
import { useStore } from 'vuex'

const props = defineProps({
  email: {
    type: String,
    required: true
  }
})

const store = useStore()
const openResetPassword = () => {
  store.dispatch('helper/openModal', {
    component: 'modal-reset-password',
    properties: {
      mode: 1,
      email: props.email
    }
  })
}

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
