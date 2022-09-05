<template lang="pug">
f-input-container(:required="required" :label="label")
  div(class="flex gap-x-3")
    f-input-radio(v-for="option in optionList"
      v-model:inputValue="innerInputValue"
      :label="option[keyOptionName]"
      :value="option[keyOptionValue]"
      :iconSize="radioSize"
      data-cy="input-radio"
    )
</template>

<script>
import { computed } from '@vue/runtime-core'
export default {
  name: 'FInputRadioGroup',
  props: {
    /**
     * inherit from `FInputContainer.vue`
     */
    label: {
      type: String,
      default: ''
    },
    /**
     * inherit from `FInputContainer.vue`
     *
     * only work when `label` has been setted
     */
    required: {
      type: Boolean,
      required: false
    },
    /**
     * ```
     * [
     *   {
     *     [keyOptionName]:  Any,
     *     [keyOptionValue]: Any
     *   }
     * ]
     * ```
     */
    optionList: {
      type: Array,
      required: true
    },
    /**
     * v-model:inputValue
     */
    inputValue: {
      type: [String, Number, Boolean, Object],
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
