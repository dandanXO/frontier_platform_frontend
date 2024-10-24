<template lang="pug">
button(
  class="rounded font-normal flex gap-x-1 items-center justify-center whitespace-nowrap"
  :class="[btnSize, btnType, isFullWidth]"
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
    type?: 'primary' | 'secondary' | 'text' | 'special' | 'critical-outline'
    isIcon?: boolean
    prependIcon?: string
    disabled?: boolean
    parentIsFlex?: boolean
    isFullWidth?: boolean
  }>(),
  {
    theme: THEME.LIGHT,
    size: 'special',
    type: 'primary',
    prependIcon: '',
    disabled: false,
    parentIsFlex: false,
    isFullWidth: false,
  }
)

const btnSize = computed(() => {
  switch (props.size) {
    case 'lg':
      return props.isIcon
        ? ['p-3']
        : [
            'text-body1',
            'min-w-21.5',
            'h-11',
            props.prependIcon === '' ? 'px-6' : 'px-3',
          ]

    case 'md':
      return props.isIcon
        ? ['p-2']
        : [
            'text-body1',
            'min-w-21',
            'h-10',
            props.prependIcon === '' ? 'px-4' : 'px-3',
            props.parentIsFlex ? 'py-4' : '',
          ]

    case 'sm':
      return props.isIcon
        ? ['p-1']
        : [
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
          'bg-brand-solid',
          'text-grey-0',
          'hover:bg-brand-solid-hover',
          'disabled:bg-grey-150',
        ]
      case 'secondary': {
        const result = [
          'bg-primary',
          'text-brand-solid',
          'border',
          'disabled:text-grey-250',
          'border-brand-border',
        ]
        props.isIcon
          ? result.push('hover:bg-brand', 'disabled:border-grey-250')
          : result.push('hover:text-brand-solid-hover')

        return result
      }
      case 'text':
        return [
          'bg-transparent',
          'text-link',
          'hover:text-link-hover',
          'disabled:text-grey-250',
        ]
      case 'critical-outline': {
        const result = [
          'bg-primary',
          'text-critical-solid',
          'border',
          'disabled:text-grey-250',
          'hover:bg-critical',
          'border-critical-border',
        ]

        return result
      }
      default:
        return []
    }
  } else if (props.theme === THEME.DARK) {
    switch (props.type) {
      case 'primary':
        return [
          'bg-brand-solid',
          'text-grey-0',
          'disabled:bg-grey-700',
          'disabled:text-grey-900',
          'hover:bg-brand-solid-hover',
        ]
      case 'secondary':
        return [
          'bg-transparent',
          'text-brand-solid',
          'border',
          'border-grey-700',
          'hover:text-brand-solid-hover',
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

const isFullWidth = computed(() => ({
  'w-full': props.isFullWidth,
}))
</script>
