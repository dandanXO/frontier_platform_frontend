<template lang="pug">
div(
  class="fixed inset-0 z-modal flex flex-col w-screen h-screen bg-secondary overflow-y-auto"
  data-theme="new-dark"
)
  modal-u3m-recut-header(
    :isValid="isValid"
    :isDoubleSideMaterial="material.isDoubleSide"
    :currentSideName="currentSideName"
    :faceSideUrl="faceSideU3mImage?.original"
    :backSideUrl="backSideU3mImage?.original"
    :isShowModalReplaceSides="isShowModalReplaceSides"
    @back="handleGoBack"
    @next="handleGoNext"
    @confirm="handleConfirm"
    @close="handleClose"
  ) 
  div(class="absolute invisible w-125 h-125 grid grid-cols-3 grid-rows-3 inset-0")
    div(ref="previewRect")
  div(class="flex-1 flex")
    modal-u3m-recut-sidebar(
      :currentSide="currentSide"
      :handleCropModeChange="handleCropModeChange"
      :togglingCustomConfig="togglingCustomConfig"
      :materialSide="materialSide"
      :refSideCropperArea="refSideCropperArea"
      :isDoubleSideMaterial="material.isDoubleSide"
      @update:replaceSides="handleToggleReplaceSides"
      :isShowModalReplaceSides="isShowModalReplaceSides"
      :faceSideUrl="faceSideU3mImage?.original"
      :backSideUrl="backSideU3mImage?.original"
    )
    div(class="flex flex-1")
      template(v-for="side in sideList" :key="side.sideName")
        perspective-cropper(
          v-if="side.sideName === currentSideName"
          :side="side"
          :isSquare="side.cropMode === CROP_MODE.SQUARE"
          :ref="(el) => (side.cropMode === CROP_MODE.SQUARE ? handleCropAreaRefUpdate(side.sideName, el) : handlePerspectiveCropAreaRefUpdate(side.sideName, el))"
          @update:editStatus="handlePerspectiveEditStatusChange"
          :handleGenerateCustomResult="handleGenerateCustomResult"
        )
      div
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRef } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import ModalU3mRecutHeader from '@/components/assets/modalU3mRecut/ModalU3mRecutHeader.vue'
import ModalU3mRecutSidebar, {
  type TogglingCustomConfigParams,
} from './ModalU3mRecutSidebar.vue'
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
  MaterialSide,
} from '@frontier/platform-web-sdk'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { uploadFileToS3 } from '@/utils/fileUpload'
import ModalU3mConfirm from '../ModalU3mConfirm.vue'
import { STATUS as NOTIF_STATUS } from './perspectiveCropper/NotifyBar.vue'
import type { GenerateCustomResultParams } from './perspectiveCropper/PerspectiveCanvas.vue'

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

const faceSideImage = computed<MaterialSideImage | null>(
  () => (material.value.faceSide?.sideImage as MaterialSideImage) || null
)
const faceSideU3mImage = computed<MaterialU3mImage | null>(
  () => (material.value.faceSide?.u3mImage as MaterialU3mImage) || null
)
const backSideImage = computed<MaterialSideImage | null>(
  () => (material.value.backSide?.sideImage as MaterialSideImage) || null
)
const backSideU3mImage = computed<MaterialU3mImage | null>(
  () => (material.value.backSide?.u3mImage as MaterialU3mImage) || null
)
const materialSide = computed(() => {
  const materialSideMap: Record<U3M_CUT_SIDE, MaterialSide | null> = {
    [U3M_CUT_SIDE.FACE_SIDE]: material.value.faceSide,
    [U3M_CUT_SIDE.BACK_SIDE]: material.value.backSide,
  }

  return materialSideMap[currentSideName.value ?? U3M_CUT_SIDE.FACE_SIDE]
})

const previewRect = ref<HTMLDivElement | null>(null)
const isShowModalReplaceSides = ref(true)
const refFaceSideCropArea = ref<InstanceType<typeof PerspectiveCropper> | null>(
  null
)
const refBackSideCropArea = ref<InstanceType<typeof PerspectiveCropper> | null>(
  null
)
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

const refSideCropperArea = computed(() =>
  currentSide.value?.sideName === U3M_CUT_SIDE.FACE_SIDE
    ? refFaceSideCropArea.value
    : refBackSideCropArea.value
)

