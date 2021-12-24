<template lang="pug">
input-text(:size="size" :disabled="disabledInput" @clear="$emit('clear')")
  template(#appendItem)
    div(class="-mr-4 pl-4 h-full flex items-center")
      button(:disabled="disabledBtn" :class="[btnSize, btnType]" class="rounded-r transform translate-x-0.5" @click="$emit('click:button')")
        span {{buttonLabel}}
  template(#errorMsg)
    slot(name="errorMsg")
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'InputTextBtn',
  props: {
    size: {
      type: String,
      default: 'lg'
    },
    type: {
      type: String,
      default: 'primary'
    },
    disabledInput: {
      type: Boolean,
      default: false
    },
    disabledBtn: {
      type: Boolean,
      default: false
    },
    buttonLabel: {
      type: String,
      default: ''
    }
  },
  emits: ['click:button', 'clear'],
  setup (props) {
    const btnSize = computed(() => {
      switch (props.size) {
        case 'lg':
          return ['text-body2', 'min-w-21.5', 'h-11', 'px-5']
        case 'sm':
          return ['text-body2', 'min-w-14', 'h-9', 'px-4']
      }
    })

    const btnType = computed(() => {
      switch (props.type) {
        case 'primary':
          return ['bg-brand', 'text-black-0', 'disabled:bg-primary-middle', 'hover:bg-brand-dark']
        case 'secondary':
          return ['bg-black-0', 'text-brand', 'disabled:text-black-500', 'border', 'border-primary-middle', 'hover:text-brand-dark']
      }
    })
    return {
      btnSize,
      btnType
    }
  }
}
</script>
