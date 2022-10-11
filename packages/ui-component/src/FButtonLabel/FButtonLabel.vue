<template lang="pug">
button(
  class="text-grey-900 bg-grey-100 rounded-xl hover:bg-primary-0 hover:text-primary-400 disabled:text-grey-200 flex items-center"
  :class="[btnSize, active ? activeClass : '']"
)
  slot
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'FButtonLabel',
  props: {
    size: {
      type: String,
      default: 'sm'
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const btnSize = computed(() => {
      switch (props.size) {
        case 'lg':
          return ['text-body2', 'h-6', 'px-2.5']
        case 'sm':
          return ['text-caption', 'h-5', 'px-2']
      }
    })

    const activeClass = 'bg-primary-0 !text-primary-400'

    return {
      btnSize,
      activeClass
    }
  }
}
</script>
