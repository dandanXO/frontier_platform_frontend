import { ref, unref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { U3M_STATUS } from '@/utils/constants'
import type { Ref } from 'vue'

interface U3M {
  status: number
  dpi: number
  u3mSpecUrl: string
  normalImgUrl: string
  roughImgUrl: string
  dispImgUrl: string
}

const useModelEditor = (u3m: Ref<U3M> | U3M, useKeyboard = true) => {
  const store = useStore()
  const isOpen = ref(false)

  const closeModalModelEditor = () => {
    if (!isOpen.value) return
    store.dispatch('helper/closeModalBehavior')
    isOpen.value = false
  }

  const openModalModelEditor = () => {
    if (isOpen.value) return
    const u3mValue = unref(u3m)
    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-model-editor',
      properties: {
        ...u3mValue,
        u3mPath: u3mValue.u3mSpecUrl,
        onClose: closeModalModelEditor,
      },
    })
    isOpen.value = true
  }

  const keyDownHandler = (e: KeyboardEvent) => {
    if (
      useKeyboard &&
      e.key === ' ' &&
      unref(u3m).status === U3M_STATUS.COMPLETED &&
      !isOpen.value
    ) {
      openModalModelEditor()
      e.preventDefault()
    }
  }

  onMounted(() => window.addEventListener('keydown', keyDownHandler))
  onUnmounted(() => window.removeEventListener('keydown', keyDownHandler))

  return { openModalModelEditor, closeModalModelEditor }
}

export default useModelEditor
