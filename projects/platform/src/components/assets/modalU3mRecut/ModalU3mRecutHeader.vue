<template lang="pug">
div(
  class="flex flex-row bg-grey-950-v1 px-8 py-5 justify-between align-middle border border-b-secondary-border"
)
  div(class="flex")
    f-button(
      type="secondary"
      @click="emit('close')"
      isIcon
      size="md"
      class="self-center"
    ) 
      f-svg-icon(iconName="clear" size="18")
  p(class="text-body1 font-bold pl-1.5 text-primary-inverse self-center") {{ $t('EE0069') }}
  div(class="flex flex-row gap-3")
    f-button(
      class="h-10"
      size="md"
      type="secondary"
      @click="emit('back')"
      v-if="readyToSubmit && isDoubleSideMaterial"
    ) {{ $t('UU0004') }}
    f-button(
      class="h-10"
      size="md"
      :disabled="!isValid"
      @click="readyToSubmit ? emit('confirm') : emit('next')"
    ) {{ $t(readyToSubmit ? 'UU0020' : 'EE0233') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { U3M_CUT_SIDE } from '@/utils/constants'

const props = defineProps<{
  isValid: boolean
  isDoubleSideMaterial: boolean
  currentSideName?: U3M_CUT_SIDE
  faceSideUrl?: string | null
  backSideUrl?: string | null
  isShowModalReplaceSides: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
  (e: 'confirm'): void
  (e: 'close'): void
  (e: 'update:replaceSides', value: boolean): void
}>()

const readyToSubmit = computed(() => {
  if (!props.isDoubleSideMaterial) {
    return true
  }
  if (props.currentSideName === U3M_CUT_SIDE.BACK_SIDE) {
    return true
  }
  if (!props.backSideUrl) {
    return true
  }
  return false
})
</script>

<style scoped></style>
