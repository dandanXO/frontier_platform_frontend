<template lang="pug">
f-input-text(v-bind="props" v-model:textValue="innerTextValue" :inputType="isVisible ? 'text' : 'password'" prependIcon="lock")
  template(#slot:appendItem)
    div(class="h-full flex items-center")
      f-svg-icon(
        size="20"
        :class="[isVisible ? 'text-grey-900' : 'text-grey-200']"
        :iconName="isVisible ? 'openeye' : 'hideeye'"
        @click="isVisible = !isVisible"
      )
</template>

<script>
export default {
  name: 'FInputPassword'
}
</script>


<script setup>
import { ref, computed } from '@vue/reactivity'

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
  /**
   * inherit from `FInputText.vue`
   */
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:textValue'])

const isVisible = ref(false)

const innerTextValue = computed({
  get: () => props.textValue,
  set: (v) => emit('update:textValue', v)
})
</script>
