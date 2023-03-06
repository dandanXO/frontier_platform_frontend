<template lang="pug">
div(class="h-full flex flex-col")
  div(class="flex-1 flex flex-row gap-x-6 items-stretch px-7.5")
    div(class="dark relative flex-1 flex flex-col" @click="handleAreaClick('edit')")
      div(class="flex-1 rounded-lg bg-grey-900 overflow-hidden")
        div(ref="sourceCanvasContainer" class="relative w-full h-full bg-grey-900")
      template(v-if="perspectiveCropper")
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
    div(class="hidden")
      canvas(ref="destinationCanvas" class="w-200")
      img(ref="destinationImage" class="w-200")
  div(class="bg-grey-800 flex flex-row items-center justify-center h-17")
    div(
      v-if="perspectiveCropper && destinationDimension"
      class="flex-1 flex flex-row items-center justify-center gap-4 text-grey-150"
    )
      div(class="flex flex-row items-center gap-x-4")
        dimension-info(
          iconName="crop_original"
          :text="$t('EE0154')"
          :dimension="perspectiveCropper.sourceDimension"
        )
        info-divider(size="lg")
        div(class="flex flex-row items-center gap-x-2")
          dimension-info(
            iconName="crop"
            :text="$t('EE0150')"
            :dimension="destinationDimension"
          )
          label-button(
            :disabled="!side.perspectiveEditStatus.isPositionsDirty"
            @click="handlePositionReset"
          ) {{ $t('RR0255') }}
        info-divider(size="lg")
      div(class="flex flex-row items-center gap-x-3")
        info-name(iconName="rotate" :text="$t('EE0049')")
        div(class="flex flex-row items-center gap-2")
          label-button(@click="handleRotate(270)") {{ $t('EE0155', { degree: '90°' }) }}
          label-button(@click="handleRotate(90)") {{ $t('EE0156', { degree: '90°' }) }}
          label-button(@click="handleRotate(180)") 180°
          label-button(
            :disabled="!side.perspectiveEditStatus.isRotationDirty"
            @click="handleResetRotate"
          ) {{ $t('RR0255') }}
</template>

