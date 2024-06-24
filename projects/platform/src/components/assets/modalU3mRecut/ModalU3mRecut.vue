<template lang="pug">
div(class="fixed inset-0 z-modal flex flex-col w-screen h-screen bg-grey-0 overflow-y-auto")
  modal-u3m-recut-header(
    :isValid="isValid"
    :isDoubleSideMaterial="material.isDoubleSide"
    :currentSideName="currentSideName"
    :faceSideUrl="faceSideU3mImage?.original"
    :backSideUrl="backSideU3mImage?.original"
    @back="handleGoBack"
    @next="handleGoNext"
    @confirm="handleConfirm"
    @close="handleClose"
  )
  modal-u3m-recut-switch-control-bar(
    :cropMode="currentSideCropMode || CROP_MODE.SQUARE"
    @update:cropMode="handleCropModeChange"
    @restore="handleRestore"
  )
  div(class="absolute invisible w-125 h-125 grid grid-cols-3 grid-rows-3 inset-0")
    div(ref="previewRect")
  div(class="flex-1 bg-grey-800")
    template(v-for="side in sideList" :key="side.sideName")
      template(v-if="side.cropMode === CROP_MODE.PERSPECTIVE")
        perspective-cropper(
          v-if="side.sideName === currentSideName"
          :side="side"
          :ref="(el) => handlePerspectiveCropAreaRefUpdate(side.sideName, el)"
          @update:editStatus="handlePerspectiveEditStatusChange"
        )
      template(v-if="side.cropMode === CROP_MODE.SQUARE")
        perspective-cropper(
          v-if="side.sideName === currentSideName"
          isSquare
          :side="side"
          :ref="(el) => handlePerspectiveCropAreaRefUpdate(side.sideName, el)"
          @update:editStatus="handlePerspectiveEditStatusChange"
        )
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRef } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Decimal from 'decimal.js'
import useNavigation from '@/composables/useNavigation'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import CroppedImage from '@/components/common/cropper/CroppedImage.vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import ModalU3mRecutHeader from '@/components/assets/modalU3mRecut/ModalU3mRecutHeader.vue'
import ModalU3mRecutSwitchControlBar from '@/components/assets/modalU3mRecut/ModalU3mRecutSwitchControlBar.vue'
import PerspectiveCropper from '@/components/assets/modalU3mRecut/perspectiveCropper/PerspectiveCropper.vue'
import {
  CROP_MODE,
  NOTIFY_TYPE,
  U3M_CUT_SIDE,
  MODAL_TYPE,
  THEME,
  HOLE_TYPE,
} from '@/utils/constants'
import { coordToDP1, Cropper, pixelToCm, toDP1 } from '@/utils/cropper'
import type { EditStatus, U3mCropRecord, U3mSide } from '@/types'
import type {
  Material,
  MaterialGenerateU3mSide,
  MaterialU3mImage,
  MaterialSideImage,
} from '@frontier/platform-web-sdk'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { uploadFileToS3 } from '@/utils/fileUpload'

const props = defineProps<{
  material: Material
  HasHole: Boolean
  HoleColor: HOLE_TYPE
}>()

const cropRectSize = 176
const scaleOptions = {
  min: 1,
  max: 21,
  step: 0.1,
  defaultScaleSizeInCm: 4,
}

const material = toRef(props.material)
const hasHole = toRef(props.HasHole)
const holeColor = toRef(props.HoleColor)
const { t } = useI18n()
const store = useStore()
const { goToProgress } = useNavigation()
const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

const faceSideImage = computed(() => material.value.faceSide?.sideImage || null)
const faceSideU3mImage = computed(
  () => material.value.faceSide?.u3mImage || null
)
const backSideImage = computed(() => material.value.backSide?.sideImage || null)
const backSideU3mImage = computed(
  () => material.value.backSide?.u3mImage || null
)

const previewRect = ref<HTMLDivElement | null>(null)
const refFaceSideCropLayout = ref<any | null>(null)
const refBackSideCropLayout = ref<any | null>(null)
const refFaceSideCropArea = ref<InstanceType<typeof ImageCropArea> | null>(null)
const refBackSideCropArea = ref<InstanceType<typeof ImageCropArea> | null>(null)
const refFaceSidePerspectiveCropArea = ref<InstanceType<
  typeof PerspectiveCropper
> | null>(null)
const refBackSidePerspectiveCropArea = ref<InstanceType<
  typeof PerspectiveCropper
> | null>(null)
const faceSide = ref<U3mSide>()
const backSide = ref<U3mSide>()
const sideList = computed(() => {
  return [faceSide.value, backSide.value].filter((s) => !!s) as U3mSide[]
})

const currentSide = ref<U3mSide>()
const currentSideName = computed(() => currentSide.value?.sideName)
const currentSideCropMode = computed(() => currentSide.value?.cropMode)

