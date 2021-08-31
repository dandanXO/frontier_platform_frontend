<template lang="pug">
div(class="card-shadow w-105 h-110 rounded-lg relative p-10 flex flex-col items-center")
  svg-icon(iconName="close" size="24" class="absolute top-3 right-3 cursor-pointer text-black-700" @click="$emit('close')")
  p(class="text-body1 text-black-800 font-bold mb-8") {{$t('a.resetPassword')}}
  span(class="text-body2 text-primary mb-3") {{email}}
  span(class="text-body2 text-black-600 mb-8") {{$t('a.enterPasswordAndConfirmPassword')}}
  form(class="w-full")
    input-password(v-model:textValue="password" :placeholder="$t('a.newPassword')")
    password-validator(v-model:isValid="isPasswordValid" :password="password" class="mt-1 mb-7")
    input-password(v-model:textValue="confirmPassword" :placeholder="$t('a.confirmPassword')")
  div(class="flex-grow self-start" class="mt-1 mb-7.5")
    p(v-if="errorMsg !== ''" class="text-caption text-warn") {{errorMsg}}
  btn(size="lg" class="w-85" :disabled="!avaliableToChangePassword" @click="$emit('submit')") {{$t('a.changePassword')}}
</template>

<script>
import { computed, ref } from 'vue'
import PasswordValidator from '@/components/PasswordValidator'
import { useI18n } from 'vue-i18n'

export default {
  name: 'FormResetPassword',
  components: {
    PasswordValidator
  },
  props: {
    newPassword: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  emits: ['submit', 'update:newPassword'],
  setup (props, { emit }) {
    const { t } = useI18n()
    const confirmPassword = ref('')
    const isPasswordValid = ref(false)

    const password = computed({
      get: () => props.newPassword,
      set: (v) => emit('update:newPassword', v)
    })
    const errorMsg = computed(() => {
      if (password.value === '' || confirmPassword.value === '') {
        return ''
      }

      return (password.value !== confirmPassword.value)
        ? t('a.passwordNotMatch')
        : ''
    })
    const avaliableToChangePassword = computed(() => password.value !== '' && confirmPassword.value !== '' && isPasswordValid.value && password.value === confirmPassword.value)

    return {
      password,
      confirmPassword,
      isPasswordValid,
      errorMsg,
      avaliableToChangePassword
    }
  }
}
</script>
