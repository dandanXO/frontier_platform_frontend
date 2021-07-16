<template lang="pug">
button(class="rounded disabled:bg-primary-middle bg-brand text-black-0 text-body1 font-normal" :class="btnSize")
  slot
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'Btn',
  props: {
    size: {
      type: String,
      default: 'lg'
    }
  },
  setup (props) {
    const btnSize = computed(() => {
      switch (props.size) {
        case 'lg':
          return ['w-85', 'h-11']
        case 'md':
          return ['w-35', 'h-10.5']
        case 'sm':
          return ['w-25', 'h-10']
      }
    })
    return {
      btnSize
    }
  }
}
</script>
