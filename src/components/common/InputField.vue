<template lang="pug">
label(class="h-11 pl-5 border border-black-400 rounded-md flex items-center"
    :class="[isFocus ? 'border-primary' :'border-black-400']"
  )
  svg-icon(
    v-if="prependIcon !== ''"
    :iconName="prependIcon" :color="isFocus || !isEmpty ? 'primary' : 'black-400'"
    class="mr-1"
  )
  input(
    :type="inputType"
    :value="value"
    :placeholder="placeholder"
    @input="typing"
    @focus="focusHandler"
    @blur="blurHandler"
    class="flex-grow outline-none overflow-hidden placeholder-black-400 text-primary text-body1 bg-transparent"
    autocomplete
  )
  slot(name="appendIcon")
</template>

<script>
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
export default {
  name: 'InputField',
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
