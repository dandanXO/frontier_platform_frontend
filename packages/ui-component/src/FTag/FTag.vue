<template lang="pug">
div(:class="classes")
  slot
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FTag',
  props: {
    size: {
      type: String,
      default: 'lg',
      validator: (v) => ['lg', 'sm'].includes(v)
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const classes = computed(() => {
      const baseClass = ['w-fit', 'flex', 'items-center', 'rounded-full', 'whitespace-nowrap', 'cursor-pointer', 'box-border']

      switch (props.size) {
        case 'lg':
          baseClass.push('text-body2', 'h-8.5', 'px-5', 'py-2.5', 'bg-black-100', 'text-primary', 'hover:bg-primary', 'hover:text-black-0', 'font-bold', 'border', 'border-black-400')
          if (props.active) {
            baseClass.push('!bg-primary', '!text-black-0')
          }
          break
        case 'sm':
          baseClass.push('text-caption', 'h-6', 'px-2.5', 'py-1', 'bg-primary-thin', 'text-black-700', 'hover:bg-primary-middle')
          if (props.active) {
            baseClass.push('!bg-primary-middle')
          }
          break
      }

      return baseClass
    })

    return {
      classes
    }
  }
}
</script>
