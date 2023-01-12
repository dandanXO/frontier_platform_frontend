<template lang="pug">
div(:class="classes")
  slot
  f-svg-icon(
    v-if="appendIcon && isActive"
    :iconName="appendIcon"
    :size="size === 'lg' ? '20' : '16'"
  )
</template>

<script>
export default {
  name: 'FTag',
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'lg',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
})

const classes = computed(() => {
  const classList = [
    'w-fit',
    'whitespace-nowrap',
    'flex',
    'items-center',
    'rounded',
    'bg-grey-100',
    'hover:bg-grey-150',
    'active:bg-grey-100',
    'active:cursor-pointer',
  ]

  switch (props.size) {
    case 'sm':
      classList.push('h-6', 'px-2', 'gap-x-1.5', 'text-caption')
      break
    case 'lg':
      classList.push('h-8.5', 'px-3', 'gap-x-2.5', 'text-body2')
      break
  }

  if (props.isActive) {
    classList.push('text-primary-500', 'bg-grey-100')
  }

  return classList
})
</script>
