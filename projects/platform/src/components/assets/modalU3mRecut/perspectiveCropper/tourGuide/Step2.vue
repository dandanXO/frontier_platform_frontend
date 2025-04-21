<template lang="pug">
div(
  ref="step2Ref"
  class="fixed -top-3.5 left-0 w-screen h-screen bg-grey-900/40 z-100 flex items-center justify-center"
)
  div(
    class="w-120 h-60 bg-grey-0 rounded-lg relative flex overflow-hidden absolute -top-[100px]"
  )
    div(class="flex-grow p-4")
      div(class="flex flex-col")
        h3(class="text-sm text-grey-900 font-bold") {{ $t('EE0206') }}
        div(class="text-sm font-normal")
          ul(class="list-disc list-outside ml-6")
            li
              sapn(class="font-bold") {{ $t('EE0208') }}:&ensp;
              span {{ $t('EE0209') }}
            li
              span(class="font-bold") {{ $t('EE0210') }}:&ensp;
              span {{ $t('EE0211') }}
    div(
      class="bg-forestgreen-50 rounded-md p-2 flex flex-row gap-2 items-start justify-center absolute bottom-6 left-4"
    )
      div(class="rounded-full w-2 h-2 relative bg-forestgreen-100")
      div(class="rounded-full w-2 h-2 relative bg-forestgreen-700")
    f-button(
      class="absolute bottom-4 right-29"
      type="secondary"
      size="md"
      @click="backStep2"
    ) {{ $t('UU0004') }}
    f-button(
      class="absolute bottom-4 right-5"
      type="primary"
      size="md"
      @click="closeModal"
    ) {{ $t('UU0094') }}
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const store = useStore()
const { t } = useI18n()

const step2Ref = ref<HTMLElement>()
const closeModal = () => {
  store.dispatch('helper/closeModal')
}
const backStep2 = () => {
  store.dispatch('helper/closeModal')
  store.dispatch(
    'helper/pushModal',
    { component: 'perspective-cropper-tour-step-1', closable: false },
    { root: true }
  )
}
</script>
