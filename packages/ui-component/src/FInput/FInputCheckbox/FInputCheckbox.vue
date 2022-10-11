<template lang="pug">
label(class="flex items-center")
  f-svg-icon(v-if="checked" iconName="check_box" :size="iconSize" :class="[disabled ? 'text-grey-200' : iconColor, { 'cursor-pointer': !disabled }]")
  f-svg-icon(v-else iconName="check_box_outline_blank" :size="iconSize" :class="[uncheckColor, { 'cursor-pointer': !disabled }]")
  input(
    type="checkbox"
    class="hidden"
    :checked="checked"
    :value="value"
    @input="check($event)"
    :disabled="disabled"
  )
  div(v-if="label !== ''" class="text-body2 pl-1 whitespace-nowrap" :class="[disabled ? 'text-grey-200' : 'text-grey-900 cursor-pointer']") {{ label }}
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'FInputCheckbox',
  props: {
    /**
     * when `binary` is true, the type of `inputValue` must be Boolean
     */
    binary: {
      type: Boolean,
      default: false
    },
    /**
     * v-model:inputValue
     */
    inputValue: {
      type: [Array, Boolean],
      required: true
    },
    /**
     * The value used when the component is selected
     *
     * you don't have to set value if `binary` is true
     */
    value: {
      type: [String, Number, Object]
    },
    label: {
      type: [String, Number],
      default: ''
    },
    iconSize: {
      type: String,
      default: '24'
    },
    iconColor: {
      type: String,
      default: 'text-primary-400'
    },
    uncheckColor: {
      type: String,
      default: 'text-grey-200'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:inputValue'],
  setup (props, { emit }) {
    const checked = computed(() => {
      if (props.binary) {
        return props.inputValue
      } else {
        const tempInputValueString = props.inputValue.map(v => JSON.stringify(v))
        return tempInputValueString.includes(JSON.stringify(props.value))
      }
    })
    const check = (e) => {
      if (props.binary) {
        emit('update:inputValue', !props.inputValue)
        return
      }
      const updatedInputValue = [...props.inputValue]
      if (!e.target.checked) {
        const tempInputValueString = props.inputValue.map(v => JSON.stringify(v))
        updatedInputValue.splice(tempInputValueString.indexOf(JSON.stringify(props.value)), 1)
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
