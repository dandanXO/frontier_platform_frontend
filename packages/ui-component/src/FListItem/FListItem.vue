<template lang="pug">
div(class="h-9 flex items-center px-3 text-body2 break-words bg-black-0" :class="[classes]")
  slot
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'FListItem',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const classes = computed(() => {
      if (props.disabled) {
        return ['text-black-500', 'cursor-default', 'pointer-events-none']
      } else {
        return ['hover:bg-black-200', 'text-primary', 'cursor-pointer']
      }
    })

    return {
      classes
    }
  }
}
</script>
