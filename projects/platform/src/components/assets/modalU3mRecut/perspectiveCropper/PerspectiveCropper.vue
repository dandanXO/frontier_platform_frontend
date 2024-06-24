<template lang="pug">
div(class="h-full flex flex-col")
  div(class="flex-1 flex flex-row gap-x-6 items-stretch px-7.5")
    div(class="dark relative flex-1 flex flex-col" @click="handleAreaClick('edit')")
      div(class="flex-1 rounded-lg bg-grey-900 overflow-hidden")
        div(
          ref="sourceCanvasContainer"
          class="relative w-full h-full bg-grey-900"
          @mousemove="sourceCanvasContainerHandleMouseMove"
          @mouseleave="sourceCanvasContainerHideLines"
        )
          div(
            ref="refHorizontalLine"
            class="absolute w-full h-[1px] bg-grey-100 z-30 pointer-events-none"
            :style="{ top: coords.y + 'px', display: coords.show ? 'block' : 'none' }"
          )
          div(
            ref="refVerticalLine"
            class="absolute h-full w-[1px] bg-grey-100 z-30 pointer-events-none"
            :style="{ left: coords.x + 'px', display: coords.show ? 'block' : 'none' }"
          )
          div(class="flex w-full absolute z-1 pointer-events-none")
            div(class="w-[50px] h-[50px] bg-grey-800")
            div(ref="RefRoulerH" class="w-full h-[50px] absolute left-[50px]")
          div(
            class="flex w-full flex-col h-full absolute top-[50px] z-1 pointer-events-none"
          )
            div(ref="RefRoulerV" class="h-full w-[50px]")
          perspective-canvas(
            ref="refPerspectiveCanvas"
            v-if="sourceCanvasContainer && sourceImage && downSampledCanvases"
            :container="sourceCanvasContainer"
            :sourceImage="sourceImage"
            :downSampleScales="downSampleScales"
            :downSampledCanvases="downSampledCanvases"
            :dpi="props.side.config.dpi"
            :restoreRecord="props.side.image.u3mCropRecord.perspectiveCropRecord"
            :initialRecord="props.side.perspectiveCropRecord"
            :gridColor="sourceGridColor"
            @rotateDegChange="handleRotateDegChange"
            @scaleChange="handleSourceScaleChange"
            @cropStart="handleCropStart"
            @cropSuccess="handleCropSuccess"
            @editStatusChange="emit('update:editStatus', $event)"
          )
        canvas-control(
          :zoom="sourceScale"
          :zoomBlockList="zoomBlockList"
          :gridColor="sourceGridColor"
          @zoomAdd="handleSourceZoomAdd"
          @zoomMinus="handleSourceZoomMinus"
          @update:gridColor="handleSourceGridColorChange"
          @update:zoom="handleSourceZoomUpdate"
        )
      div(
        class="box-border absolute left-0 top-0 w-full h-full rounded-lg border-grey-500 pointer-events-none"
        :class="{ 'border-2': activeArea === 'edit' }"
      )
      div(
        v-if="!side.perspectiveEditStatus.isSizeValid || !side.perspectiveEditStatus.isDirectionValid"
        class="absolute bottom-5 left-1/2 -translate-x-1/2 margin-auto"
      )
        notify-bar(v-if="!side.perspectiveEditStatus.isDirectionValid") {{ $t('WW0125') }}
        notify-bar(v-else-if="!side.perspectiveEditStatus.isSizeValid") {{ $t('WW0124') }}
    div(class="relative flex-1 flex flex-col" @click="handleAreaClick('preview')")
      div(class="flex-1 rounded-lg bg-grey-900 overflow-hidden")
        div(ref="previewCanvasContainer" class="relative w-full h-full bg-grey-900")
      template(v-if="previewDisplay")
        canvas-control(
          useGridToggle
          :zoom="previewScale"
          :zoomBlockList="zoomBlockList"
          :gridColor="previewGridColor"
          :gridOpen="gridOpen"
          @zoomAdd="handlePreviewZoomAdd"
          @zoomMinus="handlePreviewZoomMinus"
          @toggleGrid="handleTogglePreviewGrid"
          @update:gridColor="handlePreviewGridColorChange"
          @update:zoom="handlePreviewZoomUpdate"
        )
      div(
        class="box-border absolute left-0 top-0 w-full h-full rounded-lg border-grey-500 pointer-events-none"
        :class="{ 'border-2': activeArea === 'preview' }"
      )
  div(class="bg-grey-800 flex flex-row items-center justify-center h-17")
    div(class="flex-1 flex flex-row items-center justify-center gap-4 text-grey-150")
      div(class="flex flex-row items-center gap-x-4")
        dimension-info(
          v-if="sourceDimension"
          iconName="crop_original"
          :text="$t('EE0154')"
          :dimension="sourceDimension"
        )
        info-divider(size="lg")
        div(class="flex flex-row items-center gap-x-2")
          dimension-info(
            v-if="destinationDimension"
            iconName="crop"
            :text="$t('EE0150')"
            :dimension="destinationDimension"
          )
          f-button-label(
            :theme="THEME.DARK"
            :size="SIZE.LG"
            :disabled="!side.perspectiveEditStatus.isPositionsDirty"
            @click="handlePositionReset"
          ) {{ $t('RR0255') }}
        info-divider(size="lg")
      div(class="flex flex-row items-center gap-x-3")
        info-name(iconName="rotate" :text="$t('EE0049')")
        div(class="flex flex-row items-center gap-2")
          f-button-label(
            :theme="THEME.DARK"
            :size="SIZE.LG"
            @click="handleRotate(270)"
          ) {{ $t('EE0155', { degree: '90°' }) }}
          f-button-label(
            :theme="THEME.DARK"
            :size="SIZE.LG"
            @click="handleRotate(90)"
          ) {{ $t('EE0156', { degree: '90°' }) }}
          f-button-label(
            :theme="THEME.DARK"
            :size="SIZE.LG"
            @click="handleRotate(180)"
          ) 180°
          f-input-slider(
            ref="rotateDegSliderRef"
            :canReset="false"
            class="w-80"
            :range="rotateDeg"
            @update:range="chagneRotateInSlider"
            v-bind="scaleSetting"
            :theme="THEME.LIGHT"
            withInput
          )
          f-button-label(
            :disabled="!side.perspectiveEditStatus.isRotationDirty"
            :theme="THEME.DARK"
            :size="SIZE.LG"
            @click="handleResetRotate"
          ) {{ $t('RR0255') }}
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRaw, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Decimal from 'decimal.js'
import usePreview from '@/composables/usePreview'
import PerspectiveCanvas from '@/components/assets/modalU3mRecut/perspectiveCropper/PerspectiveCanvas.vue'
import Ruler from '@scena/ruler'
import CanvasControl from '@/components/assets/modalU3mRecut/perspectiveCropper/CanvasControl.vue'
import DimensionInfo from '@/components/assets/modalU3mRecut/perspectiveCropper/DimensionInfo.vue'
import InfoDivider from '@/components/assets/modalU3mRecut/perspectiveCropper/InfoDivider.vue'
import InfoName from '@/components/assets/modalU3mRecut/perspectiveCropper/InfoName.vue'
import NotifyBar from '@/components/assets/modalU3mRecut/perspectiveCropper/NotifyBar.vue'
import {
  CROPPER_GRID_COLORS,
  NOTIFY_TYPE,
  THEME,
  SIZE,
} from '@/utils/constants'
import { toDP2, cmToPixel } from '@/utils/cropper'
import { getDimension, preRender } from '@/utils/perspectiveCropper'
import tempFilenameGenerator from '@/utils/temp-filename-generator'
import type {
  U3mSide,
  EditStatus,
  Dimension,
  PerspectiveCropRecord,
} from '@/types'

