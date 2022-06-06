<template lang="pug">
input-container(:required="required")
  div(class="flex gap-x-3")
    input-radio(v-for="option in optionList"
      v-model:inputValue="innerInputValue"
      :name="option[keyOptionName]"
      :value="option[keyOptionValue]"
      :size="radioSize"
    )
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'InputRadioGroup',
  props: {
    required: {
      type: Boolean,
      required: false
    },
    optionList: {
      type: Array,
      required: true
    },
    inputValue: {
      type: [String, Number, Boolean],
      required: true
    },
    keyOptionName: {
      type: String,
      default: 'name'
    },
    keyOptionValue: {
      type: String,
      default: 'value'
    },
    radioSize: {
      type: String,
      default: '24'
    }
  },
  emits: ['update:inputValue'],
  setup (props, { emit }) {
    const innerInputValue = computed({
      get: () => props.inputValue,
      set: (v) => emit('update:inputValue', v)
    })
    return {
      innerInputValue
    }
  }
}
</script>
