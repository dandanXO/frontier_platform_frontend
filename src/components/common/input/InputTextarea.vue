<template lang="pug">
input-container(:label="label" :required="required")
  div(class="p-4 rounded border" :class="[classBorder, { 'bg-primary-thin': disabled }]" :style="{ height: height + 'px' }")
    textarea(
      :value="textValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="typing"
      @focus="onFocus"
      @blur="onBlur"
      class="w-full h-full resize-none leading-1.6 placeholder:text-black-400 placeholder:overflow-visible outline-none bg-transparent text-primary text-body2 disabled:text-black-600"
    )
  template(#hint)
    p(v-if="errorMsg !== ''" class="absolute text-caption text-warn pt-1") {{ errorMsg }}
    slot(v-else name="errorMsg")
</template>

<script>
import useInput from '@/composables/useInput'
import { toRefs } from 'vue'

export default {
  name: 'InputTextarea',
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    textValue: {
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      required: true
    },
    customErrorMsg: {
      type: [String, Boolean],
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:textValue', 'blur'],
  setup (props, context) {
    const { textValue, disabled, required, rules, customErrorMsg } = toRefs(props)
    const { isFocus, isError, onFocus, onBlur, typing, isEmpty, classBorder, errorMsg } = useInput({ context, textValue, disabled, required, customErrorMsg, rules })

    return {
      isFocus,
      isEmpty,
      typing,
      onFocus,
      onBlur,
      isError,
      classBorder,
      errorMsg
    }
  }
}
</script>
