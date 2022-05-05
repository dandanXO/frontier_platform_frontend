<template lang="pug">
div(class="w-105 px-8 flex flex-col items-center")
  h6(class="text-h6 font-bold text-primary pb-7.5") {{ $t("MM0025") }}
  form(class="w-full")
    input-password(v-model:textValue="currentPassword" :placeholder="$t('MM0026')" class="mb-7.5")
    input-password(v-model:textValue="newPassword" :placeholder="$t('MM0027')")
    password-validator(v-model:isValid="isPasswordValid" :password="newPassword" class="pt-1")
  btn-group(
    class="h-25"
    :primaryText="$t('UU0001')"
    @click:primary="changePassword"
    :primaryButtonDisabled="!availableToChangePassword"
    :secondaryText="$t('UU0002')"
    @click:secondary="closeModal"
  )
</template>

<script>
import { computed, ref } from 'vue'
import PasswordValidator from '@/components/account/PasswordValidator.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalChangePassword',
  components: {
    PasswordValidator
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const currentPassword = ref('')
    const newPassword = ref('')
    const isPasswordValid = ref(false)

    const availableToChangePassword = computed(() => !!newPassword.value && !!currentPassword.value && isPasswordValid.value)

    const closeModal = () => store.dispatch('helper/closeModal')

    const changePassword = async () => {
      await store.dispatch('user/changePassword', { currentPassword: currentPassword.value, newPassword: newPassword.value })
      closeModal()
      store.commit('helper/PUSH_message', t('MM0030'))
    }

    return {
      newPassword,
      currentPassword,
      isPasswordValid,
      availableToChangePassword,
      changePassword,
      closeModal
    }
  }
}
</script>
