<template lang="pug">
div(class="h-full flex flex-1 flex-col")
  div(class="flex-1 flex flex-row relative gap-x-6 items-stretch px-8 py-3")
    notify-bar(
      :show="showNotif"
      :title="notifTitle"
      @onNotifChange="onNotifChange"
      :description="notifDescription"
      :status="notifStatus"
      :showBtnClose="showNotifBtnClose"
    )
    div(class="relative flex-1 flex flex-col")
      div(class="flex-1 rounded-lg overflow-hidden")
        div(
          ref="sourceCanvasContainer"
          class="relative w-full h-full rounded-lg bg-primary"
          @mousemove="sourceCanvasContainerHandleMouseMove"
          @mouseleave="sourceCanvasContainerHideLines"
        )
          div(
            ref="refHorizontalLine"
            class="absolute w-full h-[1px] bg-white z-30 pointer-events-none"
            :style="{ top: coords.y + 'px', display: coords.show ? 'block' : 'none' }"
          )
          div(
            ref="refVerticalLine"
            class="absolute h-full w-[1px] bg-white z-30 pointer-events-none"
            :style="{ left: coords.x + 'px', display: coords.show ? 'block' : 'none' }"
          )
          div(class="flex w-full absolute z-1 pointer-events-none")
            div(class="w-[50px] h-[50px] bg-primary")
            div(ref="RefRoulerH" class="w-full h-[50px] absolute left-[50px]")
          div(
            class="flex w-full flex-col h-full absolute top-[50px] z-1 pointer-events-none"
          )
            div(ref="RefRoulerV" class="h-full w-[50px]")
          perspective-canvas(
            ref="refPerspectiveCanvas"
            v-if="sourceCanvasContainer && sourceImage && downSampledCanvases"
            :isSquare="props.isSquare"
            :isGenerateCustomResult="props.side.isQuilting || props.side.isColorBalancing"
            :container="sourceCanvasContainer"
            :sourceImage="sourceImage"
            :downSampleScales="downSampleScales"
            :downSampledCanvases="downSampledCanvases"
            :dpi="props.side.config.dpi ?? 0"
            :restoreRecord="props.side.image.u3mCropRecord.perspectiveCropRecord ?? undefined"
            :initialRecord="props.side.perspectiveCropRecord ?? undefined"
            :gridColor="gridColor"
            @generateCustomResult="handleGenerateCustomResult"
            @rotateDegChange="handleRotateDegChange"
            @scaleChange="handleSourceScaleChange"
            @cropStart="handleCropStart"
            @cropSuccess="handleCropSuccess"
            @editStatusChange="changeStatusCrop"
          )
      div(
        class="flex flex-row justify-between align-middle p-3 gap-4 bg-primary text-primary-inverse border-t border-secondary-border rounded-b-lg"
      )
        div(
          class="flex flex-row gap-2 align-middle cursor-pointer text-secondary-text"
          :onClick="restore"
        )
          f-svg-icon(iconName="restore_original_state" size="24" class="self-center")
          p(class="underline") {{ $t('RR0255') }}
        zoom-input-select(
          :value="zoomSourceValue"
          :blockList="zoomBlockList"
          @select="handleSourceZoomUpdate"
        )
    div(class="relative flex-1 flex flex-col bg-primary rounded-lg")
      div(class="flex-1 rounded-lg bg-primary overflow-hidden")
        div(ref="previewCanvasContainer" class="relative w-full h-full")
      div(
        class="flex flex-row justify-between align-middle p-3 gap-4 bg-primary text-primary-inverse border-t border-secondary-border rounded-b-lg"
      )
        div(class="flex flex-row gap-2 align-middle")
          f-input-toggle(
            :value="gridOpen"
            @update:value="handleTogglePreviewGrid"
          )
          p {{ $t('EE0160') }}
        zoom-input-select(
          :value="zoomPreviewValue"
          :blockList="zoomBlockList"
          @select="handlePreviewZoomUpdate"
        )
  div(class="bg-primary flex flex-row px-8 py-5")
    div(class="flex flex-row gap-4 text-primary-inverse align-middle justify-center h-fit")
      p(class="text-base font-bold self-center") {{ $t('EE0218') }}

      input-grid-color(
        :labelColor="gridColor"
        @update:labelColor="handleGridColorChange"
      )
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  ref,
  toRaw,
  watch,
} from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Decimal from 'decimal.js'
import Ruler from '@scena/ruler'