/**
 * 計算 preview 九宮格其中一格的縮放比例，
 * 因 cropRectSize 和九宮格其中一格的寬度不同，需要相除計算出 ratio。
 **/
const previewScaleRatio = computed(() =>
  previewRect.value ? previewRect.value.clientWidth / cropRectSize : 1
)

const isValid = computed(() => {
  if (!currentSide.value) {
    return false
  }
  if (currentSide.value.cropMode === CROP_MODE.PERSPECTIVE) {
    const { isSizeValid, isDirectionValid } =
      currentSide.value.perspectiveEditStatus
    return isSizeValid && isDirectionValid
  }
  return true
})

const handleCropModeChange = async (v: CROP_MODE) => {
  if (!currentSide.value) {
    throw new Error('current side not existed.')
  }
  currentSide.value.cropMode = v

  if (currentSideName.value === U3M_CUT_SIDE.FACE_SIDE) {
    if (!faceSide.value) {
      throw new Error('faceSide is null')
    }
    const cropResult = await refFaceSidePerspectiveCropArea.value?.cropImage()
    if (!cropResult) {
      return
    }
    faceSide.value.perspectiveCropRecord = cropResult.cropRecord
  }

  if (currentSideName.value === U3M_CUT_SIDE.BACK_SIDE) {
    if (!backSide.value) {
      throw new Error('backSide is null')
    }
    const cropResult = await refBackSidePerspectiveCropArea.value?.cropImage()
    if (!cropResult) {
      return
    }
    backSide.value.perspectiveCropRecord = cropResult.cropRecord
  }
}

const handleUpdateScaleSize = (side: U3mSide, newScaleSizeInCm: number) => {
  if (
    newScaleSizeInCm > scaleOptions.max ||
    newScaleSizeInCm < scaleOptions.min
  ) {
    return
  }

  const image = side.config.image
  const widthInPixel = image.width
  const heightInPixel = image.height
  const dpi = side.config.dpi
  const widthInCm = pixelToCm(widthInPixel, dpi)
  const heightInCm = pixelToCm(heightInPixel, dpi)
  const mainRulerInCm = Decimal.min(widthInCm, heightInCm)
  side.config.scaleRatio = mainRulerInCm.div(newScaleSizeInCm).toNumber()
  side.scaleSizeInCm = newScaleSizeInCm
}

const handleRestore = () => {
  store.dispatch('helper/pushModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    theme: THEME.DARK,
    header: t('EE0145'),
    contentText: t('EE0146'),
    primaryBtnText: t('UU0131'),
    secondaryBtnText: t('UU0130'),
    secondaryBtnHandler: () => {
      if (currentSide.value?.cropMode === CROP_MODE.PERSPECTIVE) {
        if (currentSideName.value === U3M_CUT_SIDE.FACE_SIDE) {
          refFaceSidePerspectiveCropArea.value?.restore()
        }
        if (currentSideName.value === U3M_CUT_SIDE.BACK_SIDE) {
          refBackSidePerspectiveCropArea.value?.restore()
        }
      } else {
        if (currentSideName.value === U3M_CUT_SIDE.FACE_SIDE) {
          if (!faceSide.value) {
            return
          }
          refFaceSideCropLayout.value.resetScale()
          refFaceSideCropLayout.value.resetRotate()
          faceSide.value.config.options.x =
            faceSide.value.image.u3mCropRecord.squareCropRecord?.x || 0
          faceSide.value.config.options.y =
            faceSide.value.image.u3mCropRecord.squareCropRecord?.y || 0
        }
        if (currentSideName.value === U3M_CUT_SIDE.BACK_SIDE) {
          if (!backSide.value) {
            return
          }
          refBackSideCropLayout.value.resetScale()
          refBackSideCropLayout.value.resetRotate()
          backSide.value.config.options.x =
            backSide.value.image.u3mCropRecord.squareCropRecord?.x || 0
          backSide.value.config.options.y =
            backSide.value.image.u3mCropRecord.squareCropRecord?.y || 0
        }
      }
    },
  })
}

const handleGoBack = async () => {
  if (
    currentSideName.value === U3M_CUT_SIDE.BACK_SIDE &&
    !!faceSideU3mImage.value
  ) {
    if (!backSide.value) {
      throw new Error('backSide is null')
    }
    if (currentSide.value?.cropMode === CROP_MODE.PERSPECTIVE) {
      if (!refBackSidePerspectiveCropArea.value) {
        throw new Error('refBackSidePerspectiveCropArea is null')
      }
      const cropResult = await refBackSidePerspectiveCropArea.value.cropImage()
      if (!cropResult) {
        return
      }
      backSide.value.perspectiveCropRecord = cropResult.cropRecord
    }
    currentSide.value = faceSide.value
  } else {
    store.dispatch('helper/replaceModalBehavior', {
      component: 'modal-u3m-preview',
      properties: { material },
    })
  }
}