const props = defineProps<{
  side: U3mSide
}>()

const emit = defineEmits<{
  (e: 'update:editStatus', editStatus: EditStatus): void
}>()

const downSampleScales = [0.1, 0.15, 0.3, 0.5]

const store = useStore()
const { t } = useI18n()

const dpi = toRaw(props.side.config.dpi)
// https://daybrush.com/ruler/release/latest/doc/
// 1cm = 37.7952px
// zoom: 37.7952
// unit: 1 (every 1cm)
const rulerPixelCM = 37.7952
const coords = ref({ x: 0, y: 0, show: false })
const RefRoulerH = ref<HTMLDivElement>()
const RefRoulerV = ref<HTMLDivElement>()
const hRuler = ref()
const vRuler = ref()
const rotateDeg = ref(0)
const rotateDegSliderRef = ref()
const scaleSetting = {
  defaultRange: 0,
  max: 360,
  min: 0,
  step: 0.1,
  tooltips: false,
}
const sourceCanvasContainer = ref<HTMLDivElement>()
const previewCanvasContainer = ref<HTMLDivElement>()
const destinationCanvas = ref<HTMLCanvasElement>()
const destinationImage = ref<HTMLImageElement>(new Image())
const destinationCropRecord = ref<PerspectiveCropRecord>()
const refPerspectiveCanvas = ref<InstanceType<typeof PerspectiveCanvas> | null>(
  null
)

