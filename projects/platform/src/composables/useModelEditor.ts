import { ref, unref } from 'vue'
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

const useModelEditor = (u3m: Ref<U3M> | U3M) => {
  const store = useStore()
  const isOpen = ref(false)

  const closeModalModelEditor = () => {
    if (!isOpen.value) return
    store.dispatch('helper/closeModalBehavior')
    isOpen.value = false
  }

  const openModalModelEditor = () => {
    const u3mValue = unref(u3m)
    if (isOpen.value || u3mValue.status !== U3M_STATUS.COMPLETED) {
      return
    }

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

  // 因為使用空白鍵作為快捷鍵會跟 edit asset 的 input 衝突，
  // 導致使用者無法在 input 輸入空白鍵。
  // 這裡先註解掉快捷鍵功能，等到討論出適合平台整體使用的 keyboard shortcut 後再加回來並修改。
  // const keyDownHandler = (e: KeyboardEvent) => {
  //   if (
  //     useKeyboard &&
  //     e.key === ' ' &&
  //     unref(u3m).status === U3M_STATUS.COMPLETED &&
  //     !isOpen.value
  //   ) {
  //     openModalModelEditor()
  //     e.preventDefault()
  //   }
  // }

  // onMounted(() => window.addEventListener('keydown', keyDownHandler))
  // onUnmounted(() => window.removeEventListener('keydown', keyDownHandler))

  return { openModalModelEditor, closeModalModelEditor }
}

export default useModelEditor
