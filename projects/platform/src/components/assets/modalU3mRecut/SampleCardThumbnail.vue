<template lang="pug">
div(class="rounded box-border bg-grey-900" :class="borderStyles")
  img(v-if="!!src" :src="src" class="w-19.5 h-19.5 rounded-0.5 object-cover")
  div(
    v-else
    class="w-19.5 h-19.5 flex flex-col items-center justify-center gap-y-[3px] text-grey-700"
  )
    f-svg-icon(
      :iconName="side === U3M_CUT_SIDE.FACE_SIDE ? 'no_image_front' : 'no_image_back'"
      size="30"
    ) No image
    span(class="text-caption") No image
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { U3M_CUT_SIDE, U3M_CUT_SIDE_EDIT_STATE } from '@/utils/constants'

const props = defineProps<{
  src: string | false
  side: U3M_CUT_SIDE
  state: U3M_CUT_SIDE_EDIT_STATE
}>()

const borderStyles = computed(() => {
  switch (props.state) {
    case U3M_CUT_SIDE_EDIT_STATE.EDITED:
      return ['border-2', 'border-primary-400']
    case U3M_CUT_SIDE_EDIT_STATE.CURRENT:
      return ['border-4', 'border-primary-400']
    case U3M_CUT_SIDE_EDIT_STATE.NEXT:
    case U3M_CUT_SIDE_EDIT_STATE.DISABLED:
      return ['border-2', 'border-grey-700']
    default:
      throw new Error('invalid state')
  }
})
</script>
