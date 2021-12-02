<template lang="pug">
label(class="flex items-center")
  svg-icon(v-if="checked" iconName="check_box" :size="size" :class="[disabled ? 'text-black-400' : iconColor]")
  svg-icon(v-else iconName="check_box_outline_blank" :size="size" :class="[uncheckColor]")
  input(type="checkbox"
    class="hidden"
    :checked="checked"
    :value="value"
    @input="check($event)"
    :disabled="disabled"
  )
  div(v-if="label !== ''" class="text-body2 text-primary pl-1") {{label}}
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'InputCheckbox',
  props: {
    inputValue: {
      type: [Array, Boolean],
      required: true
    },
    value: {
      type: [String, Number]
    },
    label: {
      type: [String, Number],
      default: ''
    },
    size: {
      type: String,
      default: '24'
    },
    iconColor: {
      type: String,
      default: 'text-brand'
    },
    uncheckColor: {
      type: String,
      default: 'text-black-400'
    },
    binary: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:inputValue'],
  setup (props, { emit }) {
    const checked = computed(() => props.binary ? props.inputValue : props.inputValue.includes(props.value))
    const check = (e) => {
      if (props.binary) {
        emit('update:inputValue', !props.inputValue)
        return
      }
      const updatedInputValue = [...props.inputValue]
      if (!e.target.checked) {
        updatedInputValue.splice(updatedInputValue.indexOf(props.value), 1)
      } else {
        updatedInputValue.push(props.value)
      }
      emit('update:inputValue', updatedInputValue)
    }
    return {
      checked,
      check
    }
  }
}
</script>
