<template lang="pug">
div(class="card-shadow w-105 h-110 rounded-lg relative p-10 flex flex-col items-center")
  svg-icon(iconName="close" class="absolute top-3 right-3 cursor-pointer" color="black-700" @click="$emit('close')")
  p(class="text-body1 text-black-800 font-bold mb-8") {{$t('term.resetPassword')}}
  span(class="text-body2 text-primary mb-3") {{email}}
  span(class="text-body2 text-black-600 mb-8") {{$t('sentence.enterPasswordAndConfirmPassword')}}
  form(class="w-full")
    input-password(v-model:value="password" :placeholder="$t('term.newPassword')" prependIcon="lock")
    password-validator(v-model:isValid="isPasswordValid" :password="password" class="mt-1 mb-7")
    input-password(v-model:value="confirmPassword" :placeholder="$t('term.confirmPassword')" prependIcon="lock")
  div(class="flex-grow self-start" class="mt-1 mb-7.5")
    p(v-if="errorMsg !== ''" class="text-caption text-warn") {{errorMsg}}
  btn(size="lg" :disabled="!avaliableToChangePassword" @click="changePassword") {{$t('term.changePassword')}}
</template>

<script>
import { computed, ref } from 'vue'
import PasswordValidator from '@/components/PasswordValidator'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default {
  name: 'FormResetPassword',
  components: {
    PasswordValidator
  },
  props: {
    email: {
      type: String,
      required: true
    }
  },
  setup (_, { emit }) {
    const { t } = useI18n()
    const store = useStore()
    const password = ref('')
    const confirmPassword = ref('')
    const isPasswordValid = ref(false)

    const errorMsg = computed(() => {
      if (password.value === '' || confirmPassword.value === '') {
        return ''
      }

      return (password.value !== confirmPassword.value)
        ? t('error.passwordNotMatch')
        : ''
    })
    const avaliableToChangePassword = computed(() => password.value !== '' && confirmPassword.value !== '' && isPasswordValid.value && password.value === confirmPassword.value)

    const changePassword = async () => {
      await store.dispatch('user/changePassword', { password: password.value })
      emit('submit')
    }

    return {
      password,
      confirmPassword,
      isPasswordValid,
      errorMsg,
      avaliableToChangePassword,
      changePassword
    }
  }
}
</script>
