<template lang="pug">
label(class="flex items-center")
  f-svg-icon(v-if="checked" iconName="radio_button_checked" :size="iconSize" :class="[checkColor]" class="cursor-pointer")
  f-svg-icon(v-else iconName="radio_button_unchecked" :size="iconSize" :class="[uncheckColor]" class="cursor-pointer")
  input(
    type="radio"
    class="hidden"
    :checked="checked"
    :value="value"
    @input="check"
  )
  div(v-if="label !== ''" class="pl-1 text-body2 text-grey-900 whitespace-nowrap cursor-pointer") {{ label }}
</template>

<script>
import { computed } from '@vue/reactivity'
export default {
  name: 'FInputRadio',
  props: {
    /**
     * v-model:inputValue
     */
    inputValue: {
      type: [String, Number, Boolean, Object],
      required: true
    },
    /**
     * The value used when the component is selected
     */
    value: {
      type: [String, Number, Boolean, Object],
      required: true
    },
    label: {
      type: [String, Number],
      default: ''
    },
    iconSize: {
      type: String,
      default: '24'
    },
    checkColor: {
      type: String,
      default: 'text-primary-400'
    },
    uncheckColor: {
      type: String,
      default: 'text-grey-200'
    }
  },
  emits: ['update:inputValue'],
  setup (props, { emit }) {
    const checked = computed(() => {
      if (typeof props.value === 'object') {
        return JSON.stringify(props.inputValue) === JSON.stringify(props.value)
      } else {
        return props.inputValue === props.value
      }
    })
    const check = () => {
      emit('update:inputValue', props.value)
    }
    return {
      checked,
      check
    }
  }
}
</script>
