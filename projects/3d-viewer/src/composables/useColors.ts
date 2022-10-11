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
  baseImgUrl: string,
  material: Ref<THREE.MeshStandardMaterial | undefined>,
  maxColorCount: number
) {
  const img = ref<HTMLImageElement>()
  const canvas = ref<HTMLCanvasElement>()

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

  const updateMaterial = () => {
    if (!material.value?.map || !canvas.value) return
    const originTexture = material.value.map
    const changedTexture = new THREE.TextureLoader().load(
      canvas.value.toDataURL()
    )

    changedTexture.wrapS = originTexture.wrapS
    changedTexture.wrapT = originTexture.wrapT
    changedTexture.repeat.set(originTexture.repeat.x, originTexture.repeat.y)
    changedTexture.flipY = originTexture.flipY
    changedTexture.needsUpdate = true

    material.value.map = changedTexture
  }

  const analyzeImage = () => {
    if (!img.value || !canvas.value) return

    const timerName = 'analyze'
    console.time(timerName)

    const ctx = canvas.value.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img.value, 0, 0)

    const q = new RgbQuant({ colors: paletteColorCount.value, minHueCols: 256 })
    q.sample(canvas.value)
    const palette = q.palette(true) as PixelRgb

    originImageData.value = ctx.getImageData(
      0,
      0,
      canvas.value.width,
      canvas.value.height
    )
    currentImageData.value = originImageData.value

    originColors.value = palette.map((color) => chroma(color).hex())
    currentColors.value = originColors.value

    reducerOut.value = q.reduce(canvas.value, 1)
    console.timeEnd(timerName)

    updateMaterial()
  }

  const handleColorAdd = () => {
    if (colorAddable.value) paletteColorCount.value++
  }

  const handleColorRemove = () => {
    if (colorRemovable.value) paletteColorCount.value--
  }

  const handleColorChange = (targetColor: string, index: number) => {
    if (
      !canvas.value ||
      !targetColor ||
      !currentColors.value[index] ||
      !reducerOut.value
    ) {
      return
    }

    currentColors.value = [...currentColors.value]
    currentColors.value[index] = targetColor

    if (!img.value) return
    if (!currentImageData.value) return
    if (!originImageData.value) return

    const originColor = chroma(originColors.value[index]).rgba()
    const diff = getDiff(chroma(originColor).rgba(), chroma(targetColor).rgba())

    const reduceOutPixelsValue = reducerOut.value

    const timerName = 'change color'
    console.time(timerName)
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
    console.timeEnd(timerName)

    const ctx = canvas.value.getContext('2d')
    if (!ctx) return

    currentImageData.value = new ImageData(
      new Uint8ClampedArray(processedImageDataContent),
      currentImageData.value.width,
      currentImageData.value.height,
      { colorSpace: currentImageData.value.colorSpace }
    )
    ctx.putImageData(currentImageData.value, 0, 0)
    updateMaterial()
  }

  const handleColorInput = debounce(handleColorChange, 200)

  watch(paletteColorCount, analyzeImage)

  const initCanvas = () => {
    if (!img.value) return
    canvas.value = document.createElement('canvas')
    canvas.value.width = img.value.naturalWidth
    canvas.value.height = img.value.naturalHeight
    analyzeImage()
  }

  onMounted(() => {
    img.value = document.createElement('img')
    img.value.src = baseImgUrl
    img.value.crossOrigin = 'anonymous'
    img.value.onload = initCanvas
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
    analyzeImage,
    handleColorChange,
    handleColorInput,
    handleColorAdd,
    handleColorRemove,
  }
}
