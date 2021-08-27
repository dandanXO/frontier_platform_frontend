<template lang="pug">
div(class="relative")
  slot(name="label")
    div(v-if="label !== ''" class="flex pb-2 text-body2 font-bold")
      i(v-if="required" class="text-warn") *
      p(class="text-primary") {{label}}
  div(class="px-4 border rounded flex items-center"
      :class="[classBorder, { 'border-warn': isError }, { 'bg-primary-thin': disabled } , size === 'lg' ? 'h-11' : 'h-9']"
    )
    div(v-if="prependIcon !== '' && value === ''" class="pr-1")
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
    div(v-if="appendIcon !== '' || clearable" class="pl-1 h-full")
      slot(name="appendIcon")
        div(v-if="clearable && value !== ''" class="h-full flex items-center")
          svg-icon(
            size="20"
            iconName="clear"
            class="text-black-500"
            @click="$emit('update:value', '')"
          )
  p(v-if="errorMsg !== ''" class="absolute text-caption text-warn pt-1") {{$t(errorMsg)}}
  slot(v-else name="errorMsg")
</template>

<script>
import { ref } from '@vue/reactivity'
import { computed, onUpdated, watch } from '@vue/runtime-core'
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
    customErrorMsg: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit, slots }) {
    const isFocus = ref(false)
    const isError = ref(false)
    const ruleErrorMsg = ref('')
    const isEmpty = computed(() => props.value === '')
    const errorMsg = computed(() => {
      if (ruleErrorMsg.value !== '') {
        return ruleErrorMsg.value
      }
      return props.customErrorMsg
    })

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
            const result = rule(v)

            if (typeof result !== 'boolean') {
              ruleErrorMsg.value = result
              return
            } else {
              ruleErrorMsg.value = ''
            }
          }
        }
      )
    }

    /**
     * Because attrs and slots and not reactive, so in order to apply side effects based on slots changes,
     * it have to do inside an onUpdated lifecycle hook.
     */
    onUpdated(() => {
      isError.value = errorMsg.value !== '' || slots.errorMsg !== undefined
    })

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
