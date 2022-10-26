<style lang="scss" scoped>
input[type='date'] {
  &::-webkit-calendar-picker-indicator {
    background-size: contain;
    background-image: url('./calendar.png');
    width: 20px;
    height: 20px;
    padding: 0;
    margin: 0;
  }
}
</style>

<template lang="pug">
f-input-container(:label="label" :required="required")
  div(
    class="px-4 border border-grey-200 rounded flex items-center"
    :class="[classBorder, { 'bg-grey-100': disabled }, size === 'lg' ? 'h-11' : 'h-9']"
  )
    slot(name="slot:prependItem")
    div(v-if="prependIcon || slots['slot:prependIcon']" class="pr-1")
      f-svg-icon(
        v-if="prependIcon"
        size="20"
        :iconName="prependIcon"
        :class="classPrependIcon"
      )
      slot(v-else name="slot:prependIcon")
    input(
      :type="inputType"
      :value="textValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="typing"
      @focus="onFocus"
      @blur="onBlur"
      @change="$emit('change', $event)"
      @keydown.enter="$emit('enter', $event)"
      class="w-full flex-grow outline-none bg-transparent overflow-hidden text-grey-900 text-body2 disabled:text-grey-600 placeholder:text-grey-200 placeholder:overflow-visible"
      autocomplete
    )
    div(v-if="clearable && !!textValue" class="pl-1")
      f-svg-icon(size="20" iconName="clear" class="text-grey-200" @click.stop="clear")
    slot(name="slot:appendItem")
  template(#slot:hint)
    p(
      v-if="!!errorMsg"
      class="text-caption text-red-400 absolute pt-1"
      data-cy="error-msg"
    ) {{ errorMsg }}
    slot(v-else name="slot:errorMsg" data-cy="error-msg")
</template>

<script>
import { toRefs } from 'vue'
import useInput from '../useInput'

export default {
  name: 'FInputText',
  props: {
    /**
     * v-model:textValue
     */
    textValue: {
      validator: (prop) =>
        typeof prop === 'number' || typeof prop === 'string' || prop === null,
      required: true,
    },
    inputType: {
      type: String,
      default: 'text',
    },
    /**
     * only work when inputType is text or number
     */
    placeholder: {
      type: String,
      default: '',
    },
    prependIcon: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    /**
     * inherit from `FInputContainer.vue`
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * inherit from `FInputContainer.vue`
     *
     * only work when `label` has been setted
     */
    required: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'lg',
    },
    /**
     * format: false case && error message
     */
    rules: {
      type: Array,
      default: () => [],
    },
    /**
     * It turn to error state when customErrorMsg has value
     */
    customErrorMsg: {
      type: [String, Boolean],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:textValue', 'blur', 'enter', 'clear', 'change', 'input'],
  setup(props, context) {
    const { inputType, textValue, disabled, rules, customErrorMsg } =
      toRefs(props)
    const {
      isFocus,
      isError,
      onFocus,
      onBlur,
      clear,
      typing,
      isEmpty,
      classBorder,
      errorMsg,
      classPrependIcon,
    } = useInput({
      context,
      inputType,
      textValue,
      disabled,
      rules,
      customErrorMsg,
    })

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
      classPrependIcon,
      slots: context.slots,
    }
  },
}
</script>
