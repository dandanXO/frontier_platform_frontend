<template lang="pug">
div(class="flex items-center justify-between shrink-0 w-full h-27.5 bg-grey-900 px-10")
  div(class="flex items-center text-grey-100")
    f-svg-icon(iconName="transform" size="24")
    p(class="text-body1 font-bold pl-1.5") {{ $t('EE0069') }}
  div(class="flex flex-row items-center gap-10")
    u3m-recut-stepper(
      :faceSideUrl="faceSideUrl"
      :backSideUrl="backSideUrl"
      :isDoubleSideMaterial="isDoubleSideMaterial"
      :currentSideName="currentSideName"
    )
    div(class="flex justify-center items-center")
      div(class="grid grid-cols-2 gap-x-2.5")
        f-button(theme="dark" size="md" type="secondary" @click="emit('back')") {{ $t('UU0004') }}
        f-button(
          theme="dark"
          size="md"
          :prependIcon="readyToSubmit ? 'done' : ''"
          @click="readyToSubmit ? emit('confirm') : emit('next')"
        ) {{ readyToSubmit ? $t('UU0020') : $t('UU0021') }}
  div
    f-button(theme="dark" type="secondary" size="md" @click="emit('close')") {{ $t('UU0112') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import U3mRecutStepper from '@/components/assets/modalU3mRecut/U3mRecutStepper.vue'
import { U3M_CUT_SIDE } from '@/utils/constants'

const props = defineProps<{
  isDoubleSideMaterial: boolean
  currentSideName?: U3M_CUT_SIDE
  faceSideUrl: string | false
  backSideUrl: string | false
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const readyToSubmit = computed(() => {
  if (!props.isDoubleSideMaterial) {
    return true
  }
  if (props.currentSideName === U3M_CUT_SIDE.BACK_SIDE) {
    return true
  }
  if (!props.backSideUrl) return true
  return false
})
</script>

<style scoped></style>
