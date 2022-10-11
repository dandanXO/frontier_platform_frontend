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
          baseClass.push('text-body2', 'h-8.5', 'px-5', 'py-2.5', 'bg-grey-50', 'text-grey-900', 'hover:bg-grey-900', 'hover:text-grey-0', 'font-bold', 'border', 'border-grey-200')
          if (props.active) {
            baseClass.push('!bg-grey-900', '!text-grey-0')
          }
          break
        case 'sm':
          baseClass.push('text-caption', 'h-6', 'px-2.5', 'py-1', 'bg-grey-100', 'text-grey-600', 'hover:bg-grey-150')
          if (props.active) {
            baseClass.push('!bg-grey-150')
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
