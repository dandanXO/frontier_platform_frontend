import { computed, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import chroma from 'chroma-js'
import RgbQuant from 'rgbquant'
import { clamp, indexBy, prop } from 'ramda'
import { debounce } from 'debounce'
import colorApi from '../apis/color'
import type { Ref } from 'vue'

export interface PantoneItem {
  pantoneId: number
  r: number
  g: number
  b: number
  display: string
  name: string
  colorName: string
  majorColorName: string
}

export type PixelRgb = [number, number, number]
export type PixelRgba = [number, number, number, number]

export const add = (c1: number, c2: number) => clamp(0, 255, c1 + c2)

export const getDiff = (
  originColor: PixelRgba,
  targetColor: PixelRgba
): PixelRgba => {
  return targetColor.map((t, i) => t - originColor[i]) as PixelRgba
}

export default function useColors(
  material: Ref<THREE.MeshStandardMaterial | undefined>,
  baseTexture: Ref<THREE.Texture | undefined>,
  baseImage: Ref<HTMLImageElement | undefined>,
  maxColorCount: number
) {
  const baseTextureCanvas = ref<HTMLCanvasElement>()
  const paletteColorCount = ref<number>(1)
  const originColors = ref<string[]>([])
  const currentColors = ref<string[]>(['#ffffff'])
  const originImageData = ref<ImageData>()
  const currentImageData = ref<ImageData>()
  const reducerOut = ref<number[]>()
  const pantoneList = ref<{ [code: string]: PantoneItem }>()

  const colorAddable = computed(
    () => currentColors.value.length < maxColorCount
  )
  const colorRemovable = computed(() => currentColors.value.length > 1)

  const analyzeImage = () => {
    if (!baseTextureCanvas.value) return

    const timerName = 'analyze image colors'
    console.time(timerName)

    const analyzeCanvas = document.createElement('canvas')
    analyzeCanvas.width = baseTextureCanvas.value.width
    analyzeCanvas.height = baseTextureCanvas.value.height
    const ctx = analyzeCanvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(baseTextureCanvas.value, 0, 0)

    const q = new RgbQuant({ colors: paletteColorCount.value, minHueCols: 256 })
    q.sample(analyzeCanvas)
    const palette = q.palette(true) as PixelRgb

    originImageData.value = ctx.getImageData(
      0,
      0,
      analyzeCanvas.width,
      analyzeCanvas.height
    )
    currentImageData.value = originImageData.value

    originColors.value = palette.map((color) => chroma(color).hex())
    currentColors.value = originColors.value

    reducerOut.value = q.reduce(analyzeCanvas, 1)
    console.timeEnd(timerName)
  }

  const setMaterialTexture = (canvas: HTMLCanvasElement) => {
    const originTexture = baseTexture.value
    if (!material.value || !originTexture) return

    baseTexture.value = new THREE.TextureLoader().load(canvas.toDataURL())
    baseTexture.value.wrapS = originTexture.wrapS
    baseTexture.value.wrapT = originTexture.wrapT
    baseTexture.value.repeat.set(originTexture.repeat.x, originTexture.repeat.y)
    baseTexture.value.flipY = originTexture.flipY
    baseTexture.value.minFilter = THREE.LinearMipMapLinearFilter

    material.value.map = baseTexture.value
    material.value.needsUpdate = true
  }

  const resetMaterialTexture = () => {
    if (!baseTextureCanvas.value) return
    setMaterialTexture(baseTextureCanvas.value)
  }

  const handleColorAdd = () => {
    if (colorAddable.value) paletteColorCount.value++
  }

  const handleColorRemove = () => {
    if (colorRemovable.value) paletteColorCount.value--
  }

  const handleColorChange = (targetColor: string, index: number) => {
    if (
      !baseTextureCanvas.value ||
      !targetColor ||
      !currentColors.value[index] ||
      !reducerOut.value
    ) {
      return
    }

    currentColors.value = [...currentColors.value]
    currentColors.value[index] = targetColor

    if (!baseImage.value) return
    if (!currentImageData.value) return
    if (!originImageData.value) return

    const originColor = chroma(originColors.value[index]).rgba()
    const diff = getDiff(chroma(originColor).rgba(), chroma(targetColor).rgba())

    const reduceOutPixelsValue = reducerOut.value

    const changeColorTimerName = 'change color'
    console.time(changeColorTimerName)
    const processedImageDataContent = new Uint8ClampedArray(
      currentImageData.value.data.length
    )
    for (let i = 0; i < currentImageData.value.data.length; i += 4) {
      if (
        reduceOutPixelsValue[i] === originColor[0] &&
        reduceOutPixelsValue[i + 1] === originColor[1] &&
        reduceOutPixelsValue[i + 2] === originColor[2]
      ) {
        processedImageDataContent[i] = add(
          originImageData.value.data[i],
          diff[0]
        )
        processedImageDataContent[i + 1] = add(
          originImageData.value.data[i + 1],
          diff[1]
        )
        processedImageDataContent[i + 2] = add(
          originImageData.value.data[i + 2],
          diff[2]
        )
        processedImageDataContent[i + 3] = add(
          originImageData.value.data[i + 3],
          diff[3]
        )
      } else {
        processedImageDataContent[i] = currentImageData.value.data[i]
        processedImageDataContent[i + 1] = currentImageData.value.data[i + 1]
        processedImageDataContent[i + 2] = currentImageData.value.data[i + 2]
        processedImageDataContent[i + 3] = currentImageData.value.data[i + 3]
      }
    }
    console.timeEnd(changeColorTimerName)

    const changedColorCanvas = document.createElement('canvas')
    changedColorCanvas.width = baseImage.value.naturalWidth
    changedColorCanvas.height = baseImage.value.naturalHeight
    const ctx = changedColorCanvas.getContext('2d')
    if (!ctx) return

    currentImageData.value = new ImageData(
      new Uint8ClampedArray(processedImageDataContent),
      currentImageData.value.width,
      currentImageData.value.height,
      { colorSpace: currentImageData.value.colorSpace }
    )
    ctx.putImageData(currentImageData.value, 0, 0)
    setMaterialTexture(changedColorCanvas)
  }

  const handleColorInput = debounce(handleColorChange, 200)

  watch([paletteColorCount, baseTextureCanvas], () => {
    analyzeImage()
    resetMaterialTexture()
  })

  watch(baseImage, () => {
    if (!baseImage.value) return
    baseTextureCanvas.value = document.createElement('canvas')
    baseTextureCanvas.value.width = baseImage.value.naturalWidth
    baseTextureCanvas.value.height = baseImage.value.naturalHeight
    const ctx = baseTextureCanvas.value.getContext('2d')
    if (!ctx) return
    ctx.drawImage(baseImage.value, 0, 0)
  })

  onMounted(async () => {
    const result = await colorApi.getPantoneColor()
    const res = result.data
    const rawPantoneList = res.result.code.pantoneList.map((p) => ({
      ...p,
      display: `${p.name} (${p.colorName})`,
    }))
    pantoneList.value = indexBy(prop('display'), rawPantoneList)
  })

  return {
    pantoneList,
    currentColors,
    colorAddable,
    colorRemovable,
    handleColorChange,
    handleColorInput,
    handleColorAdd,
    handleColorRemove,
  }
}