const defaultGridColor = CROPPER_GRID_COLORS[11].color
const sourceGridColor = ref(defaultGridColor)
const previewGridColor = ref(defaultGridColor)

const sourceScale = ref(0)
const previewScale = ref(0)
const gridOpen = ref(true)
const destinationDimension = ref<Dimension>()
const activeArea = ref<'edit' | 'preview'>('edit')

const sourceImage = ref<HTMLImageElement>()
const downSampledCanvases = ref<HTMLCanvasElement[]>()

const sourceDimension = computed(() => {
  if (!sourceImage.value) {
    return null
  }
  return getDimension(sourceImage.value.width, sourceImage.value.height, dpi)
})

const sourceCanvasContainerHandleMouseMove = (event: any) => {
  const rect = sourceCanvasContainer.value?.getBoundingClientRect()

  coords.value.x = event.clientX - (rect?.left || 0)
  coords.value.y = event.clientY - (rect?.top || 0)
  coords.value.show = true
}
const sourceCanvasContainerHideLines = () => {
  coords.value.show = false
}
const errorHandler = (err: Error) => {
  console.error(err)
  store.dispatch('helper/openModalConfirm', {
    type: NOTIFY_TYPE.ALERT,
    header: t('RR0107'),
    contentText: t('RR0108', { code: 500 }),
    primaryBtnText: t('UU0031'),
    primaryBtnHandler: () => window.location.reload(),
  })
}
const { previewDisplay, renderPreviewDisplay } = usePreview(
  destinationCanvas,
  previewCanvasContainer,
  previewGridColor.value,
  (v) => (previewScale.value = v),
  errorHandler
)

const ZOOM_TYPES = {
  ZOOM_TO_FIT: t('EE0152'),
  ZOOM_TO_6: t('EE0153', { rate: '6%' }),
  ZOOM_TO_12: t('EE0153', { rate: '12%' }),
  ZOOM_TO_25: t('EE0153', { rate: '25%' }),
  ZOOM_TO_50: t('EE0153', { rate: '50%' }),
  ZOOM_TO_100: t('EE0153', { rate: '100%' }),
  ZOOM_TO_200: t('EE0153', { rate: '200%' }),
  ZOOM_TO_400: t('EE0153', { rate: '400%' }),
}

const zoomBlockList = [
  { menuList: [{ title: ZOOM_TYPES.ZOOM_TO_FIT }] },
  {
    menuList: [
      { title: ZOOM_TYPES.ZOOM_TO_6 },
      { title: ZOOM_TYPES.ZOOM_TO_12 },
      { title: ZOOM_TYPES.ZOOM_TO_25 },
      { title: ZOOM_TYPES.ZOOM_TO_50 },
      { title: ZOOM_TYPES.ZOOM_TO_100 },
      { title: ZOOM_TYPES.ZOOM_TO_200 },
      { title: ZOOM_TYPES.ZOOM_TO_400 },
    ],
  },
]

