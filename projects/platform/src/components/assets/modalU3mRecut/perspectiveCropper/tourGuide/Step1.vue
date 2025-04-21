<template lang="pug">
div(
  ref="step1Ref"
  class="fixed top-0 left-0 w-screen h-screen bg-grey-900/40 z-100 flex items-center justify-center"
)
  div(
    class="w-120 h-42 bg-grey-0 rounded-lg relative flex overflow-hidden absolute -top-[150px]"
  )
    div(class="flex-grow p-4")
      div(class="flex flex-col")
        h3(class="text-sm text-grey-900 font-bold") {{ $t('EE0206') }}
        p(class="text-sm text-grey-900") {{ $t('EE0207') }}
    div(
      class="bg-forestgreen-50 rounded-md p-2 flex flex-row gap-2 items-start justify-center absolute bottom-6 left-4"
    )
      div(class="rounded-full w-2 h-2 relative bg-forestgreen-700")
      div(class="rounded-full w-2 h-2 relative bg-forestgreen-100")
    f-button(
      class="absolute bottom-4 right-29"
      type="secondary"
      size="md"
      data-cy="btn-skip"
      @click="closeModal"
    ) {{ $t('UU0155') }}
    f-button(
      class="absolute bottom-4 right-5"
      type="primary"
      size="md"
      @click="openStep2Modal"
    ) {{ $t('UU0021') }}
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const store = useStore()
const { t } = useI18n()

const step1Ref = ref<HTMLElement>()
const closeModal = () => {
  store.dispatch('helper/closeModal')
}
const openStep2Modal = () => {
  store.dispatch('helper/closeModal')
  store.dispatch(
    'helper/pushModal',
    { component: 'perspective-cropper-tour-step-2', closable: false },
    { root: true }
  )
}
</script>