<script setup lang="ts">
import { ref, toRaw, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Decimal from 'decimal.js'
import usePreview from '@/composables/usePreview'
import usePerspectiveCropper from '@/composables/usePerspectiveCropper'
import CanvasControl from '@/components/assets/modalU3mRecut/perspectiveCropper/CanvasControl.vue'
import DimensionInfo from '@/components/assets/modalU3mRecut/perspectiveCropper/DimensionInfo.vue'
import InfoDivider from '@/components/assets/modalU3mRecut/perspectiveCropper/InfoDivider.vue'
import LabelButton from '@/components/assets/modalU3mRecut/perspectiveCropper/LabelButton.vue'
import InfoName from '@/components/assets/modalU3mRecut/perspectiveCropper/InfoName.vue'
import NotifyBar from '@/components/assets/modalU3mRecut/perspectiveCropper/NotifyBar.vue'
import { CROPPER_GRID_COLORS, MODAL_CONFIRM_TYPE } from '@/utils/constants'
import { toDP2 } from '@/utils/cropper'
import type { U3mSide, EditStatus, Dimension } from '@/types'

const props = defineProps<{
  side: U3mSide
}>()

const emit = defineEmits<{
  (e: 'update:editStatus', editStatus: EditStatus): void
}>()

const store = useStore()
const { t } = useI18n()

const dpi = toRaw(props.side.config.dpi)

const sourceCanvasContainer = ref<HTMLDivElement>()
const previewCanvasContainer = ref<HTMLDivElement>()
const destinationCanvas = ref<HTMLCanvasElement>()

const defaultGridColor = CROPPER_GRID_COLORS[11].color
const sourceGridColor = ref(defaultGridColor)
const previewGridColor = ref(defaultGridColor)

const sourceScale = ref(0)
const previewScale = ref(0)
const rotateDeg = ref(0)
const gridOpen = ref(true)
const destinationDimension = ref<Dimension>()
const activeArea = ref<'edit' | 'preview'>('edit')

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

const errorHandler = (err: Error) => {
  console.error(err)
  store.dispatch('helper/openModalConfirm', {
    type: MODAL_CONFIRM_TYPE.ALERT,
    header: t('RR0107'),
    contentText: t('RR0108'),
    primaryBtnText: t('UU0031'),
    primaryBtnHandler: () => window.location.reload(),
  })
}

const { previewDisplay, renderPreviewDisplay } = usePreview(
  destinationCanvas,
  previewCanvasContainer,
  previewGridColor.value,
  (v) => (previewScale.value = v),
  () => store.dispatch('helper/closeModalLoading'),
  errorHandler
)

const { destinationImage, perspectiveCropper } = usePerspectiveCropper({
  sourceCanvasContainer,
  dpi,
  imageUrl: props.side.config.image.src,
  restoreRecord: props.side.image.u3mCropRecord.perspectiveCropRecord,
  initialRecord: props.side.perspectiveCropRecord,
  initialGridColor: sourceGridColor.value,
  destinationCanvas,
  onCropSuccess: () => {
    if (!perspectiveCropper.value?.destinationDimension) {
      throw new Error('destinationDimension undefined')
    }
    destinationDimension.value = perspectiveCropper.value.destinationDimension
    renderPreviewDisplay()
    previewDisplay.value?.zoomToFit()
  },
  onInitStart: () =>
    store.dispatch('helper/pushModalLoading', { theme: 'dark' }),
  onInitEnd: () => store.dispatch('helper/closeModalLoading'),
  onCropStart: () =>
    store.dispatch('helper/pushModalLoading', { theme: 'dark' }),
  onScaleChange: (v) => (sourceScale.value = v),
  onRotationChange: (v) => (rotateDeg.value = v),
  onEditStatusChange: (status) => emit('update:editStatus', status),
  onError: errorHandler,
})

const cropImage = () => perspectiveCropper.value?.getCroppedImage()
const restore = () => perspectiveCropper.value?.restore()

const step = 0.01
const stepAdd = (v: number) => toDP2(new Decimal(v).add(step))
const stepMinus = (v: number) => toDP2(new Decimal(v).sub(step))

const handleAreaClick = (area: 'edit' | 'preview') => {
  activeArea.value = area
}

const handleRotate = (deg: number) => {
  if (!perspectiveCropper.value) {
    throw new Error('perspective cropper is null or undefined')
  }
  perspectiveCropper.value.rotate(
    (perspectiveCropper.value.rotateDeg + deg) % 360,
    true
  )
}

const handleResetRotate = () => {
  if (!perspectiveCropper.value) {
    return
  }
  perspectiveCropper.value.resetRotation()
}

const handlePositionReset = () => {
  if (!perspectiveCropper.value) {
    return
  }
  perspectiveCropper.value.resetPosition(true)
}

const handleSourceZoomAdd = () => {
  if (!perspectiveCropper.value) {
    return
  }
  const newScale = stepAdd(sourceScale.value)
  perspectiveCropper.value.setScale(newScale)
}

const handleSourceZoomMinus = () => {
  if (!perspectiveCropper.value || sourceScale.value <= 0.01) {
    return
  }
  const newScale = stepMinus(sourceScale.value)
  perspectiveCropper.value.setScale(newScale)
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

const handleSourceGridColorChange = (hex: string) => {
  sourceGridColor.value = hex
}
const handlePreviewGridColorChange = (hex: string) => {
  previewGridColor.value = hex
}

const handleSourceZoomUpdate = (type: string) => {
  if (!perspectiveCropper.value) {
    return
  }

  switch (type) {
    case ZOOM_TYPES.ZOOM_TO_FIT:
      return perspectiveCropper.value.zoomToFit()
    case ZOOM_TYPES.ZOOM_TO_6:
      return perspectiveCropper.value.setScale(0.06)
    case ZOOM_TYPES.ZOOM_TO_12:
      return perspectiveCropper.value.setScale(0.12)
    case ZOOM_TYPES.ZOOM_TO_25:
      return perspectiveCropper.value.setScale(0.25)
    case ZOOM_TYPES.ZOOM_TO_50:
      return perspectiveCropper.value.setScale(0.5)
    case ZOOM_TYPES.ZOOM_TO_100:
      return perspectiveCropper.value.setScale(1)
    case ZOOM_TYPES.ZOOM_TO_200:
      return perspectiveCropper.value.setScale(2)
    case ZOOM_TYPES.ZOOM_TO_400:
      return perspectiveCropper.value.setScale(4)
    default:
      return
  }
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

watch(sourceGridColor, () => {
  perspectiveCropper.value?.setGridColor(sourceGridColor.value)
})

watch(previewGridColor, () => {
  previewDisplay.value?.setGridColor(previewGridColor.value)
})

const handleTogglePreviewGrid = () => {
  gridOpen.value = previewDisplay.value?.toggleGrid() || false
}

defineExpose({ cropImage, restore })
</script>
