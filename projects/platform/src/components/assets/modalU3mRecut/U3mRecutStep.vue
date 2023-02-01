<template lang="pug">
div(class="relative flex flex-row items-center gap-4.5")
  u3m-step-description(
    :step="step"
    :text="side === U3M_CUT_SIDE.FACE_SIDE ? $t('EE0147') : $t('EE0148')"
    :state="state"
  )
  sample-card-thumbnail(:src="src" :state="state" :side="side")
</template>

<script setup lang="ts">
import SampleCardThumbnail from '@/components/assets/modalU3mRecut/SampleCardThumbnail.vue'
import U3mStepDescription from '@/components/assets/modalU3mRecut/U3mStepDescription.vue'
import { U3M_CUT_SIDE, U3M_CUT_SIDE_EDIT_STATE } from '@/utils/constants'

defineProps<{
  step: number
  side: U3M_CUT_SIDE
  src: string | false
  state: U3M_CUT_SIDE_EDIT_STATE
}>()
</script>

<style scoped></style>
