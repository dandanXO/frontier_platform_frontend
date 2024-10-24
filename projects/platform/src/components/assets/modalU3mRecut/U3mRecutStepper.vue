<template lang="pug">
div(class="relative overflow-hidden")
  div(class="flex flex-row flex-1 items-center gap-2 text-grey-150 overflow-hidden")
    u3m-recut-step(
      :side="U3M_CUT_SIDE.FACE_SIDE"
      :step="1"
      :src="faceSideUrl"
      :state="doubleSideMaterialFaceStepState"
    )
    div(class="border border-disabled flex-1")
    u3m-recut-step(
      :step="2"
      :side="U3M_CUT_SIDE.BACK_SIDE"
      :src="backSideUrl"
      :state="doubleSideMaterialBackStepState"
    )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import U3mRecutStep from '@/components/assets/modalU3mRecut/U3mRecutStep.vue'
import { U3M_CUT_SIDE, U3M_CUT_SIDE_EDIT_STATE } from '@/utils/constants'

const props = defineProps<{
  currentSideName?: U3M_CUT_SIDE
  faceSideUrl?: string
  backSideUrl?: string
}>()

const doubleSideMaterialFaceStepState = computed(() => {
  if (props.currentSideName === U3M_CUT_SIDE.FACE_SIDE) {
    return U3M_CUT_SIDE_EDIT_STATE.CURRENT
  }
  if (props.faceSideUrl) {
    return U3M_CUT_SIDE_EDIT_STATE.EDITED
  }
  return U3M_CUT_SIDE_EDIT_STATE.DISABLED
})

const doubleSideMaterialBackStepState = computed(() => {
  if (props.currentSideName === U3M_CUT_SIDE.BACK_SIDE) {
    return U3M_CUT_SIDE_EDIT_STATE.CURRENT
  }
  if (props.backSideUrl) {
    return U3M_CUT_SIDE_EDIT_STATE.NEXT
  }
  return U3M_CUT_SIDE_EDIT_STATE.DISABLED
})
</script>

<style scoped></style>