const handleGoNext = async () => {
  if (!faceSide.value) {
    throw new Error('faceSide not existed.')
  }

  store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })
  if (currentSideCropMode.value === CROP_MODE.SQUARE) {
    if (!refFaceSideCropArea.value) {
      throw new Error('refFaceSide not existed.')
    }
    faceSide.value.croppedImage = await refFaceSideCropArea.value.cropImage()
  } else if (currentSideCropMode.value === CROP_MODE.PERSPECTIVE) {
    if (!refFaceSidePerspectiveCropArea.value) {
      return
    }
    const cropResult = await refFaceSidePerspectiveCropArea.value.cropImage()
    if (!cropResult) {
      return
    }
    faceSide.value.croppedImage = cropResult.imageFile
    faceSide.value.perspectiveCropRecord = cropResult.cropRecord
  } else {
    throw new Error('invalid crop mode.')
  }
  currentSide.value = backSide.value
  store.dispatch('helper/closeModalLoading')
}

const handleConfirm = async () => {
  if (!currentSide.value) {
    throw new Error('refTargetSide not existed.')
  }

  store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })

  const getRecord = (side?: U3mSide): U3mCropRecord | null => {
    if (!side) {
      return null
    }

    const { options, rotateDeg: squareCropRotateDeg } = side.config
    if (side.cropMode === CROP_MODE.SQUARE) {
      return {
        squareCropRecord: {
          x: toDP1(options.x),
          y: toDP1(options.y),
          rotateDeg: toDP1(squareCropRotateDeg),
          scaleRatio: toDP1(side.scaleSizeInCm),
        },
      }
    }

    const { perspectiveCropRecord } = side
    if (!perspectiveCropRecord) {
      throw new Error('perspectiveCropRecord not existed.')
    }

    const { leftTop, leftBottom, rightTop, rightBottom, rotateDeg } =
      perspectiveCropRecord

    return {
      perspectiveCropRecord: {
        leftTop: coordToDP1(leftTop),
        leftBottom: coordToDP1(leftBottom),
        rightTop: coordToDP1(rightTop),
        rightBottom: coordToDP1(rightBottom),
        rotateDeg: toDP1(rotateDeg),
      },
    }
  }

  if (currentSideCropMode.value === CROP_MODE.SQUARE) {
    if (currentSideName.value === U3M_CUT_SIDE.FACE_SIDE) {
      if (!refFaceSideCropArea.value) {
        throw new Error('refFaceSideCropArea undefined')
      }
      currentSide.value.croppedImage =
        await refFaceSideCropArea.value.cropImage()
    } else {
      if (!refBackSideCropArea.value) {
        throw new Error('refBackSideCropArea undefined')
      }
      currentSide.value.croppedImage =
        await refBackSideCropArea.value.cropImage()
    }
  } else {
    if (currentSideName.value === U3M_CUT_SIDE.FACE_SIDE) {
      if (!refFaceSidePerspectiveCropArea.value) {
        throw new Error('refFaceSidePerspectiveCropArea undefined')
      }
      const result = await refFaceSidePerspectiveCropArea.value.cropImage()
      if (!result) {
        throw new Error('perspective crop result undefined')
      }
      currentSide.value.croppedImage = result.imageFile
      currentSide.value.perspectiveCropRecord = result.cropRecord
    } else {
      if (!refBackSidePerspectiveCropArea.value) {
        throw new Error('refFaceSidePerspectiveCropArea undefined')
      }
      const result = await refBackSidePerspectiveCropArea.value.cropImage()
      if (!result) {
        throw new Error('perspective crop result undefined')
      }
      currentSide.value.croppedImage = result.imageFile
      currentSide.value.perspectiveCropRecord = result.cropRecord
    }
  }

  const getSideReq = async (
    side: U3mSide | undefined
  ): Promise<MaterialGenerateU3mSide | null> => {
    if (!side) {
      return null
    }

    const { croppedImage } = side
    const cropImageRecord = getRecord(side)

    if (!croppedImage || !cropImageRecord) {
      return null
    }

    const { s3UploadId, fileName } = await uploadFileToS3(
      croppedImage,
      croppedImage.name
    )

    return {
      s3UploadId,
      fileName,
      squareCropRecord: cropImageRecord.squareCropRecord || null,
      perspectiveCropRecord: cropImageRecord.perspectiveCropRecord || null,
    }
  }

  const [faceSideReq, backSideReq] = await Promise.all([
    getSideReq(faceSide.value),
    getSideReq(backSide.value),
  ])
  const result = await ogBaseAssetsApi('generateAssetsMaterialU3m', {
    materialId: material.value.materialId,
    faceSide: faceSideReq,
    backSide: backSideReq,
    isAutoRepeat: false,
    hasHole: hasHole.value,
    holeColor: holeColor.value,
  })
  material.value.u3m.status = result.data.result!.u3mStatus

  store.dispatch('helper/closeModalLoading')
  handleClose()

  store.dispatch('helper/openModalConfirm', {
    type: MODAL_TYPE.LOADING,
    header: t('EE0121'),
    contentText: t('EE0122', { RR0008: t('RR0008') }),
    primaryBtnText: t('UU0103'),
    secondaryBtnText: t('UU0090'),
    secondaryBtnHandler: () => goToProgress({}, 'u3m'),
  })
}

