<template lang="pug">
div(class="flex items-center px-3 py-2.5 text-body2 break-words" :class="[classes]")
  slot
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'ListItem',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const classes = computed(() => {
      if (props.disabled) {
        return ['text-black-500', 'cursor-default']
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
