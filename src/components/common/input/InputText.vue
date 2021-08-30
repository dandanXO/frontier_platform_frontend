<template lang="pug">
div(class="relative")
  slot(name="label")
    div(v-if="label !== ''" class="flex pb-2 text-body2 font-bold")
      i(v-if="required" class="text-warn") *
      p(class="text-primary") {{label}}
  div(class="px-4 border rounded flex items-center"
      :class="[classBorder, { 'bg-primary-thin': disabled } , size === 'lg' ? 'h-11' : 'h-9']"
    )
    div(v-if="prependIcon !== '' && isEmpty" class="pr-1")
      slot(name="prependIcon")
        svg-icon(
          size="20"
          :iconName="prependIcon"
          :class="classPrependIcon"
        )
    input(
      :type="inputType"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="typing"
      @focus="onFocus"
      @blur="onBlur"
      class="flex-grow outline-none bg-transparent overflow-hidden text-primary text-body2 placeholder-black-400 placeholder-text-body2 placeholder-overflow-visible disabled:text-black-600"
      autocomplete
    )
    div(v-if="appendIcon !== '' || clearable" class="pl-1 h-full")
      slot(name="appendIcon")
        div(v-if="clearable && value !== ''" class="h-full flex items-center")
          svg-icon(
            size="20"
            iconName="clear"
            class="text-black-500"
            @click="clear"
          )
  p(v-if="errorMsg !== ''" class="absolute text-caption text-warn pt-1") {{$t(errorMsg)}}
  slot(v-else name="errorMsg")
</template>

<script>
import { toRefs } from '@vue/reactivity'
import useInput from '@/composables/useInput'

export default {
  name: 'InputText',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
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
    size: {
      type: String,
      default: 'lg'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    customErrorMsg: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:value', 'blur'],
  setup (props, context) {
    const { value, disabled, rules, required, customErrorMsg } = toRefs(props)
    const { isFocus, isError, onFocus, onBlur, clear, typing, isEmpty, classBorder, errorMsg, classPrependIcon } = useInput({ context, inputText: value, disabled, rules, required, customErrorMsg })

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
