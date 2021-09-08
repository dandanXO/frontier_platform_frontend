<template lang="pug">
label(class="flex items-center" :for="value")
  svg-icon(v-if="checked" iconName="check_box" :size="size" class="text-brand")
  svg-icon(v-else iconName="check_box_outline_blank" :size="size" class="text-black-400")
  input(type="checkbox"
    class="hidden"
    :id="value"
    :checked="checked"
    :value="value"
    @input="check($event)"
  )
  div(v-if="label !== ''" class="text-body2 text-primary") {{label}}
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'InputCheckbox',
  props: {
    inputValue: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: [String, Number],
      default: ''
    },
    size: {
      type: String,
      default: '24'
    }
  },
  setup (props, { emit }) {
    const checked = computed(() => props.inputValue.includes(props.value))
    const check = (e) => {
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
