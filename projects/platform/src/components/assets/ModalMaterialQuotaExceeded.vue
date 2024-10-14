<template lang="pug">
div(
  class="w-22 h-22 rounded-full p-7 bg-green-50 flex items-center justify-center self-center"
)
  f-svg-icon(iconName="home_storage_full" size="36" class="text-green-700 self-center")

div(class="flex flex-col gap-4")
  div
  div(class="text-center flex gap-2 flex-col")
    p(class="font-bold text-xl text-grey-900") {{ $t('RW0004') }}
    p(class="text-sm text-grey-850") {{ $t('RW0005', { quota: materialQuota.max - materialQuota.used, maxQuota: materialQuota.max }) }}

div(class="flex flex-row items-center justify-center")
  f-button(size="md" :onclick="openModalSendFeedback") {{ $t('UU0078') }}
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import type { Plan } from '@frontier/platform-web-sdk'
import { useConstants } from '@/utils/constants'

const store = useStore()
const { FEEDBACK_CATEGORY } = useConstants()
const plan = computed<Plan>(() => store.getters['polling/plan'])
const materialQuota = computed(() => plan.value.quota.material)
const { t } = useI18n()

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
    properties: {
      title: t('UU0078'),
      category: FEEDBACK_CATEGORY.value.PAYMENT.value,
    },
  })
}
</script>
