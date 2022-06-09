<template lang="pug">
modal-behavior(
  :header="$t('OO0013')"
  :primaryBtnText="$t('UU0018')"
  :primaryBtnDisabled="!availableToSave"
  @click:primary="innerActionHandler"
)
  div(class="w-180.5")
    p(class="text-caption text-black-600 text-right mb-1") *{{ $t('RR0163') }}
    form(class="grid grid-cols-2 grid-rows-3 gap-7.5 pb-4")
      input-text(
        ref="refInputRecipient"
        v-model:textValue="formData.recipient"
        required
        :label="$t('OO0022')"
      )
      input-text(
        v-model:textValue="formData.zipCode"
        :label="$t('OO0025')"
        :placeholder="$t('OO0028')"
      )
      input-text(
        ref="refInputEmail"
        v-model:textValue="formData.email"
        required
        :rules="[inputRules.email()]"
        :label="$t('OO0023')"
      )
      input-text(
        v-model:textValue="formData.city"
        :label="$t('OO0026')"
        :placeholder="$t('OO0029')"
      )
      input-select(
        v-model:selectValue="formData.countryCode"
        class="relative z-10"
        :options="countryList"
        :label="$t('OO0024')"
        keyOptionDisplay="name"
        keyOptionValue="countryCode"
        searchBox
        required
      )
      input-text(
        v-model:textValue="formData.address"
        :label="$t('OO0027')"
        :placeholder="$t('OO0030')"
      )
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import inputRules from '@/utils/input-rules.js'

const props = defineProps({
  billingInfo: {
    type: Object,
    required: true
  },
  actionHandler: {
    type: Function,
    required: true
  }
})

const store = useStore()

const formData = reactive({ ...props.billingInfo })
const refInputRecipient = ref(null)
const refInputEmail = ref(null)
const countryList = computed(() => store.getters['code/countryList'])
const availableToSave = computed(() => !!formData.email && !refInputEmail.value?.isError && !!formData.recipient && !refInputRecipient?.value?.isError)

const innerActionHandler = () => {
  props.actionHandler({ ...formData })
}
</script>
