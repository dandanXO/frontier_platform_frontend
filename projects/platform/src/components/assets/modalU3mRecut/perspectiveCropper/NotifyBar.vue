<template lang="pug">
transition
  div(v-show="show" class="absolute top-5 left-1/2 -translate-x-1/2 margin-auto z-popper")
    div(
      class="w-128 rounded-lg p-3 flex flex-row items-center gap-3 text-primary-inverse"
      :class="contentContainerClass[status]"
    )
      div(class="p-2 rounded-full" :class="iconContainerClass[status]")
        f-svg-icon(:iconName="iconName[status]" size="24")
      div(class="flex flex-col gap-2 flex-1")
        p(class="font-bold text-base" v-if="title") {{ title }}
        p(class="text-sm" v-if="description") {{ description }}
      div(class="self-start cursor-pointer" :onClick="onClose" v-if="showBtnClose")
        f-svg-icon(iconName="close" size="24")
</template>

<script lang="ts">
export enum STATUS {
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: STATUS
  show: boolean
  title?: string
  description?: string
  showBtnClose?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'onNotifChange', v: boolean): void
}>()

const iconName = computed(() => ({
  [STATUS.FAILED]: 'cancel_outline',
  [STATUS.SUCCESS]: 'check_circle_outline',
}))

const iconContainerClass = computed(() => ({
  [STATUS.FAILED]: ['bg-critical-hover text-red-200-v1'],
  [STATUS.SUCCESS]: ['bg-brand-hover text-green-200-v1'],
}))

const onClose = () => {
  emit('onNotifChange', false)
}

const contentContainerClass = computed(() => ({
  [STATUS.FAILED]: ['bg-critical'],
  [STATUS.SUCCESS]: ['bg-brand'],
}))
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease-in;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
