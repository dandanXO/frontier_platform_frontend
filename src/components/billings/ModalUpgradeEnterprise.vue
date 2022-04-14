<template lang="pug">
div(class="w-193.5 px-8 flex flex-col items-center")
  h6(class="font-bold text-h6 text-primary mb-3") {{$t('RR0161')}}
  p(class="w-84 text-body2 text-primary text-center line-height-1.6") {{$t('OO0043')}}
  p(class="text-caption text-black-600 self-end") *{{$t('RR0163')}}
  form(class="w-full h-66 grid grid-cols-2 grid-rows-3 grid-flow-col gap-7.5")
    input-text(
      ref="refInputRecipient"
      v-model:textValue="formData.name"
      required
      :label="$t('OO0016')"
    )
    input-text(
      ref="refInputEmail"
      v-model:textValue="formData.email"
      required
      :label="$t('OO0023')"
      :rules="[inputRules.email()]"
    )
    input-calling-code(
      v-model:textValue="formData.phone"
      v-model:countryCode="formData.phoneCountryCode"
      :label="$t('OO0111')"
      :placeholder="$t('OO0053')"
    )
    input-textarea(
      class="row-span-3"
      v-model:textValue="formData.description"
      :label="$t('OO0112')"
      height="240"
    )
  btn-group(
    class="h-25"
    :primaryText="$t('UU0049')"
    :primaryButtonDisabled="!availableToSend"
    @click:primary="requestUpgradeToEnterprise"
    :secondaryButton="false"
  )
</template>

<script>
import { computed, reactive, ref } from '@vue/reactivity'
import InputCallingCode from '@/components/InputCallingCode.vue'
import inputRules from '@/utils/input-rules.js'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalUpgradeEnterprise',
  components: {
    InputCallingCode
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()

    const refInputEmail = ref(null)
    const orgUser = computed(() => store.getters['user/orgUser/orgUser'])
    const formData = reactive({
      name: orgUser.value.displayName,
      email: orgUser.value.email,
      phone: '',
      phoneCountryCode: 'TW',
      description: ''
    })
    const availableToSend = computed(() => !!formData.name && !!formData.email && !refInputEmail.value?.isError)

    const requestUpgradeToEnterprise = async () => {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('organization/requestUpgradeToEnterprise', formData)
      store.dispatch('helper/closeModalLoading')

      store.commit('helper/PUSH_message', t('OO0113'))
    }

    return {
      formData,
      refInputEmail,
      availableToSend,
      requestUpgradeToEnterprise,
      inputRules
    }
  }
}
</script>
