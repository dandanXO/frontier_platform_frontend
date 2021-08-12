<template lang="pug">
label
  slot(name="label")
    div(v-if="label !== ''" class="flex pb-2 text-body2 font-bold")
      i(v-if="required" class="text-warn") *
      p(class="text-primary") {{label}}
  div(class="px-4 border rounded flex items-center"
      :class="[classBorder, { 'border-warn': isError }, { 'bg-primary-thin': disabled } , size === 'lg' ? 'h-11' : 'h-9']"
    )
    div(v-if="prependIcon !== ''" class="pr-1")
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
      @focus="focusHandler"
      @blur="blurHandler"
      class="flex-grow outline-none bg-transparent overflow-hidden text-primary text-body2 placeholder-black-400 placeholder-text-body2 placeholder-overflow-visible disabled:text-black-600"
      autocomplete
    )
    div(v-if="appendIcon !== '' || clearable" class="pl-1")
      slot(name="appendIcon")
        svg-icon(
          v-if="clearable && value !== ''"
          size="20"
          iconName="clear"
          class="text-black-500"
          @click="$emit('update:value', '')"
        )
  slot(name="errorMsg")
    p(v-if="errorMsg" class="text-caption text-warn pt-1") {{$t(errorMsg)}}
</template>

<script>
import { ref } from '@vue/reactivity'
import { computed, watch } from '@vue/runtime-core'
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
    customIsError: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const isFocus = ref(false)
    const errorMsg = ref('')

    const classBorder = computed(() => {
      if (props.disabled) {
        return 'border-transparent'
      }
      return isFocus.value
        ? 'border-black-600'
        : 'border-black-400'
    })
    const classPrependIcon = computed(() => {
      if (props.disabled) {
        return 'text-black-600'
      }
      return isFocus.value || !isEmpty.value
        ? 'text-primary'
        : 'text-black-500'
    })

    const isError = computed(() => props.customIsError || errorMsg.value !== '')
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

    if (props.rules.length > 0) {
      watch(
        () => props.value,
        (v) => {
          const rules = props.rules

          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i]
            const { isValid, message } = rule(v)

            if (!isValid) {
              errorMsg.value = message
              break
            } else {
              errorMsg.value = ''
            }
          }
        }
      )
    }

    return {
      isFocus,
      isEmpty,
      typing,
      focusHandler,
      blurHandler,
      errorMsg,
      isError,
      classBorder,
      classPrependIcon
    }
  }
}
</script>
