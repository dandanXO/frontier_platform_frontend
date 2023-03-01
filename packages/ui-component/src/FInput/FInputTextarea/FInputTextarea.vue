<template lang="pug">
f-input-container(
  :label="label"
  :required="required"
  :hintSupporting="hintSupporting"
  :hintError="ruleErrorMsg || hintError"
)
  div(
    ref="refInput"
    class="px-3 py-1.5 rounded border outline-none text-body2 leading-1.6 text-grey-900"
    :class="[minHeight, disabled ? 'bg-grey-50 border-none cursor-not-allowed' : 'bg-grey-0', isError ? 'border-red-300' : 'border-grey-250']"
    :contenteditable="!disabled"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
  )
    span(
      v-if="!innerTextValue && !isFocus"
      class="text-body2 leading-1.6 text-grey-250"
    ) {{ placeholder }}
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
import { ref, computed, toRefs, useSlots, onMounted, onUpdated } from 'vue'
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

const refInput = ref(null)

defineExpose({
  isError,
})

const onInput = () => {
  innerTextValue.value = refInput.value.textContent
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

onMounted(() => {
  refInput.value.textContent = innerTextValue.value
})

onUpdated(() => {
  refInput.value.textContent = innerTextValue.value
})
</script>