const getSourceImageWithDownSampled = async (
  imageUrl: string,
  downSampleScales: number[]
): Promise<{
  sourceImage: HTMLImageElement
  downSampledCanvases: HTMLCanvasElement[]
}> => {
  const downSampledCanvases = downSampleScales.map(() =>
    document.createElement('canvas')
  )

  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.src = imageUrl
      img.crossOrigin = 'anonymous'
      img.onload = async () => {
        await preRender(img, downSampleScales, downSampledCanvases)
        resolve({
          sourceImage: img,
          downSampledCanvases,
        })
      }
    } catch (err) {
      if (err instanceof Error) {
        return reject(err)
      }
    }
  })
}
const handleRotateDegChange = (v: number) => {
  rotateDeg.value = v
}

const handleSourceScaleChange = (cm: number) => {
  hRuler.value.zoom = cmToPixel(cm, dpi)
  vRuler.value.zoom = cmToPixel(cm, dpi)

  return (sourceScale.value = cm)
}

const handleCropStart = () => {
  store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })
}

const handleCropSuccess = (result: {
  canvas: HTMLCanvasElement
  record: PerspectiveCropRecord
}) => {
  destinationDimension.value = getDimension(
    result.canvas.width,
    result.canvas.height,
    dpi
  )
  destinationCanvas.value = result.canvas
  destinationCropRecord.value = result.record
  renderPreviewDisplay()
  store.dispatch('helper/closeModalLoading', { theme: THEME.DARK })
}

const step = 0.01
const stepAdd = (v: number) => toDP2(new Decimal(v).add(step))
const stepMinus = (v: number) => toDP2(new Decimal(v).sub(step))

const handleAreaClick = (area: 'edit' | 'preview') => {
  activeArea.value = area
}

const handleRotate = (deg: number) => {
  if (!refPerspectiveCanvas.value) {
    return
  }
  refPerspectiveCanvas.value.rotate(
    (refPerspectiveCanvas.value.rotateDeg + deg) % 360
  )
}

const handleResetRotate = () => {
  if (!refPerspectiveCanvas.value) {
    return
  }
  refPerspectiveCanvas.value.resetRotation()
}

const handlePositionReset = () => {
  if (!refPerspectiveCanvas.value) {
    return
  }
  refPerspectiveCanvas.value.resetPositions()
}

const handleSourceGridColorChange = (hex: string) => {
  sourceGridColor.value = hex
}

const handleSourceZoomAdd = () => {
  if (!refPerspectiveCanvas.value) {
    return
  }
  const newScale = stepAdd(sourceScale.value)
  refPerspectiveCanvas.value.setScale(newScale)
}

const handleSourceZoomMinus = () => {
  if (!refPerspectiveCanvas.value || sourceScale.value <= 0.01) {
    return
  }
  const newScale = stepMinus(sourceScale.value)
  refPerspectiveCanvas.value.setScale(newScale)
}

const handleSourceZoomUpdate = (type: string) => {
  if (!refPerspectiveCanvas.value) {
    return
  }
  switch (type) {
    case ZOOM_TYPES.ZOOM_TO_FIT:
      return refPerspectiveCanvas.value.zoomToFit()
    case ZOOM_TYPES.ZOOM_TO_6:
      return refPerspectiveCanvas.value.setScale(0.06)
    case ZOOM_TYPES.ZOOM_TO_12:
      return refPerspectiveCanvas.value.setScale(0.12)
    case ZOOM_TYPES.ZOOM_TO_25:
      return refPerspectiveCanvas.value.setScale(0.25)
    case ZOOM_TYPES.ZOOM_TO_50:
      return refPerspectiveCanvas.value.setScale(0.5)
    case ZOOM_TYPES.ZOOM_TO_100:
      return refPerspectiveCanvas.value.setScale(1)
    case ZOOM_TYPES.ZOOM_TO_200:
      return refPerspectiveCanvas.value.setScale(2)
    case ZOOM_TYPES.ZOOM_TO_400:
      return refPerspectiveCanvas.value.setScale(4)
    default:
      return
  }
}

