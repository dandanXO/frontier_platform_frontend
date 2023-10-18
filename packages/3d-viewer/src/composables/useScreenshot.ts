import type * as THREE from 'three'
import { takeScreenshotByCanvas } from '@frontier/lib'
import { toRaw, type Ref } from 'vue'
import { setupRenderer, setupScreenshotScene } from '../utils/scene'

const useScreenshot = (
  camera: Ref<THREE.Camera | undefined>,
  canvas: Ref<HTMLCanvasElement | undefined>,
  model: Ref<THREE.Group | undefined>
) => {
  /**
   * 使用者提的需求，使用 3D Viewer 截圖功能時：
   * 1. 移除原有場景的背景、地板，輸出的圖片除了 model 主體以外須為透明 （alpha）
   * 2. 移除原有光源並加入新的光源，新光源位置、指向需和相機一致（相機在哪光源就在哪，相機看哪光源就往哪裡照）
   */
  const takeScreenshot = () => {
    if (!camera.value) {
      throw new Error('camera undefined')
    }
    if (!canvas.value) {
      throw new Error('canvas undefined')
    }
    if (!model.value) {
      throw new Error('model undefined')
    }

    const screenshotCanvas = document.createElement('canvas')
    const screenshotRenderer = setupRenderer(screenshotCanvas, true)
    const screenshotCamera = toRaw(camera.value).clone()
    const screenshotScene = setupScreenshotScene(
      screenshotCamera,
      toRaw(model.value)
    )

    screenshotRenderer.setSize(
      canvas.value.clientWidth,
      canvas.value.clientHeight,
      false
    )
    screenshotRenderer.render(screenshotScene, screenshotCamera)

    return takeScreenshotByCanvas(screenshotCanvas)
  }

  return { takeScreenshot }
}

export default useScreenshot