const isValid = computed(() => {
  if (!currentSide.value) {
    return false
  }
  const { isSizeValid, isDirectionValid } =
    currentSide.value.perspectiveEditStatus

  return isSizeValid && isDirectionValid
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

const togglingCustomConfig = ({
  isQuilting,
  isColorBalancing,
}: TogglingCustomConfigParams) => {
  ;[faceSide, backSide].forEach((side) => {
    if (side?.value) {
      side.value.isQuilting = isQuilting
      side.value.isColorBalancing = isColorBalancing
    }
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
    const result = await refFaceSideCropArea.value.cropImage()
    faceSide.value.croppedImage = result.imageFile
    faceSide.value.perspectiveCropRecord = result.cropRecord
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

const handleToggleReplaceSides = (val: boolean) => {
  isShowModalReplaceSides.value = val
}

const generateAssetsMaterialU3m = async (isReplaceFaceAndBackSide: boolean) => {
  try {
    if (!currentSide.value) {
      throw new Error('refTargetSide not existed.')
    }

    store.dispatch('helper/pushModalLoading', { theme: THEME.DARK })

    const getRecord = (side?: U3mSide): U3mCropRecord | null => {
      if (!side) {
        return null
      }

      if (side.cropMode === CROP_MODE.SQUARE) {
        const { perspectiveCropRecord } = side
        if (!perspectiveCropRecord) {
          throw new Error('perspectiveCropRecord not existed.')
        }
        const { leftTop, leftBottom, rightTop, rightBottom, rotateDeg } =
          perspectiveCropRecord

        return {
          squareCropRecord: {
            leftTop: coordToDP1(leftTop),
            leftBottom: coordToDP1(leftBottom),
            rightTop: coordToDP1(rightTop),
            rightBottom: coordToDP1(rightBottom),
            rotateDeg: toDP1(rotateDeg),
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
        const result = await refFaceSideCropArea.value.cropImage()
        currentSide.value.croppedImage = result.imageFile
        currentSide.value.perspectiveCropRecord = result.cropRecord
      } else {
        if (!refBackSideCropArea.value) {
          throw new Error('refBackSideCropArea undefined')
        }
        const result = await refBackSideCropArea.value.cropImage()
        currentSide.value.croppedImage = result.imageFile
        currentSide.value.perspectiveCropRecord = result.cropRecord
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
        squareCropRecord: cropImageRecord?.squareCropRecord || null,
        perspectiveCropRecord: cropImageRecord?.perspectiveCropRecord || null,
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
      isReplaceFaceAndBackSide,
      hasHole: hasHole.value,
      holeColor: holeColor.value,
    })
    material.value.u3m.status = result.data.result!.u3mStatus

    store.dispatch('helper/closeModalLoading')
    store.dispatch('helper/closeModal')

    store.dispatch('helper/openModalConfirm', {
      type: MODAL_TYPE.LOADING,
      header: t('EE0121'),
      contentText: t('EE0122', { RR0008: t('RR0008') }),
      primaryBtnText: t('UU0103'),
      secondaryBtnText: t('UU0090'),
      secondaryBtnHandler: () => goToProgress({}, 'u3m'),
    })
  } catch (error) {
    console.error(error)
    store.dispatch('helper/closeModalLoading')
  }
}

const handleGenerateCustomResult = async (
  coordsMap: GenerateCustomResultParams
) => {
  const u3mImageMap: Record<U3M_CUT_SIDE, MaterialU3mImage | null> = {
    [U3M_CUT_SIDE.FACE_SIDE]: faceSideU3mImage.value,
    [U3M_CUT_SIDE.BACK_SIDE]: backSideU3mImage.value,
  }

  if (!currentSideName.value || !materialSide.value) {
    store.dispatch('helper/closeModalLoading')
    return
  }

  const rotateDeg =
    u3mImageMap[currentSideName.value]?.cropRecord.squareCropRecord?.rotateDeg

  const { data } = await ogBaseAssetsApi('materialGetAiImageProcessor', {
    frontierNo: materialSide.value.frontierNo,
    selectedArea: {
      leftBottom: coordsMap.leftBottom,
      leftTop: coordsMap.leftTop,
      rightBottom: coordsMap.rightBottom,
      rightTop: coordsMap.rightTop,
      rotateDeg: rotateDeg ?? 0,
    },
    shouldColorBalance: !!currentSide.value?.isColorBalancing,
    shouldImageQuilt: !!currentSide.value?.isQuilting,
  })

  data.result
    ? await refSideCropperArea.value?.loadImageToCanvas(data.result)
    : refSideCropperArea.value?.refPerspectiveCanvas?.crop(false, true)

  store.dispatch('helper/closeModalLoading')
  !data.result &&
    refSideCropperArea.value?.showToast({
      description: t('WW0185'),
      status: NOTIF_STATUS.FAILED,
    })
}

const handleConfirm = async () => {
  const onGenereteMaterial = (isReplaceFaceAndBackSide: boolean) => () => {
    setTimeout(() => {
      generateAssetsMaterialU3m(isReplaceFaceAndBackSide)
    }, 500)
  }
  isShowModalReplaceSides.value
    ? store.dispatch('helper/pushModalConfirm', {
        type: NOTIFY_TYPE.INFO,
        theme: THEME.LIGHT,
        header: t('EE0202'),
        contentText: t('EE0203'),
        primaryBtnText: t('EE0205'),
        secondaryBtnText: t('EE0204'),
        primaryBtnHandler: onGenereteMaterial(true),
        secondaryBtnHandler: onGenereteMaterial(false),
      })
    : generateAssetsMaterialU3m(false)
}

const handleClose = () => {
  store.dispatch('helper/pushModalCommon', {
    body: ModalU3mConfirm,
    classModal: 'w-128',
    closable: false,
    withCloseButton: false,
    theme: 'new-dark',
    properties: {
      title: t('EE0223'),
      description: t('EE0224'),
      primaryBtnText: t('EE0226'),
      secondaryBtnText: t('EE0225'),
      primaryBtnHandler: () => {
        store.dispatch('helper/closeModal')
      },
      secondaryBtnHandler: () => {
        store.dispatch('helper/clearModalPipeline')
      },
    },
  })
}

const handleCropAreaRefUpdate = (
  sideName: U3M_CUT_SIDE,
  el: InstanceType<typeof PerspectiveCropper> | null
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
      cropMode: CROP_MODE.SQUARE,
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
      if (faceSide?.value && !faceSide.value.cropMode) {
        faceSide.value.cropMode = CROP_MODE.SQUARE
      }
      if (backSide?.value && !backSide.value.cropMode) {
        backSide.value.cropMode = CROP_MODE.SQUARE
      }
      return faceSideU3mImage.value ? faceSide.value : backSide.value
    }
    if (faceSideU3mImage.value) {
      if (faceSide?.value && !faceSide.value.cropMode) {
        faceSide.value.cropMode = CROP_MODE.SQUARE
      }
      return faceSide.value
    }
    if (backSideU3mImage.value) {
      if (backSide?.value && !backSide.value.cropMode) {
        backSide.value.cropMode = CROP_MODE.SQUARE
      }
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
