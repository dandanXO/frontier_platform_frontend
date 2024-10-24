<template lang="pug">
transition
  div(
    v-show="showNotif"
    class="absolute top-5 left-1/2 -translate-x-1/2 margin-auto z-popper"
  )
    div(
      class="w-128 rounded-lg p-3 flex flex-row items-center gap-3 text-primary-inverse"
      :class="contentContainerClass[status]"
    )
      div(class="p-2 rounded-full" :class="iconContainerClass[status]")
        f-svg-icon(:iconName="iconName[status]" size="24")
      div(class="flex flex-col gap-2 flex-1")
        p(class="font-bold text-base") {{ title }}
        p(class="text-sm" v-if="description") {{ description }}
      div(
        class="self-start cursor-pointer"
        :onClick="onClose"
        v-if="status === STATUS.FAILED"
      )
        f-svg-icon(iconName="close" size="24")
</template>

<script lang="ts">
const STATUS = {
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
} as const
export { STATUS }
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  status: (typeof STATUS)[keyof typeof STATUS]
  show: boolean
  title: string
  description?: string
}

const props = defineProps<Props>()

const showNotif = ref(props.show)

watch(
  () => props.show,
  (show) => {
    showNotif.value = show
  }
)
const iconName = computed(() => ({
  [STATUS.FAILED]: 'cancel_outline',
  [STATUS.SUCCESS]: 'check_circle_outline',
}))

const iconContainerClass = computed(() => ({
  [STATUS.FAILED]: ['bg-critical-hover text-red-200-v1'],
  [STATUS.SUCCESS]: ['bg-brand-hover text-green-200-v1'],
}))

const onClose = () => {
  showNotif.value = false
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
