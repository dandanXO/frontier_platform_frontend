<template lang="pug">
div(
  class="fixed inset-0 z-modal w-screen h-screen bg-grey-900/40 flex justify-center items-center"
  :data-theme="theme"
) 
  div(class="absolute inset-0" @click="closable && onClose()")
  div(
    class="relative flex flex-col bg-primary rounded-xl shadow-32 gap-6"
    :class="[classModal, noPadding ? '' : 'p-6']"
  )
    div(
      v-if="usingHeader"
      class="flex flex-row justify-between gap-2 pb-6"
      :class="title ? 'border-b border-primary-border' : ''"
    )
      p(class="text-h5 font-bold text-primary-inverse") {{ title }}
      f-svg-icon(
        v-if="closable"
        iconName="clear"
        size="24"
        class="justify-self-end cursor-pointer text-primary-inverse"
        @click="onClose"
      )
    component(:is="body" v-bind="properties")
    transition
      f-alert(
        v-if="isShowAlert"
        v-bind="alertProps"
        class="absolute left-0 right-0 top-full mt-4"
        @mouseenter="clearTimer"
        @mouseleave="setTimer"
      )
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

import useModalCommon from '@/composables/useModalCommon'
const store = useStore()
const { title, closable, withCloseButton } = defineProps({
  body: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  withCloseButton: {
    type: Boolean,
    default: true,
  },
  classModal: {
    type: String,
    default: '',
  },
  properties: {
    type: Object,
  },
  theme: {
    type: String,
    default: '',
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
})

const { isShowAlert, alertProps, closeAlert } = useModalCommon()
const DELAY = 3000
type Timeout = ReturnType<typeof setTimeout>
const timer = ref<Timeout>()
const clearTimer = () => {
  clearTimeout(timer.value)
}
const setTimer = () => {
  clearTimer()
  timer.value = setTimeout(closeAlert, DELAY)
}

const onClose = () => {
  store.dispatch('helper/closeModal')
  closeAlert()
}

watch(isShowAlert, (newVal) => {
  if (newVal) {
    setTimer()
  }
})

const usingHeader = !!title || withCloseButton
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease-in;
}

.v-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.v-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
</style>
