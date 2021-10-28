<template lang="pug">
input-text(:label="label" :required="required" :size="size" :disabled="diabledInput")
  template(#appendItem)
    div(class="-mr-4 pl-4 h-full flex items-center")
      button(
        class="h-full rounded-r transform translate-x-0.5 flex justify-center items-center"
        :disabled="diabledIcon"
        :class="[bgType, size === 'lg' ? 'w-11 h-11' : 'w-9 h-9']"
        @click="$emit('click:icon')")
        svg-icon(:size="iconSize" :iconName="iconName" :class="[iconColor]")
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'InputTextIcon',
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'lg'
    },
    type: {
      type: String,
      default: 'primary'
    },
    diabledInput: {
      type: Boolean,
      default: false
    },
    diabledIcon: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String,
      default: 'add'
    },
    iconSize: {
      type: String,
      default: '24'
    },
    iconColor: {
      type: String,
      default: 'text-black-0'
    }
  },
  emits: ['click:icon'],
  setup (props) {
    const bgType = computed(() => {
      switch (props.type) {
        case 'primary':
          return ['bg-brand', 'text-black-0', 'disabled:bg-primary-middle', 'hover:bg-brand-dark']
        case 'secondary':
          return ['bg-black-0', 'text-brand', 'disabled:text-black-500', 'border', 'border-primary-middle', 'hover:text-brand-dark']
      }
    })
    return {
      bgType
    }
  }
}
</script>
