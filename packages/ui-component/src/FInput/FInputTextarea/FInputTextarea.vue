<template lang="pug">
f-input-container(
  :label="label"
  :required="required"
  :hintSupporting="hintSupporting"
  :hintError="ruleErrorMsg || hintError"
)
  textarea(
    class="px-3 py-1.5 rounded border outline-none text-body2 leading-1.6 text-grey-900 whitespace-pre-wrap resize-none w-full transition-colors duration-100 placeholder:text-grey-600-v1"
    :class="[minHeight, disabled ? 'bg-grey-50-v1 border-none cursor-not-allowed placeholder:text-grey-250' : isFocus ? 'bg-grey-0' : 'bg-grey-0 hover:bg-grey-50-v1', isError ? 'border-red-300' : 'border-grey-250']"
    :placeholder="placeholder"
    :value="innerTextValue"
    :disabled="disabled"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
  )
  template(v-if="slots['slot:hint-error']" #slot:hint-error)
    slot(name="slot:hint-error")
  template(v-if="slots['slot:hint-supporting']" #slot:hint-supporting)
    slot(name="slot:hint-supporting")
</template>

<script>
export default {
  name: 'FInputTextarea',
}
</script>

<script setup>
import { computed, toRefs, useSlots } from 'vue'
import useInput from '../useInput'

const slots = useSlots()
const props = defineProps({
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
   * only work when `label` has been set
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * Throws an error message if any rule fails, then it will be used in preference to it instead of `hintError`
   *
   * ***format: false case && error message***
   */
  rules: {
    type: Array,
    default: () => [],
  },
  /**
   * inherit from `FInputContainer.vue`
   *
   * it could be i18n key or text and it works only when `slot:hint-error` hasn't been set and all `rules` are pass.
   *
   */
  hintError: {
    type: [String, Boolean],
    default: '',
  },
  /**
   * inherit from `FInputContainer.vue`
   *
   * it could be i18n key or text and it works only when `slot:hint-supporting` hasn't been set.
   */
  hintSupporting: {
    type: String,
    default: '',
  },
  textValue: {
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Text',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  minHeight: {
    type: String,
    default: 'min-h-26',
  },
})

const emit = defineEmits(['update:textValue', 'focus', 'blur', 'input'])
const innerTextValue = computed({
  get: () => props.textValue,
  set: (v) => emit('update:textValue', v),
})
const { rules, hintError, disabled } = toRefs(props)
const { isFocus, isError, ruleErrorMsg } = useInput({
  slots,
  inputValue: innerTextValue,
  rules,
  hintError,
  disabled,
})

defineExpose({
  isError,
})

const onInput = (event) => {
  innerTextValue.value = event.target.value
  emit('input')
}
const onFocus = () => {
  isFocus.value = true
  emit('focus')
}
const onBlur = () => {
  isFocus.value = false
  emit('blur')
}
</script>

<style scoped>
textarea {
  box-shadow: 0px 0px 0px 2px transparent;
  box-sizing: border-box;
}

textarea:focus {
  box-shadow: 0px 0px 0px 2px var(--Color-Utility-utility-cyan-200, #8addf4);
  outline: none;
}
</style>
