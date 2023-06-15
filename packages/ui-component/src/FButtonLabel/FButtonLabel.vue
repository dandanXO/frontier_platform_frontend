<template lang="pug">
button(
  class="rounded-xl flex items-center"
  :class="[btnSize, btnType, active ? activeClass : '']"
)
  slot
</template>

<script>
import { computed } from 'vue'
import { THEME } from '../constants'

export default {
  name: 'FButtonLabel',
  props: {
    theme: {
      type: String,
      default: 'light',
    },
    size: {
      type: String,
      default: 'sm',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const btnSize = computed(() => {
      switch (props.size) {
        case 'lg':
          return ['text-body2', 'h-6', 'px-2.5']
        case 'sm':
          return ['text-caption', 'h-5', 'px-2']
        default:
          return []
      }
    })

    const btnType = computed(() => {
      if (props.theme === THEME.LIGHT) {
        return [
          'bg-grey-100',
          'text-grey-900',
          'enabled:hover:bg-primary-50',
          'enabled:hover:text-primary-400',
          'disabled:text-grey-250',
        ]
      } else if (props.theme === THEME.DARK) {
        return [
          'bg-grey-700',
          'text-grey-100',
          'enabled:hover:bg-primary-50',
          'enabled:hover:text-primary-400',
          'disabled:bg-grey-700',
          'disabled:text-grey-500',
        ]
      } else {
        throw new Error('invalid theme, only accept "light" or "dark"')
      }
    })

    const activeClass = 'bg-primary-50 !text-primary-400'

    return {
      btnSize,
      btnType,
      activeClass,
    }
  },
}
</script>