import type { PerspectiveCropImageRecord } from '@frontier/platform-web-sdk'
import usePreview from '@/composables/usePreview'
import PerspectiveCanvas, {
  type GenerateCustomResultParams,
} from '@/components/assets/modalU3mRecut/perspectiveCropper/PerspectiveCanvas.vue'
import NotifyBar, {
  STATUS as NOTIF_STATUS,
} from '@/components/assets/modalU3mRecut/perspectiveCropper/NotifyBar.vue'
import { NOTIFY_TYPE, THEME, useConstants } from '@/utils/constants'
import { cmToPixel } from '@/utils/cropper'
import { getDimension, preRender } from '@/utils/perspectiveCropper'
import tempFilenameGenerator from '@/utils/temp-filename-generator'
import ZoomInputSelect from '@/components/assets/modalU3mRecut/perspectiveCropper/ZoomInputSelect.vue'
import type {
  U3mSide,
  EditStatus,
  Dimension,
  PerspectiveCropRecord,
} from '@/types'
import colors from 'tailwindcss/colors'
import ModalU3mConfirm from '../../ModalU3mConfirm.vue'
import InputGridColor from './InputGridColor.vue'
import { perspectiveCropperToolTour } from '@/utils/storage'

interface Props {
  side: U3mSide
  isSquare: boolean
  handleGenerateCustomResult: (
    coordsMap: GenerateCustomResultParams
  ) => Promise<void>
}

export interface ToastParams {
  title?: string
  description?: string
  status: NOTIF_STATUS
}

const MAX_ROTATION_DEGREE = 360

const props = withDefaults(defineProps<Props>(), {
  isSquare: false,
})

const emit = defineEmits<{
  (e: 'update:editStatus', editStatus: EditStatus): void
}>()

const downSampleScales = [0.1, 0.15, 0.3, 0.5]

const store = useStore()
const { CROPPER_GRID_COLORS } = useConstants()
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
const sourceCanvasContainer = ref<HTMLDivElement>()
const previewCanvasContainer = ref<HTMLDivElement>()
const destinationCanvas = ref<HTMLCanvasElement>()
const destinationImage = ref<HTMLImageElement>(new Image())
const destinationCropRecord = ref<PerspectiveCropRecord>()
const refPerspectiveCanvas = ref<InstanceType<typeof PerspectiveCanvas> | null>(
  null
)

const defaultGridColor = CROPPER_GRID_COLORS[2].color
const gridColor = ref(defaultGridColor)

const sourceScale = ref(0)
const previewScale = ref(0)
const showNotif = ref(false)
const notifTitle = ref('')
const notifDescription = ref('')
const showNotifBtnClose = ref(false)
const notifStatus = ref<(typeof NOTIF_STATUS)[keyof typeof NOTIF_STATUS]>(
  NOTIF_STATUS.SUCCESS
)
const gridOpen = ref(true)
const destinationDimension = ref<Dimension>()

const sourceImage = ref<HTMLImageElement>()
const downSampledCanvases = ref<HTMLCanvasElement[]>()

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

const onNotifChange = (v: boolean) => {
  showNotif.value = v
}
const { previewDisplay, renderPreviewDisplay, loadImageToCanvas } = usePreview(
  destinationCanvas,
  previewCanvasContainer,
  gridColor.value,
  (v) => (previewScale.value = v),
  errorHandler
)

const changeStatusCrop = (status: EditStatus) => {
  emit('update:editStatus', status)
  showNotifBtnClose.value = true

  if (!status.isSizeValid) {
    notifTitle.value = t('WW0124')
    notifDescription.value = ''
    notifStatus.value = NOTIF_STATUS.FAILED
    showNotif.value = true

    return
  }

  if (!status.isDirectionValid) {
    notifTitle.value = t('WW0180')
    notifDescription.value = t('WW0181')
    notifStatus.value = NOTIF_STATUS.FAILED
    showNotif.value = true

    return
  }

  showNotif.value = false
}

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

const zoomPreviewValue = computed(
  () => new Decimal(previewScale.value).toDP(2).mul(100).toString() + '%'
)
const zoomSourceValue = computed(
  () => new Decimal(sourceScale.value).toDP(2).mul(100).toString() + '%'
)

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
  hRuler.value.zoom = cmToPixel(cm, dpi ?? 0)
  vRuler.value.zoom = cmToPixel(cm, dpi ?? 0)

  return (sourceScale.value = cm)
}

