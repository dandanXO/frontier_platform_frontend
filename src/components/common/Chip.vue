<template lang="pug">
div(:class="classes") {{text}}
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Chip',
  props: {
    size: {
      type: String,
      default: 'lg',
      validator: (v) => ['lg', 'sm'].includes(v)
    },
    text: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const classes = computed(() => {
      const base = ['flex', 'items-center', 'rounded-full', 'whitespace-nowrap', 'cursor-pointer']

      return props.size === 'lg'
        ? [...base, 'h-8.5', 'px-5', 'bg-black-600', 'hover:bg-primary', 'text-black-0']
        : [...base, '']
    })

    return {
      classes
    }
  }
}
</script>
