<template lang="pug">
f-input-container(:label="label" :required="required")
  div(
    class="p-4 rounded border"
    :class="[classBorder, { 'bg-grey-100': disabled }]"
    :style="{ height: height + 'px' }"
  )
    textarea(
      :value="textValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="typing"
      @focus="onFocus"
      @blur="onBlur"
      class="w-full h-full resize-none leading-1.6 placeholder:text-grey-200 placeholder:overflow-visible outline-none bg-transparent text-grey-900 text-body2 disabled:text-grey-600"
    )
  template(#slot:hint)
    p(v-if="errorMsg !== ''" class="absolute text-caption text-red-400 pt-1") {{ errorMsg }}
    slot(v-else name="slot:errorMsg")
</template>

<script>
import useInput from '../useInput'
import { toRefs } from 'vue'

export default {
  name: 'FInputTextarea',
  props: {
    /**
     * inherit from `FInputContainer.vue`
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * inherit from `FInputContainer.vue`
     */
    required: {
      type: Boolean,
      default: false,
    },
    textValue: {
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      required: true,
    },
    customErrorMsg: {
      type: [String, Boolean],
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:textValue', 'blur', 'enter', 'clear', 'change', 'input'],
  setup(props, context) {
    const { textValue, disabled, rules, customErrorMsg } = toRefs(props)
    const {
      isFocus,
      isError,
      onFocus,
      onBlur,
      typing,
      isEmpty,
      classBorder,
      errorMsg,
    } = useInput({ context, textValue, disabled, customErrorMsg, rules })

    return {
      isFocus,
      isEmpty,
      typing,
      onFocus,
      onBlur,
      isError,
      classBorder,
      errorMsg,
    }
  },
}
</script>
