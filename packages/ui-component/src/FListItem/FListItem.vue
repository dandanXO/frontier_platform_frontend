<template lang="pug">
div(
  class="h-9 flex items-center px-3 text-body2 break-words bg-grey-0 hover:bg-grey-100"
  :class="[classes]"
)
  slot
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'FListItem',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const classes = computed(() => {
      if (props.disabled) {
        return ['text-grey-200', 'cursor-default']
      } else {
        return ['text-grey-900', 'cursor-pointer']
      }
    })

    return {
      classes,
    }
  },
}
</script>
