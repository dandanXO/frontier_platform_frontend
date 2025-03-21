<template lang="pug">
div(
  class="fixed inset-0 z-modal w-screen h-screen bg-grey-900/40 flex justify-center items-center"
  :data-theme="theme"
) 
  div(class="w-screen h-screen" @click="closable && onClose()")
  div(
    class="absolute flex flex-col bg-primary rounded-xl shadow-32 gap-6"
    :class="[classModal, noPadding ? '' : 'p-6']"
  )
    div(
      v-if="usingHeader"
      class="flex flex-row justify-between gap-2 pb-6"
      :class="title ? 'border-b border-grey-250' : ''"
    )
      p(class="text-h5 font-bold text-grey-900") {{ title }}
      f-svg-icon(
        v-if="closable"
        iconName="clear"
        size="24"
        class="justify-self-end cursor-pointer text-grey-900"
        @click="onClose"
      )
    component(:is="body" v-bind="properties")
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
const store = useStore()
const { title, closable } = defineProps({
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

const onClose = () => {
  store.dispatch('helper/closeModal')
}

const usingHeader = !!title || closable
</script>
