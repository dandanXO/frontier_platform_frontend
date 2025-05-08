<template lang="pug">
f-input-text(
  v-bind="props"
  v-model:textValue="innerTextValue"
  :inputType="isVisible ? 'text' : 'password'"
  :appendIcon="isVisible ? 'visibility' : 'visibility_off'"
  @click:appendIcon="isVisible = !isVisible"
  appendIconClass="text-primary-inverse"
  :disabled="disabled"
)
</template>

<script>
export default {
  name: 'FInputPassword',
}
</script>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  /**
   * inherit from `FInputText.vue`
   *
   * v-model:textValue
   */
  textValue: {
    validator: (prop) =>
      typeof prop === 'number' || typeof prop === 'string' || prop === null,
    required: true,
  },
  /**
   * inherit from `FInputText.vue`
   */
  placeholder: {
    type: String,
    default: '',
  },
  /**
   * inherit from `FInputText.vue`
   */
  clearable: {
    type: Boolean,
    default: true,
  },
  /**
   * inherit from `FInputText.vue`
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * inherit from `FInputText.vue`
   *
   * only work when `label` has been set
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * inherit from `FInputText.vue`
   */
  size: {
    type: String,
    default: 'lg',
  },
  /**
   * inherit from `FInputText.vue`
   *
   * format: false case && error message
   */
  rules: {
    type: Array,
    default: () => [],
  },
  /**
   * inherit from `FInputText.vue`
   */
  hintError: {
    type: String,
    default: '',
  },
  /**
   * inherit from `FInputText.vue`
   */
  hintSupporting: {
    type: String,
    default: '',
  },
  /**
   * inherit from `FInputText.vue`
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
  version: {
    type: String,
    default: 'v1',
  },
})
const emit = defineEmits(['update:textValue'])

const isVisible = ref(false)

const innerTextValue = computed({
  get: () => props.textValue,
  set: (v) => emit('update:textValue', v),
})
</script>
