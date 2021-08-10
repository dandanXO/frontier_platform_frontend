<template lang="pug">
label(class="pl-4 border border-black-400 rounded flex items-center"
    :class="[isFocus ? 'border-primary' :'border-black-400', size === 'lg' ? 'h-11' : 'h-9']"
  )
  svg-icon(
    v-if="prependIcon !== ''"
    size="24"
    :iconName="prependIcon"
    :class="[isFocus || !isEmpty ? 'text-primary' : 'text-black-400']"
    class="mr-1"
  )
  input(
    :type="inputType"
    :value="value"
    :placeholder="placeholder"
    @input="typing"
    @focus="focusHandler"
    @blur="blurHandler"
    class="flex-grow outline-none overflow-hidden placeholder-black-400 text-primary text-body1 placeholder-text-body2 bg-transparent placeholder-overflow-visible"
    autocomplete
  )
  slot(name="appendIcon")
</template>

<script>
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
export default {
  name: 'OldInputText',
  props: {
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
    }
  },
  setup (props, { emit }) {
    const isFocus = ref(false)
    const isEmpty = computed(() => props.value === '')
    const typing = (e) => {
      emit('update:value', e.target.value)
    }

    const focusHandler = () => {
      isFocus.value = true
    }
    const blurHandler = () => {
      isFocus.value = false
      emit('blur')
    }

    return {
      isFocus,
      isEmpty,
      typing,
      focusHandler,
      blurHandler
    }
  }
}
</script>
