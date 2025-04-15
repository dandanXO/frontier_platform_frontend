<template lang="pug">
div(
  v-if="isShowModal"
  class="fixed inset-0 z-loading w-screen h-screen bg-grey-900/70 flex justify-center items-center"
)
  div(
    class="flex flex-col items-center justify-center w-[512px] p-6 gap-6 rounded-xl bg-grey-0 shadow-32"
  )
    div(class="flex justify-between w-full pb-6 border-b border-grey-200")
      p(class="text-xl font-bold") {{ title }}
      f-button(@click="closeModal" type="text")
        f-svg-icon(iconName="close_medium" size="24" class="text-grey-900")
    div(class="flex flex-col items-center space-y-6")
      f-svg-icon(v-if="icon" :iconName="icon" size="88")
      p(class="text-sm text-center") {{ description }}
      div(class="w-full flex gap-3")
        f-button(
          class="flex-1 p-2 text-sm !font-bold !border-green-200-v1 text-green-500-v1"
          type="secondary"
          @click="onClickSecondary"
          :disabled="isLoading"
        ) {{ secondaryButtonText }}
        f-button(
          class="flex-1 p-2 text-sm !font-bold transition-all"
          :class="type === 'danger' ? 'bg-red-500-v1 hover:bg-red-500-v1 hover:brightness-110 disabled:hover:brightness-100' : 'bg-green-500-v1 hover:bg-green-500-v1 hover:brightness-110 disabled:hover:brightness-100'"
          @click="onClickPrimary"
          :disabled="isLoading"
        ) {{ primaryButtonText }}
</template>

<script lang="ts" setup>
defineProps({
  isShowModal: Boolean,
  closeModal: Function,
  primaryButtonText: String,
  secondaryButtonText: String,
  onClickPrimary: Function,
  onClickSecondary: Function,
  title: String,
  description: String,
  icon: String,
  type: String,
  isLoading: Boolean,
})
</script>

<style></style>
