import { ref, watch, onMounted, onUpdated, computed } from 'vue'

export default function useInput({
  slots,
  inputValue,
  rules = ref([]),
  hintError = ref(''),
  disabled = ref(false),
  validImmediately = false,
}) {
  const isFocus = ref(false)
  const isHover = ref(false)
  const isFilled = computed(() => {
    const v = inputValue.value
    if (v == null) {
      return false
    }
    if (Array.isArray(v)) {
      return v.length !== 0
    }
    if (typeof v === 'object') {
      return Object.keys(v).length !== 0
    }
    if (typeof v === 'string') {
      return v.length !== 0
    }
    return true
  })
  const isError = ref(false)
  const ruleErrorMsg = ref('')

  if (rules.value.length > 0) {
    watch(
      () => inputValue.value,
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
      },
      { immediate: validImmediately }
    )
  }
  /**
   * Because slots isn't reactive, the only way to detect if slots have changed is to check in onUpdate and onMounted.
   *
   */
  onUpdated(() => {
    isError.value =
      slots['slot:hint-error'] !== undefined ||
      !!ruleErrorMsg.value ||
      !!hintError.value
  })

  onMounted(() => {
    isError.value =
      slots['slot:hint-error'] !== undefined ||
      !!ruleErrorMsg.value ||
      !!hintError.value
  })

  const STATE = {
    DEFAULT: 0,
    HOVER: 1,
    FOCUS: 2,
    DISABLED: 3,
  }

  const state = computed(() => {
    if (disabled.value) {
      return STATE.DISABLED
    }
    if (isFocus.value) {
      return STATE.FOCUS
    }
    if (isHover.value) {
      return STATE.HOVER
    }

    return STATE.DEFAULT
  })

  const classTransition = computed(() => {
    switch (state.value) {
      case STATE.HOVER:
        return ['ease-in', 'duration-100']
      case STATE.FOCUS:
        return ['ease-out', 'duration-200']
      default:
        return []
    }
  })

  return {
    isFocus,
    isHover,
    isFilled,
    isError,
    ruleErrorMsg,
    state,
    STATE,
    classTransition,
  }
}
