<template lang="pug">
modal-behavior(
  :header="$t('MM0025')"
  :primaryBtnText="$t('UU0001')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="!availableToChangePassword"
  @click:primary="changePassword"
  @click:secondary="closeModal"
)
  form(class="w-85")
    input-password(v-model:textValue="currentPassword" :placeholder="$t('MM0026')" class="mb-7.5")
    input-password(v-model:textValue="newPassword" :placeholder="$t('MM0027')")
    password-validator(v-model:isValid="isPasswordValid" :password="newPassword" class="pt-1")
</template>

<script setup>
import { computed, ref } from 'vue'
import PasswordValidator from '@/components/account/PasswordValidator.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

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
  store.dispatch('helper/pushFlashMessage', t('MM0030'))
}
</script>
