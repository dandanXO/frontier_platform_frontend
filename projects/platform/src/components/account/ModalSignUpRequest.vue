<template lang="pug">
modal-behavior(
  :header="$t('AA0026')"
  :primaryBtnText="$t('UU0049')"
  :primaryBtnDisabled="!availableToSend"
  @click:primary="submitSignupRequest"
)
  div(class="w-180.5 flex flex-col items-center")
    p(class="w-100 text-body2 text-grey-900 text-center leading-1.6 mb-3") {{ $t('OO0043') }}
    p(class="text-caption text-grey-600 self-end") *{{ $t('RR0163') }}
    form(class="w-full h-66 grid grid-cols-2 grid-rows-3 grid-flow-col gap-7.5")
      f-input-text(
        ref="refInputRecipient"
        v-model:textValue="formData.name"
        required
        :label="$t('AA0092')"
        :rules="[$inputRules.required()]"
      )
      f-input-text(
        ref="refInputEmail"
        v-model:textValue="formData.email"
        required
        :label="$t('OO0023')"
        :rules="[$inputRules.required(), $inputRules.email()]"
      )
      input-calling-code(
        v-model:textValue="formData.phone"
        v-model:countryCode="formData.phoneCountryCode"
        :label="$t('OO0111')"
        :placeholder="$t('OO0053')"
      )
      f-input-textarea(
        class="row-span-3"
        v-model:textValue="formData.description"
        :label="$t('OO0112')"
        minHeight="min-h-60"
      )
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()

const refInputEmail = ref(null)
const orgUser = computed(() => store.getters['organization/orgUser/orgUser'])
const formData = reactive({
  name: orgUser.value.displayName,
  email: orgUser.value.email,
  phone: '',
  phoneCountryCode: 'TW',
  description: '',
})
const availableToSend = computed(
  () => !!formData.name && !!formData.email && !refInputEmail.value?.isError
)

const submitSignupRequest = async () => {
  store.dispatch('helper/openModalLoading')
  store.dispatch('helper/closeModalLoading')
  await store.dispatch('user/generalSignUpRequest', formData)
  store.dispatch('helper/closeModalBehavior')
  notify.showNotifySnackbar({ messageText: t('AA0091') })
}
</script>
