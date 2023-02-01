<template lang="pug">
div(class="flex flex-col items-center gap-y-1")
  div(
    class="w-5 h-5 flex items-center justify-center rounded-full text-caption font-bold"
    :class="circleStyles"
  )
    f-svg-icon(v-if="state === 'edited'" iconName="done" size="14")
    span(v-else) {{ step }}
  span(:class="textStyles") {{ text }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { U3M_CUT_SIDE_EDIT_STATE } from '@/utils/constants'

const props = defineProps<{
  step: number
  text: string
  state: U3M_CUT_SIDE_EDIT_STATE
}>()

const textStyles = computed(() => {
  const styles = ['text-body2']
  switch (props.state) {
    case U3M_CUT_SIDE_EDIT_STATE.EDITED:
      styles.push('text-grey-100')
      break
    case U3M_CUT_SIDE_EDIT_STATE.CURRENT:
      styles.push('text-primary-400')
      break
    case U3M_CUT_SIDE_EDIT_STATE.NEXT:
    case U3M_CUT_SIDE_EDIT_STATE.DISABLED:
      styles.push('text-grey-700')
      break
    default:
      throw new Error('invalid state')
  }
  return styles
})

const circleStyles = computed(() => {
  switch (props.state) {
    case U3M_CUT_SIDE_EDIT_STATE.EDITED:
    case U3M_CUT_SIDE_EDIT_STATE.CURRENT:
      return ['bg-primary-400', 'text-grey-100']
    case U3M_CUT_SIDE_EDIT_STATE.NEXT:
    case U3M_CUT_SIDE_EDIT_STATE.DISABLED:
      return ['bg-grey-700', 'text-grey-400']
    default:
      throw new Error('invalid state')
  }
})
</script>
