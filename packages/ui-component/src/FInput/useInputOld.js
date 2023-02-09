import { ref } from 'vue'
import { computed, watch, onUpdated, onMounted } from 'vue'

export default function useInput({
  context: { emit, slots },
  inputType = ref('text'),
  textValue,
  disabled = ref(false),
  rules = ref([]),
  customErrorMsg = ref(''),
}) {
  const isFocus = ref(false)

  const isEmpty = computed(() => !textValue.value)

  const classBorder = computed(() => {
    if (disabled.value) {
      return 'border-transparent'
    }
    if (isError.value) {
      return 'border-red-400'
    }
    return isFocus.value ? 'border-grey-600' : 'border-grey-250'
  })
  const classPrependIcon = computed(() => {
    if (disabled.value) {
      return 'text-grey-600'
    }
    return isFocus.value || !isEmpty.value ? 'text-grey-900' : 'text-grey-250'
  })

  const typing = (e) => {
    let value = e.target.value
    if (inputType.value === 'number') {
      value = Number(value)
    }

    if (typeof value === 'string') {
      value = value.trim()
    }

    emit('input')
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
    const initValue = typeof textValue.value === 'number' ? 0 : ''
    emit('update:textValue', initValue)
    emit('clear')
  }

  const isError = ref(false)
  const ruleErrorMsg = ref('')
  const errorMsg = computed(() => {
    if (ruleErrorMsg.value !== '') {
      return ruleErrorMsg.value
    }
    return customErrorMsg.value
  })

  if (rules.value.length > 0) {
    watch(
      () => textValue.value,
      (v) => {
        const _rules = [...rules.value]
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
    isError.value =
      !!errorMsg.value ||
      !!customErrorMsg.value ||
      slots['slot:errorMsg'] !== undefined
  })

  onMounted(() => {
    isError.value =
      !!errorMsg.value ||
      !!customErrorMsg.value ||
      slots['slot:errorMsg'] !== undefined
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
    errorMsg,
  }
}
