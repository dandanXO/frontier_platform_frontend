<template lang="pug">
div(
  class="w-screen h-20 shrink-0 border-b border-primary-border bg-primary flex items-center justify-between desktop:px-10 px-4"
)
  div(class="flex flex-1")
    f-button(
      v-if="showCloseButton"
      type="secondary"
      @click="emit('close')"
      isIcon
      size="md"
      class="self-center"
    ) 
      f-svg-icon(iconName="clear" size="18")
  div(class="flex flex-row gap-x-5 flex-1 justify-center")
    div(class="relative min-w-0 items-center")
      div(class="text-primary-inverse flex items-center justify-center gap-x-2 shrink-0")
        f-svg-icon(v-if="isDesktop" iconName="3D_viewer" size="24")
        p(class="text-body1 font-bold") {{ $t('EE0029') }}
  div(class="flex flex-1 justify-end")
    f-button(
      v-if="displayMode === DISPLAY_MODE.MODEL"
      :size="isDesktop ? SIZE.SM : SIZE.MD"
      :prependIcon="isDesktop ? 'camera' : ''"
      type="secondary"
      :isIcon="!isDesktop"
      @click="emit('screenshot')"
      class="self-center"
    ) {{ isDesktop ? $t('UU0125') : undefined }}
      f-svg-icon(v-if="!isDesktop" iconName="camera" size="18")
</template>

<script setup lang="ts">
import { DISPLAY_MODE } from '../constants'
import { SIZE, useBreakpoints } from '@frontier/lib'

defineProps<{
  showCloseButton: boolean
  displayMode: DISPLAY_MODE
}>()

const { isDesktop } = useBreakpoints()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'screenshot'): void
}>()
</script>
