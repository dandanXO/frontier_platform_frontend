<template lang="pug">
button(
  class="text-primary bg-black-200 rounded-xl hover:bg-brand-light hover:text-brand disabled:text-black-500 flex items-center"
  :class="[btnSize, active ? activeClass : '']"
)
  slot
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'BtnFunctional',
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

    const activeClass = 'bg-brand-light text-brand'

    return {
      btnSize,
      activeClass
    }
  }
}
</script>
