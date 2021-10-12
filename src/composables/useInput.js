import { ref } from '@vue/reactivity'
import { computed, watch, onUpdated } from '@vue/runtime-core'
import inputRules from '@/utils/input-rules'

export default function useInput ({ context: { emit, slots }, inputType, textValue, disabled = ref(false), rules = ref([]), required = ref(false), customErrorMsg = ref('') }) {
  const isFocus = ref(false)

  const isEmpty = computed(() => {
    return textValue.value === ''
  })

  const classBorder = computed(() => {
    if (disabled.value) {
      return 'border-transparent'
    }
    if (isError.value) {
      return 'border-warn'
    }
    return isFocus.value
      ? 'border-black-600'
      : 'border-black-400'
  })
  const classPrependIcon = computed(() => {
    if (disabled.value) {
      return 'text-black-600'
    }
    return isFocus.value || !isEmpty.value
      ? 'text-primary'
      : 'text-black-500'
  })

  const typing = (e) => {
    let value = e.target.value
    if (inputType.value === 'number') {
      value = Number(value)
    }
    emit('update:textValue', value)
  }

  const onFocus = () => {
    isFocus.value = true
  }

  const onBlur = () => {
    isFocus.value = false
    emit('blur')
  }

  const clear = () => {
    emit('update:textValue', '')
  }

  const isError = ref(false)
  const ruleErrorMsg = ref('')
  const errorMsg = computed(() => {
    if (ruleErrorMsg.value !== '') {
      return ruleErrorMsg.value
    }
    return customErrorMsg.value
  })

  if (required.value || rules.value.length > 0) {
    watch(
      () => textValue.value,
      (v) => {
        const _rules = [...rules.value]
        if (required.value) {
          _rules.unshift(inputRules.required())
        }
        for (let i = 0; i < _rules.length; i++) {
          const rule = _rules[i]
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
    isError,
    onFocus,
    onBlur,
    clear,
    isEmpty,
    typing,
    classBorder,
    classPrependIcon,
    errorMsg
  }
}