const handleTogglePreviewGrid = () => {
  gridOpen.value = previewDisplay.value?.toggleGrid() || false
}

const handlePreviewGridColorChange = (hex: string) => {
  previewGridColor.value = hex
}

const handlePreviewZoomAdd = () => {
  if (!previewDisplay.value) {
    return
  }
  const newScale = stepAdd(previewScale.value)
  previewDisplay.value.setScale(newScale)
}

const handlePreviewZoomMinus = () => {
  if (!previewDisplay.value || sourceScale.value <= 0.01) {
    return
  }
  const newScale = stepMinus(previewScale.value)
  previewDisplay.value.setScale(newScale)
}

const handlePreviewZoomUpdate = (type: string) => {
  if (!previewDisplay.value) {
    return
  }
  switch (type) {
    case ZOOM_TYPES.ZOOM_TO_FIT:
      return previewDisplay.value.zoomToFit()
    case ZOOM_TYPES.ZOOM_TO_6:
      return previewDisplay.value.setScale(0.06)
    case ZOOM_TYPES.ZOOM_TO_12:
      return previewDisplay.value.setScale(0.12)
    case ZOOM_TYPES.ZOOM_TO_25:
      return previewDisplay.value.setScale(0.25)
    case ZOOM_TYPES.ZOOM_TO_50:
      return previewDisplay.value.setScale(0.5)
    case ZOOM_TYPES.ZOOM_TO_100:
      return previewDisplay.value.setScale(1)
    case ZOOM_TYPES.ZOOM_TO_200:
      return previewDisplay.value.setScale(2)
    case ZOOM_TYPES.ZOOM_TO_400:
      return previewDisplay.value.setScale(4)
    default:
      return
  }
}
const chagneRotateInSlider = (val) => {
  refPerspectiveCanvas?.value?.rotate(val || 0)
}

watch(
  () => rotateDeg.value,
  (v) => {
    rotateDegSliderRef?.value?.setValue(v)
  }
)
watch(previewGridColor, () => {
  previewDisplay.value?.setGridColor(previewGridColor.value)
})

onMounted(async () => {
  hRuler.value = new Ruler(RefRoulerH.value as HTMLDivElement, {
    type: 'horizontal',
    zoom: rulerPixelCM,
    unit: 1,
    height: 50,
  })
  vRuler.value = new Ruler(RefRoulerV.value as HTMLDivElement, {
    type: 'vertical',
    zoom: rulerPixelCM,
    unit: 1,
    width: 50,
  })
})
onMounted(async () => {
  store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })
  const result = await getSourceImageWithDownSampled(
    props.side.config.image.src,
    downSampleScales
  )
  sourceImage.value = result.sourceImage
  downSampledCanvases.value = result.downSampledCanvases
  store.dispatch('helper/closeModalLoading', { theme: THEME.DARK })
})

onUnmounted(() => {
  if (destinationImage.value.src) {
    URL.revokeObjectURL(destinationImage.value.src)
  }
})

const cropImage = async () => {
  const imageFile = await new Promise<File>((resolve, reject) => {
    if (!destinationCanvas.value) {
      throw new Error('destinationCanvas undefined')
    }

    destinationCanvas.value.toBlob((blob) => {
      if (!blob) {
        return reject('no blob')
      }

      if (destinationImage.value.src) {
        URL.revokeObjectURL(destinationImage.value.src)
      }
      destinationImage.value.src = URL.createObjectURL(blob)
      const fileName = `${tempFilenameGenerator()}.jpeg`
      resolve(new File([blob], fileName, { type: 'image/jpeg' }))
    }, 'image/jpeg')
  })

  return { imageFile, cropRecord: destinationCropRecord.value }
}

const restore = () => refPerspectiveCanvas.value?.restore()

defineExpose({ cropImage, restore })
</script>
