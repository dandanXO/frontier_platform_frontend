import { onMounted, onUnmounted, type Ref } from 'vue'
import { clamp } from 'ramda'
import { DISPLAY_MODE, TEXTURE_TYPE } from '../constants'
import type { Model } from '../constants/models'

const useKeyboard = (
  displayMode: Ref<number>,
  textureType: Ref<number>,
  models: Model[],
  modelIndex: Ref<number>,
  onChangeModel: (index: number) => void,
  onClose: () => void
) => {
  const keyDownHandler = (e: KeyboardEvent) => {
    const textureClamp = clamp(TEXTURE_TYPE.BASE, TEXTURE_TYPE.DISPLACEMENT)
    const modelClamp = clamp(0, models.length - 1)
    const handleRightKey = () => {
      if (displayMode.value === DISPLAY_MODE.TEXTURE) {
        textureType.value = textureClamp(textureType.value + 1)
      }
      if (displayMode.value === DISPLAY_MODE.MODEL) {
        onChangeModel(modelClamp(modelIndex.value + 1))
      }
    }

    const handleLeftKey = () => {
      if (displayMode.value === DISPLAY_MODE.TEXTURE) {
        textureType.value = textureClamp(textureType.value - 1)
      }
      if (displayMode.value === DISPLAY_MODE.MODEL) {
        onChangeModel(modelClamp(modelIndex.value - 1))
      }
    }

    switch (e.key) {
      case 'Escape':
        return onClose()
      case '1':
        return (displayMode.value = DISPLAY_MODE.MODEL)
      case '2':
        return (displayMode.value = DISPLAY_MODE.TEXTURE)
      case 'ArrowRight':
        return handleRightKey()
      case 'ArrowLeft':
        return handleLeftKey()
    }
  }

  onMounted(() => window.addEventListener('keydown', keyDownHandler))
  onUnmounted(() => window.removeEventListener('keydown', keyDownHandler))
}

export default useKeyboard
