<template lang="pug">
input-container(:label="label" :required="required")
  div(class="h-full px-4 border rounded flex items-center" :class="[classBorder, { 'bg-primary-thin': disabled }, size === 'lg' ? 'h-11' : 'h-9']")
    slot(name="prependItem")
    div(v-if="prependIcon !== '' && isEmpty" class="pr-1")
      slot(name="prependIcon")
        svg-icon(
          size="20"
          :iconName="prependIcon"
          :class="classPrependIcon"
        )
    input(
      :type="inputType"
      :value="textValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="typing"
      @focus="onFocus"
      @blur="onBlur"
      class="flex-grow outline-none bg-transparent overflow-hidden text-primary text-body2 placeholder-black-400 placeholder-text-body2 placeholder-overflow-visible disabled:text-black-600"
      autocomplete
    )
    div(v-if="appendIcon !== '' || clearable" class="pl-1")
      slot(name="appendIcon")
        svg-icon(
          v-if="clearable && !!textValue"
          size="20"
          iconName="clear"
          class="text-black-500"
          @click="clear"
        )
    slot(name="appendItem")
  template(#hint)
    p(v-if="!!errorMsg" class="text-caption text-warn absolute pt-1") {{$t(errorMsg)}}
    slot(v-else name="errorMsg")
</template>

<script>
import { toRefs } from 'vue'
import useInput from '@/composables/useInput'

export default {
  name: 'InputText',
  props: {
    textValue: {
      validator: prop => typeof prop === 'number' || typeof prop === 'string' || prop === null,
      required: true
    },
    inputType: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    prependIcon: {
      type: String,
      default: ''
    },
    appendIcon: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'lg'
    },
    rules: {
      type: Array,
      default: () => []
    },
    customErrorMsg: {
      type: [String, Boolean],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:textValue', 'blur'],
  setup (props, context) {
    const { inputType, textValue, disabled, rules, required, customErrorMsg } = toRefs(props)
    const { isFocus, isError, onFocus, onBlur, clear, typing, isEmpty, classBorder, errorMsg, classPrependIcon } = useInput({ context, inputType, textValue, disabled, rules, required, customErrorMsg })

    return {
      isFocus,
      isEmpty,
      typing,
      onFocus,
      onBlur,
      clear,
      errorMsg,
      isError,
      classBorder,
      classPrependIcon
    }
  }
}
</script>
