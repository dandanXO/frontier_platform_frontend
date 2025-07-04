<template lang="pug">
button(
  :class="buttonClasses"
  :disabled="disabled"
  @click="!disabled && $emit('click', $event)"
)
  div(class="flex items-center justify-center")
    f-svg-icon(
      v-if="prependIcon"
      :iconName="prependIcon"
      :class="textClasses"
      class="w-4 h-4"
    )
    span(:class="[textClasses, { 'ml-2': prependIcon }]")
      slot
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FSvgIcon } from '@frontier/ui-component'

type BtnType = 'primary' | 'secondary' | 'text' | 'special' | 'critical-outline'

const props = defineProps<{
  type?: BtnType
  disabled?: boolean
  prependIcon?: string
}>()

defineEmits(['click'])

const buttonClasses = computed(() => {
  const baseClasses =
    'w-full h-8 border rounded py-1 px-3 flex items-center justify-center'

  if (props.disabled) {
    return [baseClasses, 'border-grey-400-v1 cursor-not-allowed bg-white']
  }

  if (props.type === 'secondary') {
    return [baseClasses, 'border-green-200-v1 bg-white']
  }

  // Primary (default)
  return [
    baseClasses,
    'bg-green-500-v1 border-green-500-v1 focus:shadow-[0px_0px_0px_2px_#8ADDF4]',
  ]
})

const textClasses = computed(() => {
  const baseClasses = 'text-center text-sm font-bold'

  if (props.disabled) {
    return [baseClasses, 'text-grey-400-v1']
  }

  if (props.type === 'secondary') {
    return [baseClasses, 'text-green-500-v1']
  }

  // Primary (default)
  return [baseClasses, 'text-white']
})
</script>
