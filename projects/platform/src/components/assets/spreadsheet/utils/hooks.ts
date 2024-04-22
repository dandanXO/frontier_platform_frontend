import { onMounted, onBeforeUnmount, ref } from 'vue'

/**
 * useIMEComposition is a Vue composition function that tracks the state of IME (Input Method Editor) composition.
 * It provides a reactive reference that is `true` when IME composition is happening and `false` otherwise.
 * This is useful for handling keyboard events differently during IME composition.
 *
 * @returns {Ref<boolean>} A reactive reference that is `true` when IME composition is happening and `false` otherwise.
 */
export function useIMEComposition() {
  const isComposing = ref(false)

  const handleCompositionStart = () => {
    isComposing.value = true
  }

  const handleCompositionEnd = () => {
    isComposing.value = false
  }

  onMounted(() => {
    document.addEventListener('compositionstart', handleCompositionStart)
    document.addEventListener('compositionend', handleCompositionEnd)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('compositionstart', handleCompositionStart)
    document.removeEventListener('compositionend', handleCompositionEnd)
  })

  return isComposing
}

export function useReadOnly() {
  const readOnly = ref(false)

  const setReadOnly = (value: boolean) => {
    readOnly.value = value
  }

  return {
    readOnly,
    setReadOnly,
  }
}
