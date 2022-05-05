<template lang="pug">
div(class="w-105 px-8 flex flex-col items-center")
  p(class="text-body1 text-black-800 font-bold mb-8") {{ $t("AA0060") }}
  span(class="text-body2 text-primary mb-3") {{ email }}
  span(class="text-body2 text-black-600 mb-8") {{ $t("AA0053") }}
  form(class="w-full pb-5.5")
    input-password(v-model:textValue="password" :placeholder="$t('AA0055')")
    password-validator(v-model:isValid="isPasswordValid" :password="password" class="mt-1 mb-7")
    input-password(v-model:textValue="confirmPassword" :placeholder="$t('AA0056')" :customErrorMsg="errorMsg")
  div(class="h-25 flex items-center")
    btn(size="lg" class="w-85" :disabled="!availableToChangePassword" @click="changeHandler") {{ $t("UU0054") }}
</template>

<script>
import { computed, ref } from 'vue'
import PasswordValidator from '@/components/account/PasswordValidator.vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'ModalResetPassword',
  components: {
    PasswordValidator
  },
  props: {
    email: {
      type: String,
      required: true
    },
    verifyToken: {
      type: String
    },
    mode: {
      type: Number,
      default: 0
    }
  },
  setup (props) {
    const MODE = {
      FORGOT: 0,
      OLD_RESET: 1
    }
    const { t } = useI18n()
    const store = useStore()
    const confirmPassword = ref('')
    const isPasswordValid = ref(false)
    const { nextAfterSignIn } = useNavigation()

    const password = ref('')
    const errorMsg = computed(() => {
      if (password.value === '' || confirmPassword.value === '') {
        return ''
      }

      return (password.value !== confirmPassword.value)
        ? t('WW0070')
        : ''
    })
    const availableToChangePassword = computed(() => password.value !== '' && confirmPassword.value !== '' && isPasswordValid.value && password.value === confirmPassword.value)

    const changeHandler = async () => {
      switch (props.mode) {
        case MODE.FORGOT:
          await store.dispatch('user/resetPassword', { password: password.value, verifyToken: props.verifyToken })
          break
        case MODE.OLD_RESET:
          await store.dispatch('user/oldUserResetPassword', { password: password.value })
          break
      }
      await nextAfterSignIn()
      store.dispatch('helper/closeModal')
    }

    return {
      password,
      confirmPassword,
      isPasswordValid,
      errorMsg,
      availableToChangePassword,
      changeHandler
    }
  }
}
</script>
