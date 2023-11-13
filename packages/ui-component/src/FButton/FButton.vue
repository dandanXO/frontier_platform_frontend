<template lang="pug">
button(
  class="rounded font-normal flex gap-x-1 items-center justify-center whitespace-nowrap"
  :class="[btnSize, btnType]"
  :disabled="disabled"
)
  f-svg-icon(v-if="prependIcon !== ''" :iconName="prependIcon")
  slot
</template>

<script lang="ts">
export default { name: 'FButton' }
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { THEME, SIZE } from '../constants'

const props = withDefaults(
  defineProps<{
    theme?: `${THEME}`
    size?: `${SIZE}` | 'special'
    type?: 'primary' | 'secondary' | 'text' | 'special'
    prependIcon?: string
    disabled?: boolean
  }>(),
  {
    theme: THEME.LIGHT,
    size: 'special',
    type: 'primary',
    prependIcon: '',
    disabled: false,
  }
)

const btnSize = computed(() => {
  switch (props.size) {
    case 'lg':
      return [
        'text-body1',
        'min-w-21.5',
        'h-11',
        props.prependIcon === '' ? 'px-6' : 'px-3',
      ]
    case 'md':
      return [
        'text-body1',
        'min-w-21',
        'h-10',
        props.prependIcon === '' ? 'px-4' : 'px-3',
      ]
    case 'sm':
      return [
        'text-body2',
        'min-w-14',
        'h-8.5',
        props.prependIcon === '' ? 'px-3.5' : 'px-3',
      ]
    default:
      return []
  }
})

const btnType = computed(() => {
  if (props.theme === THEME.LIGHT) {
    switch (props.type) {
      case 'primary':
        return [
          'bg-primary-400',
          'text-grey-0',
          'hover:bg-primary-500',
          'disabled:bg-grey-150',
        ]
      case 'secondary':
        return [
          'bg-grey-0',
          'text-primary-400',
          'border',
          'border-grey-150',
          'hover:text-primary-500',
          'disabled:text-grey-250',
        ]
      case 'text':
        return [
          'bg-grey-0',
          'text-grey-900',
          'hover:text-primary-500',
          'disabled:text-grey-250',
        ]
      default:
        return []
    }
  } else if (props.theme === THEME.DARK) {
    switch (props.type) {
      case 'primary':
        return [
          'bg-primary-400',
          'text-grey-0',
          'disabled:bg-grey-700',
          'disabled:text-grey-900',
          'hover:bg-primary-500',
        ]
      case 'secondary':
        return [
          'bg-transparent',
          'text-primary-400',
          'border',
          'border-grey-700',
          'hover:text-primary-500',
          'hover:border-grey-600',
          'disabled:text-grey-600',
        ]
      case 'text':
        return [
          'bg-transparent',
          'text-grey-250',
          'hover:text-primary-500',
          'disabled:text-grey-500',
        ]
      default:
        return []
    }
  } else {
    throw new Error('invalid theme, only accept "light" or "dark"')
  }
})
</script>
