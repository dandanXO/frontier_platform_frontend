<template lang="pug">
div(class="flex flex-col shrink-0 w-full bg-grey-900 px-10 pt-2 pb-2")
  div(class="flex items-center justify-between")
    div(class="flex items-center text-grey-100")
      f-svg-icon(iconName="transform" size="24")
      p(class="text-body1 font-bold pl-1.5") {{ $t('EE0069') }}
    div(class="flex flex-row items-center gap-10 pt-4")
      u3m-recut-stepper(
        :faceSideUrl="faceSideUrl"
        :backSideUrl="backSideUrl"
        :isDoubleSideMaterial="isDoubleSideMaterial"
        :currentSideName="currentSideName"
      )
      div(class="flex justify-center items-center")
        div(class="grid grid-cols-2 gap-x-2.5")
          f-button(
            :theme="THEME.DARK"
            size="md"
            type="secondary"
            data-cy="btn-back"
            @click="emit('back')"
          ) {{ $t('UU0004') }}
          f-button(
            :theme="THEME.DARK"
            size="md"
            :disabled="!isValid"
            data-cy="btn-create"
            :prependIcon="readyToSubmit ? 'done' : ''"
            @click="readyToSubmit ? emit('confirm') : emit('next')"
          ) {{ readyToSubmit ? $t('UU0020') : $t('UU0021') }}
    div(class="pt-4")
      f-button(
        :theme="THEME.DARK"
        type="secondary"
        size="md"
        data-cy="btn-exit"
        @click="emit('close')"
      ) {{ $t('UU0112') }}
  div(class="flex flex-row gap-1 pt-1 justify-end pr-1")
    p(class="text-sm text-white") {{ $t('WW0179') }}
    f-input-toggle(
      :value="isShowModalReplaceSides"
      @update:value="emit('update:replaceSides', $event)"
    )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import U3mRecutStepper from '@/components/assets/modalU3mRecut/U3mRecutStepper.vue'
import { U3M_CUT_SIDE, THEME } from '@/utils/constants'

const props = defineProps<{
  isValid: boolean
  isDoubleSideMaterial: boolean
  currentSideName?: U3M_CUT_SIDE
  faceSideUrl: string | null | undefined
  backSideUrl: string | null | undefined
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
