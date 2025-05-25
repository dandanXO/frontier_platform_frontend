<template lang="pug">
button(
  class="flex items-center justify-center font-normal rounded gap-x-1 whitespace-nowrap"
  :class="[btnSize, btnType, isFullWidth]"
  :disabled="disabled"
)
  f-svg-icon(
    v-if="prependIcon !== ''"
    :iconName="prependIcon"
    :class="[animation ? 'animation-circle' : '', 'mt-0.5']"
  )
  slot
  f-svg-icon(v-if="postpendIcon !== ''" :iconName="postpendIcon" class="self-center")
</template>

<script lang="ts">
export type BtnType =
  | 'primary'
  | 'secondary'
  | 'text'
  | 'special'
  | 'critical-outline'
export default { name: 'FButton' }
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { THEME, SIZE } from '../constants'

const props = withDefaults(
  defineProps<{
    htmlType?: 'button' | 'submit' | 'reset'
    theme?: `${THEME}`
    size?: `${SIZE}` | 'special' | 'xsm'
    type?: BtnType
    isIcon?: boolean
    prependIcon?: string
    postpendIcon?: string
    disabled?: boolean
    parentIsFlex?: boolean
    isFullWidth?: boolean
    animation?: boolean
  }>(),
  {
    htmlType: 'button',
    theme: THEME.LIGHT,
    size: 'special',
    type: 'primary',
    prependIcon: '',
    postpendIcon: '',
    disabled: false,
    parentIsFlex: false,
    isFullWidth: false,
    animation: false,
  }
)

const btnSize = computed(() => {
  const result = []
  switch (props.size) {
    case 'lg':
      result.push('text-base', 'min-h-11', 'p-3')

      !props.isIcon && result.push('min-w-24')
      return result

    case 'md':
      return props.isIcon
        ? ['p-2']
        : ['text-sm', 'min-w-24', 'min-h-10', 'px-3', 'py-2']

    case 'sm':
      return props.isIcon
        ? ['p-1']
        : ['text-sm', 'min-w-24', 'min-h-8.5', 'px-3', 'py-1']

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
          'text-white',
          'hover:bg-brand-solid-hover',
          'disabled:bg-grey-150',
        ]
      case 'secondary': {
        const result = [
          'bg-transparent',
          'text-brand-solid',
          'border',
          'disabled:text-disabled',
          'disabled:border-disabled',
          'border-brand-border',
        ]
        props.isIcon
          ? result.push('hover:bg-brand', 'disabled:border-disabled')
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

<style scoped>
.animation-circle {
  animation: spin 2s linear infinite; /* 添加旋轉動畫 */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
