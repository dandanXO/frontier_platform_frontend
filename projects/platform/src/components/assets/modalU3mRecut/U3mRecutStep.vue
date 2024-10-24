<template lang="pug">
div(class="relative flex flex-row items-center gap-2 flex-1 justify-center")
  div(
    class="w-6 h-6 flex items-center justify-center rounded-full text-sm p-1"
    :class="circleStyles"
  )
    span {{ step }}
  span(:class="textStyles") {{ side === U3M_CUT_SIDE.FACE_SIDE ? $t('EE0231') : $t('EE0232') }}
</template>

<script setup lang="ts">
import { U3M_CUT_SIDE, U3M_CUT_SIDE_EDIT_STATE } from '@/utils/constants'
import { computed } from 'vue'

const props = defineProps<{
  step: number
  side: U3M_CUT_SIDE
  src?: string
  state: U3M_CUT_SIDE_EDIT_STATE
}>()

const textStyles = computed(() => {
  const styles = ['text-sm']
  switch (props.state) {
    case U3M_CUT_SIDE_EDIT_STATE.EDITED:
      styles.push('text-grey-100')
      break
    case U3M_CUT_SIDE_EDIT_STATE.CURRENT:
      styles.push('text-primary-inverse')
      break
    case U3M_CUT_SIDE_EDIT_STATE.NEXT:
      styles.push('text-disabled')
      break

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
      return ['bg-disabled', 'text-primary-inverse']

    case U3M_CUT_SIDE_EDIT_STATE.DISABLED:
      return ['bg-grey-700', 'text-grey-400']
    default:
      throw new Error('invalid state')
  }
})
</script>

<style scoped></style>
