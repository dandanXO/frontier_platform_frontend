<template lang="pug">
f-input-text(v-bind="props" v-model:textValue="innerTextValue" :disabled="disabledInput")
  template(#slot:appendItem)
    div(class="-mr-4 pl-4 h-full flex items-center")
      button(
        class="h-full rounded-r transform translate-x-0.5 flex justify-center items-center"
        :disabled="disabledIcon"
        :class="[bgType, size === 'lg' ? 'w-11 h-11' : 'w-9 h-9']"
        @click="$emit('click:icon')")
        f-svg-icon(:size="iconSize" :iconName="iconName" :class="[iconColor]")
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'FInputTextIcon',
  props: {
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
    disabledIcon: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String,
      default: 'add'
    },
    iconSize: {
      type: String,
      default: '24'
    },
    iconColor: {
      type: String,
      default: 'text-grey-0'
    }
  },
  emits: ['click:icon', 'update:textValue'],
  setup (props, { emit }) {
    const bgType = computed(() => {
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

    return {
      bgType,
      props,
      innerTextValue
    }
  }
}
</script>
