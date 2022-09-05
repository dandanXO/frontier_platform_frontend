<template lang="pug">
modal-behavior(
  :header="$t('AA0088')"
  :primaryBtnText="$t('UU0111')"
  :textBtnText="$t('UU0110')"
  @click:primary="openResetPassword"
  @click:text="closeModal"
)
  i18n-t(keypath="AA0059" tag="p" class="w-94 text-primary text-body1 leading-1.6" scope="global")
    template(#newline)
      br
</template>

<script setup>
import { useStore } from 'vuex'

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  oldUserVerifyToken: {
    type: String,
    required: true
  }
})

const store = useStore()
const openResetPassword = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-reset-password',
    properties: {
      mode: 1,
      email: props.email,
      oldUserVerifyToken: props.oldUserVerifyToken
    }
  })
}

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
