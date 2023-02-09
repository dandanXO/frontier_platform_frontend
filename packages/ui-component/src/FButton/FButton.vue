<template lang="pug">
button(
  class="rounded font-normal flex gap-x-1 items-center justify-center whitespace-nowrap"
  :class="[btnSize, btnType]"
)
  f-svg-icon(v-if="prependIcon !== ''" :iconName="prependIcon")
  slot
</template>

<script>
import { computed } from 'vue'
import { THEME } from '../constants.js'

export default {
  name: 'FButton',
  props: {
    theme: {
      type: String,
      default: THEME.LIGHT,
    },
    size: {
      type: String,
      default: 'special',
    },
    type: {
      type: String,
      default: 'primary',
    },
    prependIcon: {
      type: String,
      default: '',
    },
  },
  setup(props) {
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
              'disabled:bg-grey-150',
              'hover:bg-primary-500',
            ]
          case 'secondary':
            return [
              'bg-grey-0',
              'text-primary-400',
              'disabled:text-grey-250',
              'border',
              'border-grey-150',
              'hover:text-primary-500',
            ]
          case 'text':
            return [
              'bg-grey-0',
              'text-grey-900',
              'disabled:text-grey-250',
              'hover:text-primary-500',
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
              'disabled:bg-grey-150',
              'hover:bg-primary-500',
            ]
          case 'secondary':
            return [
              'bg-transparent',
              'text-primary-400',
              'disabled:text-grey-250',
              'border',
              'border-grey-300',
              'hover:text-primary-500',
            ]
          case 'text':
            return [
              'bg-transparent',
              'text-grey-300',
              'disabled:text-grey-250',
              'hover:text-primary-500',
            ]
          default:
            return []
        }
      } else {
        throw new Error('invalid theme, only accept "light" or "dark"')
      }
    })

    return {
      btnSize,
      btnType,
    }
  },
}
</script>
