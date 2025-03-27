<template lang="pug">
div(:class="[sizeStyle, typeStyle]" class="w-fit rounded-sm border gap-2 text-xs") 
  slot
</template>

<script lang="ts">
export default { name: 'FBadge' }
</script>

<script lang="ts" setup>
import { computed } from 'vue'

export interface Props {
  size?: 'small' | 'medium'
  type?: 'information' | 'critical' | 'warning' | 'success' | 'neutral'
}

const props = defineProps<Props>()

const sizeStyle = computed(() => {
  const mediumStyle = ['px-2 py-1']
  if (!props.size) {
    return mediumStyle
  }

  const mapper: Record<typeof props.size, string[]> = {
    medium: mediumStyle,
    small: ['px-1 py-0'],
  }

  return mapper[props.size]
})

const typeStyle = computed(() => {
  const neutralStyle = ['bg-grey-50 text-grey-800 border-grey-400']
  if (!props.type) {
    return neutralStyle
  }
  const mapper: Record<typeof props.type, string[]> = {
    information: ['bg-cyan-50 text-cyan-400 border-cyan-200'],
    critical: ['bg-red-0 text-red-400 border-red-200'],
    neutral: neutralStyle,
    success: ['bg-green-50 text-green-700 border-green-200'],
    warning: ['bg-yellow-50 text-yellow-500 border-yellow-200'],
  }

  return mapper[props.type]
})
</script>
