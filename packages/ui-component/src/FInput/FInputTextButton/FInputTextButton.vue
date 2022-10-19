<template lang="pug">
f-input-text(v-bind="props" v-model:textValue="innerTextValue" :disabled="disabledInput" @clear="$emit('clear')")
  template(#slot:appendItem)
    div(class="-mr-4 pl-4 h-full flex items-center")
      button(:disabled="disabledBtn" :class="[btnSize, btnType]" class="rounded-r transform translate-x-0.5" @click="$emit('click:button')" data-cy="input-text-btn")
        span {{ buttonLabel }}
</template>

<script>
export default {
  name: 'FInputTextButton'
}
</script>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['click:button', 'clear', 'update:textValue'])
const props = defineProps({
  /**
   * inherit from `FInputText.vue`
   *
   * v-model:textValue
   */
  textValue: {
    validator: prop => typeof prop === 'number' || typeof prop === 'string' || prop === null,
    required: true
  },
  /**
   * inherit from `FInputText.vue`
   */
  placeholder: {
    type: String,
    default: ''
  },
  /**
   * inherit from `FInputText.vue`
   */
  clearable: {
    type: Boolean,
    default: true
  },
  /**
   * inherit from `FInputText.vue`
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * inherit from `FInputText.vue`
   * 
   * only work when `label` has been setted
   */
  required: {
    type: Boolean,
    default: false
  },
  /**
   * inherit from `FInputText.vue`
   */
  size: {
    type: String,
    default: 'lg'
  },
  /**
   * inherit from `FInputText.vue`
   * 
   * format: false case && error message
   */
  rules: {
    type: Array,
    default: () => []
  },
  /**
   * inherit from `FInputText.vue`
   * 
   * It turn to error state when customErrorMsg has value
   */
  customErrorMsg: {
    type: [String, Boolean],
    default: ''
  },
  type: {
    type: String,
    default: 'primary'
  },
  disabledInput: {
    type: Boolean,
    default: false
  },
  disabledBtn: {
    type: Boolean,
    default: false
  },
  buttonLabel: {
    type: String,
    default: ''
  }
})
const btnSize = computed(() => {
  switch (props.size) {
    case 'lg':
      return ['text-body2', 'min-w-21.5', 'h-11', 'px-5']
    case 'sm':
      return ['text-body2', 'min-w-14', 'h-9', 'px-4']
  }
})

const btnType = computed(() => {
  switch (props.type) {
    case 'primary':
      return ['bg-primary-400', 'text-grey-0', 'disabled:bg-grey-150', 'hover:bg-primary-500']
    case 'secondary':
      return ['bg-grey-0', 'text-primary-400', 'disabled:text-grey-200', 'border', 'border-grey-150', 'hover:text-primary-500']
  }
})

const innerTextValue = computed({
  get: () => props.textValue,
  set: (v) => emit('update:textValue', v)
})
</script>