const handleCropLayoutRefUpdate = (sideName: U3M_CUT_SIDE, el: any) => {
  if (sideName === U3M_CUT_SIDE.FACE_SIDE) {
    refFaceSideCropLayout.value = el
  }
  if (sideName === U3M_CUT_SIDE.BACK_SIDE) {
    refBackSideCropLayout.value = el
  }
}

const handleCropAreaRefUpdate = (
  sideName: U3M_CUT_SIDE,
  el: InstanceType<typeof ImageCropArea>
) => {
  if (sideName === U3M_CUT_SIDE.FACE_SIDE) {
    refFaceSideCropArea.value = el
  }
  if (sideName === U3M_CUT_SIDE.BACK_SIDE) {
    refBackSideCropArea.value = el
  }
}

const handlePerspectiveCropAreaRefUpdate = (
  sideName: U3M_CUT_SIDE,
  el: InstanceType<typeof PerspectiveCropper>
) => {
  if (sideName === U3M_CUT_SIDE.FACE_SIDE) {
    refFaceSidePerspectiveCropArea.value = el
  }
  if (sideName === U3M_CUT_SIDE.BACK_SIDE) {
    refBackSidePerspectiveCropArea.value = el
  }
}

const handleClose = () => {
  store.dispatch('helper/closeModal')
}

const handlePerspectiveEditStatusChange = (editStatus: EditStatus) => {
  if (!currentSide.value) {
    throw new Error('current side undefined')
  }
  currentSide.value.perspectiveEditStatus = editStatus
}

onMounted(async () => {
  const getSide = async (
    sideName: U3M_CUT_SIDE,
    sideTitle: string,
    sideImage: MaterialSideImage,
    u3mImage: MaterialU3mImage
  ): Promise<U3mSide> => {
    const sideCropper = new Cropper({
      src: sideImage.originalUrl,
      dpi: sideImage.dpi,
      cropRectSize,
    })
    await sideCropper.formatImage()
    const { config } = sideCropper
    const widthInCm = pixelToCm(config.image.width, config.dpi)
    const scaleSizeInCm =
      u3mImage.cropRecord.squareCropRecord?.scaleRatio ||
      scaleOptions.defaultScaleSizeInCm
    config.scaleRatio = widthInCm.div(scaleSizeInCm).toNumber()
    if (u3mImage.cropRecord.squareCropRecord) {
      const { x, y, rotateDeg } = u3mImage.cropRecord.squareCropRecord
      config.options.x = x
      config.options.y = y
      config.rotateDeg = rotateDeg
    }

    return {
      sideName,
      title: sideTitle,
      image: {
        u3mCropRecord: u3mImage.cropRecord,
        dpi: sideImage.dpi,
      },
      cropMode: u3mImage.cropRecord.perspectiveCropRecord
        ? CROP_MODE.PERSPECTIVE
        : CROP_MODE.SQUARE,
      croppedImage: null,
      perspectiveCropRecord: u3mImage.cropRecord.perspectiveCropRecord,
      config,
      scaleSizeInCm,
      scaleStartInCm: scaleSizeInCm,
      perspectiveEditStatus: {
        isSizeValid: true,
        isDirectionValid: true,
        isPositionsDirty: false,
        isRotationDirty: false,
      },
      rotateStart: config.rotateDeg,
    }
  }

  const getCurrentSide = () => {
    if (material.value.isDoubleSide) {
      return faceSideU3mImage.value ? faceSide.value : backSide.value
    }
    if (faceSideU3mImage.value) {
      return faceSide.value
    }
    if (backSideU3mImage.value) {
      return backSide.value
    }
  }

  store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })

  if (faceSideImage.value && faceSideU3mImage.value) {
    faceSide.value = await getSide(
      U3M_CUT_SIDE.FACE_SIDE,
      t('EE0051'),
      faceSideImage.value,
      faceSideU3mImage.value
    )
  }

  if (backSideImage.value && backSideU3mImage.value) {
    backSide.value = await getSide(
      U3M_CUT_SIDE.BACK_SIDE,
      t('EE0052'),
      backSideImage.value,
      backSideU3mImage.value
    )
  }

  currentSide.value = getCurrentSide()
  store.dispatch('helper/closeModalLoading')
})
</script>
