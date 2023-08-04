import { ref, unref } from 'vue'
import { useStore } from 'vuex'
import { U3M_STATUS } from '@/utils/constants'
import useLogSender from '@/composables/useLogSender'
import type { Ref } from 'vue'
import type { Material } from '@/types'
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'

interface Temp {
  materialId: number
  u3m: MaterialCustomU3m | MaterialU3m
}

const useModelEditor = (material: Ref<Material> | Material | Temp) => {
  const store = useStore()
  const logSender = useLogSender()
  const isOpen = ref(false)

  const closeModalModelEditor = () => {
    if (!isOpen.value) return
    store.dispatch('helper/closeModalBehavior')
    isOpen.value = false
  }

  const openModalModelEditor = () => {
    const { materialId, u3m } = unref(material)
    if (isOpen.value || u3m.status !== U3M_STATUS.COMPLETED) {
      return
    }
    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-model-editor',
      properties: {
        ...u3m,
        u3mPath: u3m.u3mSpecUrl,
        onClose: closeModalModelEditor,
      },
    })
    isOpen.value = true
    logSender.createViewerLog(materialId)
  }

  // 因為使用空白鍵作為快捷鍵會跟 edit asset 的 input 衝突，
  // 導致使用者無法在 input 輸入空白鍵。
  // 這裡先註解掉快捷鍵功能，等到討論出適合平台整體使用的 keyboard shortcut 後再加回來並修改。
  // const keyDownHandler = (e: KeyboardEvent) => {
  //   if (
  //     useKeyboard &&
  //     e.key === ' ' &&
  //     unref(material).u3m.status === U3M_STATUS.COMPLETED &&
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
