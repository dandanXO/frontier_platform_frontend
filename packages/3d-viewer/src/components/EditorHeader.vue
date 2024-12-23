<template lang="pug">
div(
  class="w-screen h-20 shrink-0 border-b border-primary-border bg-primary flex items-center justify-between desktop:px-10 px-4"
)
  div(class="flex")
    f-button(
      v-if="showCloseButton"
      type="secondary"
      @click="emit('close')"
      isIcon
      size="md"
      class="self-center"
    ) 
      f-svg-icon(iconName="clear" size="18")
  div(class="flex flex-row gap-x-5")
    div(class="relative min-w-0 items-center")
      div(class="text-primary-inverse flex items-center justify-center gap-x-2 shrink-0")
        f-svg-icon(iconName="3D_viewer" size="24")
        p(class="text-body1 font-bold") {{ $t('EE0029') }}
  f-button(
    :size="SIZE.SM"
    prependIcon="camera"
    type="secondary"
    @click="emit('screenshot')"
  ) {{ $t('UU0125') }}
</template>

<script setup lang="ts">
import { SIZE } from '@frontier/lib'

defineProps<{
  showCloseButton: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'screenshot'): void
}>()
</script>
