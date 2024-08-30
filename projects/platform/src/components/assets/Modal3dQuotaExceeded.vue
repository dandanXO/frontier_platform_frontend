<template lang="pug">
div(
  class="w-22 h-22 rounded-full p-7 bg-green-50 flex items-center justify-center self-center"
)
  f-svg-icon(iconName="home_storage_full" size="36" class="text-green-700 self-center")

div(class="flex flex-col gap-4")
  div
  div(class="text-center flex gap-2 flex-col")
    p(class="font-bold text-xl text-grey-900") {{ $t('RW0001') }}
    p(class="text-sm text-grey-850") {{ $t('RW0002') }}

div(class="flex flex-row items-center justify-center")
  f-button(size="md" :onclick="openModalSendFeedback") {{ $t('RW0003') }}
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
    properties: {
      title: t('RW0003'),
    },
  })
}
</script>
