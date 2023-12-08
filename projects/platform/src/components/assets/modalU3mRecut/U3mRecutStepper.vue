<template lang="pug">
div(class="relative overflow-hidden")
  span(class="absolute left-10 top-[33px] w-75 h-0.5 bg-grey-700") 
  span(
    v-if="isDoubleSideMaterial && faceSideUrl && currentSideName === U3M_CUT_SIDE.BACK_SIDE"
    class="absolute left-10 top-[33px] w-55 h-0.5 bg-primary-400"
  ) 
  div(class="flex flex-row items-center gap-[45px] text-grey-150 overflow-hidden")
    template(v-if="isDoubleSideMaterial")
      u3m-recut-step(
        :side="U3M_CUT_SIDE.FACE_SIDE"
        :step="1"
        :src="faceSideUrl"
        :state="doubleSideMaterialFaceStepState"
      )
      u3m-recut-step(
        :step="2"
        :side="U3M_CUT_SIDE.BACK_SIDE"
        :src="backSideUrl"
        :state="doubleSideMaterialBackStepState"
      )
    template(v-else)
      u3m-recut-step(
        :step="1"
        :side="currentSideName || U3M_CUT_SIDE.FACE_SIDE"
        :src="currentSideName === U3M_CUT_SIDE.FACE_SIDE ? faceSideUrl : backSideUrl"
        :state="U3M_CUT_SIDE_EDIT_STATE.CURRENT"
      )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import U3mRecutStep from '@/components/assets/modalU3mRecut/U3mRecutStep.vue'
import { U3M_CUT_SIDE, U3M_CUT_SIDE_EDIT_STATE } from '@/utils/constants'

const props = defineProps<{
  isDoubleSideMaterial: boolean
  currentSideName?: U3M_CUT_SIDE
  faceSideUrl: string | null | undefined
  backSideUrl: string | null | undefined
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
