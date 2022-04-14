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
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const classes = computed(() => {
      const base = ['flex', 'items-center', 'rounded-full', 'whitespace-nowrap', 'cursor-pointer']

      if (props.size === 'lg') {
        base.push('h-8.5', 'px-5', 'hover:bg-primary', 'hover:text-black-0', 'font-bold')
        if (props.active) {
          base.push('bg-primary', 'text-black-0')
        } else {
          base.push('bg-black-100', 'border', 'border-black-400')
        }
      }

      return base
    })

    return {
      classes
    }
  }
}
</script>
