<template lang="pug">
div(
  class="flex justify-center items-center rounded select-none gap-1"
  :class="[backgroundStyle, borderStyle, textStyle, mapperSizeStyle[size], disabled ? '' : 'cursor-pointer']"
  :data-theme="theme"
)
  slot
</template>

<script lang="ts">
export default {
  name: 'FPill',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SIZE } from '../constants'

const props = withDefaults(
  defineProps<{
    size?: SIZE
    active?: boolean
    disabled?: boolean
    theme?: 'new' | 'startrust' | 'new-dark'
  }>(),
  {
    size: SIZE.MD,
  }
)

const backgroundStyle = computed(() => {
  if (!props.active) {
    return `bg-primary ${props.disabled ? '' : 'hover:bg-primary-hover'}`
  }

  return props.disabled
    ? 'bg-disabled'
    : 'bg-brand-solid hover:bg-brand-solid-hover'
})

const borderStyle = computed(() => {
  const { active, disabled } = props
  const arrStyles = ['focus:shadow-info']

  if (active) {
    return arrStyles
  }

  arrStyles.push('border')
  arrStyles.push(
    disabled
      ? 'border-disabled text-disabled'
      : 'border-primary-border  text-primary-inverse'
  )

  return arrStyles.join(' ')
})

const textStyle = computed(() => {
  const { active, disabled } = props

  if (active) {
    return 'text-white'
  }

  return disabled ? 'text-disabled' : 'text-primary-inverse'
})

const mapperSizeStyle: Record<SIZE, string> = {
  [SIZE.LG]: 'p-3 text-base',
  [SIZE.MD]: 'p-2 text-sm',
  [SIZE.SM]: 'py-1 px-2 text-xs',
}
</script>