const handleCropStart = () => {
  if (props.side.isQuilting || props.side.isColorBalancing) {
    return
  }
  store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })
}

const handleCropSuccess = (result: {
  canvas: HTMLCanvasElement
  record: PerspectiveCropRecord
  behaviorType: 'move' | 'grab'
}) => {
  destinationDimension.value = getDimension(
    result.canvas.width,
    result.canvas.height,
    dpi ?? 0
  )

  const isCustomResult = props.side.isQuilting || props.side.isColorBalancing

  /**
   * custom result have their own image result but custom result flow need it's canvas
   * so on initiation, canvas need to be rendered first before doing custom result
   */
  if (!isCustomResult || !destinationCanvas.value) {
    destinationCanvas.value = result.canvas
    renderPreviewDisplay(result.behaviorType)
  }

  destinationCropRecord.value = result.record
  !isCustomResult &&
    store.dispatch('helper/closeModalLoading', { theme: THEME.DARK })
}

const handleRotate = (deg: number) => {
  if (!refPerspectiveCanvas.value) {
    return
  }
  refPerspectiveCanvas.value.rotate(
    (refPerspectiveCanvas.value.rotateDeg + deg) % MAX_ROTATION_DEGREE
  )
}

const handleGridColorChange = (hex: string) => {
  gridColor.value = hex
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
const changeRotateInSlider = (val: number) => {
  const newValue = Math.abs(val) >= 360 ? val % MAX_ROTATION_DEGREE : val
  refPerspectiveCanvas?.value?.rotate(newValue)
}

watch(
  () => rotateDeg.value,
  (v) => {
    rotateDegSliderRef?.value?.setValue(v)
  }
)
watch(gridColor, () => {
  previewDisplay.value?.setGridColor(gridColor.value)
})

onMounted(async () => {
  hRuler.value = new Ruler(RefRoulerH.value as HTMLDivElement, {
    type: 'horizontal',
    zoom: rulerPixelCM,
    unit: 1,
    height: 50,
    backgroundColor: colors.black,
  })
  vRuler.value = new Ruler(RefRoulerV.value as HTMLDivElement, {
    type: 'vertical',
    zoom: rulerPixelCM,
    unit: 1,
    width: 50,
    backgroundColor: colors.black,
  })
})
onMounted(async () => {
  store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })
  const result = await getSourceImageWithDownSampled(
    props?.side?.config?.image?.src ?? '',
    downSampleScales
  )
  sourceImage.value = result.sourceImage
  downSampledCanvases.value = result.downSampledCanvases
  store.dispatch('helper/closeModalLoading', { theme: THEME.DARK })
  if (!perspectiveCropperToolTour.value) {
    store.dispatch(
      'helper/pushModal',
      { component: 'perspective-cropper-tour-step-1', closable: false },
      { root: true }
    )
    perspectiveCropperToolTour.value = true
  }
})
onBeforeUnmount(() => {
  refPerspectiveCanvas?.value?.resetPositions()
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

const restore = () => {
  store.dispatch('helper/pushModalCommon', {
    body: ModalU3mConfirm,
    classModal: 'w-128',
    closable: false,
    withCloseButton: false,
    theme: 'new-dark',
    properties: {
      title: t('EE0219'),
      description: t('EE0220'),
      primaryBtnText: t('EE0221'),
      secondaryBtnText: t('EE0222'),
      primaryBtnHandler: () => {
        refPerspectiveCanvas.value?.restore()
        store.dispatch('helper/closeModal')
      },
      secondaryBtnHandler: () => {
        store.dispatch('helper/closeModal')
      },
    },
  })
}

const showToast = ({ description, status, title }: ToastParams) => {
  notifDescription.value = description ?? ''
  notifTitle.value = title ?? ''
  notifStatus.value = status
  showNotifBtnClose.value = false
  showNotif.value = true

  setTimeout(() => {
    showNotif.value = false
  }, 3000)
}

defineExpose({
  cropImage,
  restore,
  destinationDimension,
  handleRotate,
  rotateDeg,
  showToast,
  changeRotateInSlider,
  handleGridColorChange,
  gridColor,
  refPerspectiveCanvas,
  loadImageToCanvas,
})
</script>
