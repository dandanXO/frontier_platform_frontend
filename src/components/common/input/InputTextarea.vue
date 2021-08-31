<template lang="pug">
input-container(:required="required")
  template(#input)
    div(class="p-4 rounded border" :class="[classBorder, textareaHeight, { 'bg-primary-thin': disabled }]")
      textarea(
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="typing"
        @focus="onFocus"
        @blur="onBlur"
        class="w-full h-full resize-none line-height-1.6 placeholder-line-height-1.6 outline-none bg-transparent text-primary text-body2 placeholder-black-400 placeholder-text-body2 disabled:text-black-600"
      )
  template(#hint)
    p(v-if="errorMsg !== ''" class="absolute text-caption text-warn pt-1") {{$t(errorMsg)}}
</template>

<script>
import useInput from '@/composables/useInput'
import { toRefs, computed } from 'vue'

export default {
  name: 'InputTextarea',
  props: {
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
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
    }
  },
  emits: ['update:value', 'blur'],
  setup (props, context) {
    const { value, disabled, required } = toRefs(props)
    const { isFocus, isError, onFocus, onBlur, typing, isEmpty, classBorder, errorMsg } = useInput({ context, inputText: value, disabled, required })
    const textareaHeight = computed(() => `h-${props.height / 4}`)

    return {
      isFocus,
      isEmpty,
      typing,
      onFocus,
      onBlur,
      isError,
      classBorder,
      textareaHeight,
      errorMsg
    }
  }
}
</script>
