<template lang="pug">
button(class="rounded font-normal flex gap-x-1 items-center justify-center" :class="[btnSize, btnType]")
  f-svg-icon(v-if="prependIcon !== ''" :iconName="prependIcon")
  slot
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'FButton',
  props: {
    size: {
      type: String,
      default: 'special'
    },
    type: {
      type: String,
      default: 'primary'
    },
    prependIcon: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const btnSize = computed(() => {
      switch (props.size) {
        case 'lg':
          return ['text-body1', 'min-w-21.5', 'h-11', props.prependIcon === '' ? 'px-6' : 'px-3']
        case 'md':
          return ['text-body1', 'min-w-21', 'h-10', props.prependIcon === '' ? 'px-4' : 'px-3']
        case 'sm':
          return ['text-body2', 'min-w-14', 'h-8.5', props.prependIcon === '' ? 'px-3.5' : 'px-3']
      }
    })

    const btnType = computed(() => {
      switch (props.type) {
        case 'primary':
          return ['bg-brand', 'text-black-0', 'disabled:bg-primary-middle', 'hover:bg-brand-dark']
        case 'secondary':
          return ['bg-black-0', 'text-brand', 'disabled:text-black-500', 'border', 'border-primary-middle', 'hover:text-brand-dark']
        case 'text':
          return ['bg-black-0', 'text-primary', 'disabled:text-black-500', 'hover:text-brand-dark']
      }
    })
    return {
      btnSize,
      btnType
    }
  }
}
</script>
