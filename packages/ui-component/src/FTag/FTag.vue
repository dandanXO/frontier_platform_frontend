<template lang="pug">
div(:class="classes")
  slot
  f-svg-icon(
    v-if="appendIcon && isActive"
    :iconName="appendIcon"
    :size="size === 'lg' ? '20' : '16'"
  )
</template>

<script lang="ts">
export default {
  name: 'FTag',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    appendIcon?: string
    isActive?: boolean
    clickable?: boolean
  }>(),
  {
    size: 'lg',
    isActive: false,
    clickable: true,
  }
)

const classes = computed(() => {
  const classList = [
    'w-fit',
    'whitespace-nowrap',
    'flex',
    'items-center',
    'rounded',
    'bg-secondary',
  ]
  props.clickable &&
    classList.push(
      'hover:bg-grey-150',
      'active:bg-grey-100',
      'active:cursor-pointer'
    )

  switch (props.size) {
    case 'sm':
      classList.push('h-6', 'px-2', 'gap-x-1.5', 'text-caption')
      break
    case 'md':
      classList.push('p-2', 'gap-x-1.5', 'text-sm')
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
