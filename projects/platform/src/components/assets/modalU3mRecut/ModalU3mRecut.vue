<template lang="pug">
div(class="fixed inset-0 z-modal flex flex-col w-screen h-screen bg-grey-0 overflow-y-auto")
  modal-u3m-recut-header(
    :isValid="isValid"
    :isDoubleSideMaterial="isDoubleSideMaterial"
    :currentSideName="currentSideName"
    :faceSideUrl="faceSideUrl"
    :backSideUrl="backSideUrl"
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
          :currentSide="currentSideName"
          :side="side"
          :ref="(el) => handlePerspectiveCropAreaRefUpdate(side.sideName, el)"
          @update:editStatus="handlePerspectiveEditStatusChange"
        )
      template(v-if="side.cropMode === CROP_MODE.SQUARE")
        div(
          v-show="side.sideName === currentSideName"
          class="flex h-full justify-center items-center"
          :class="[side.sideName]"
        )
          div
            cropper-default-layout(
              :ref="(el) => handleCropLayoutRefUpdate(side.sideName, el)"
              theme="dark"
              class="w-70"
              scaleUnit="cm"
              :scaleInputStep="scaleOptions.step"
              :scaleInitial="side.scaleSizeInCm"
              :scaleStart="side.scaleStartInCm"
              :scaleRange="[scaleOptions.min, scaleOptions.max]"
              :rotateStart="side.rotateStart"
              :config="side.config"
              @update:rotateDeg="side.config.rotateDeg = $event"
              @update:scaleRatio="handleUpdateScaleSize(side, $event)"
            )
              template(#imageCropArea="{ innerScaleSize }")
                image-crop-area(
                  theme="dark"
                  :ref="(el) => handleCropAreaRefUpdate(side.sideName, el)"
                  :config="side.config"
                  :cropRectSize="cropRectSize"
                  @update:options="Object.assign(side.config.options, $event)"
                )
                  div(class="mt-1 absolute w-full")
                    div(
                      class="h-2 flex items-center border-r-2 border-l-2 border-grey-100"
                    )
                      div(class="h-0.5 bg-grey-100 w-full")
                    div(class="text-caption text-grey-100 font-bold text-center") {{ `${innerScaleSize} cm` }}
          div(class="w-125 h-125 bg-grey-250 ml-21 grid grid-cols-3 grid-rows-3")
            div(v-for="i in 9" class="overflow-hidden" :key="i")
              cropped-image(
                :config="side.config"
                :previewScaleRatio="previewScaleRatio"
                :movable="false"
              )
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Decimal from 'decimal.js'
import useMaterialImage from '@/composables/useMaterialImage'
import useNavigation from '@/composables/useNavigation'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import CroppedImage from '@/components/common/cropper/CroppedImage.vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import ModalU3mRecutHeader from '@/components/assets/modalU3mRecut/ModalU3mRecutHeader.vue'
import ModalU3mRecutSwitchControlBar from '@/components/assets/modalU3mRecut/ModalU3mRecutSwitchControlBar.vue'
import PerspectiveCropper from '@/components/assets/modalU3mRecut/perspectiveCropper/PerspectiveCropper.vue'
import {
  CROP_MODE,
  MODAL_CONFIRM_TYPE,
  U3M_CUT_SIDE,
  MODAL_TYPE,
} from '@/utils/constants'
import { coordToDP1, Cropper, pixelToCm, toDP1 } from '@/utils/cropper'
import type {
  Side,
  U3mCropRecord,
  PerspectiveCropRecord,
  U3mImage,
} from '@/utils/cropper'
import type { EditStatus } from '@/composables/usePerspectiveCropper'

interface U3mSide extends Side {
  title: string
  cropMode: CROP_MODE
  scaleSizeInCm: number
  scaleStartInCm: number
  croppedImage: File | null
  perspectiveEditStatus: EditStatus
  perspectiveCropRecord?: PerspectiveCropRecord
  image: U3mImage
}

const cropRectSize = 176
const scaleOptions = {
  min: 1,
  max: 21,
  step: 0.1,
  defaultScaleSizeInCm: 4,
}

const material = computed(() => store.getters['assets/material'])
const { t } = useI18n()
const store = useStore()
const { goToProgress } = useNavigation()
const {
  faceSideImg,
  backSideImg,
}: { faceSideImg: U3mImage; backSideImg: U3mImage } = material.value
const {
  isDoubleSideMaterial,
  isFaceSideMaterial,
  isBackSideMaterial,
  faceSideUrl,
  backSideUrl,
} = useMaterialImage(material.value, 'u3m')

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
    return currentSide.value.perspectiveEditStatus.isValid
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
    type: MODAL_CONFIRM_TYPE.WARNING,
    theme: 'dark',
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
  if (currentSideName.value === U3M_CUT_SIDE.BACK_SIDE && faceSideUrl) {
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
    })
  }
}

const handleGoNext = async () => {
  if (!faceSide.value) {
    throw new Error('faceSide not existed.')
  }

  store.dispatch('helper/pushModalLoading', { theme: 'dark' })
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

  store.dispatch('helper/pushModalLoading', { theme: 'dark' })

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
      if (!result) throw new Error('perspective crop result undefined')
      currentSide.value.croppedImage = result.imageFile
      currentSide.value.perspectiveCropRecord = result.cropRecord
    } else {
      if (!refBackSidePerspectiveCropArea.value) {
        throw new Error('refFaceSidePerspectiveCropArea undefined')
      }
      const result = await refBackSidePerspectiveCropArea.value.cropImage()
      if (!result) throw new Error('perspective crop result undefined')
      currentSide.value.croppedImage = result.imageFile
      currentSide.value.perspectiveCropRecord = result.cropRecord
    }
  }

  await store.dispatch('assets/generateU3m', {
    faceSideCropImg: faceSide.value?.croppedImage,
    backSideCropImg: backSide.value?.croppedImage,
    isAutoRepeat: false,
    faceSideCropImageRecord: getRecord(faceSide.value),
    backSideCropImageRecord: getRecord(backSide.value),
  })

  store.dispatch('helper/closeModalLoading')
  handleClose()

  store.dispatch('helper/openModalConfirm', {
    type: MODAL_TYPE.LOADING,
    header: t('EE0121'),
    contentText: t('EE0122', { RR0008: t('RR0008') }),
    primaryBtnText: t('UU0103'),
    secondaryBtnText: t('UU0090'),
    secondaryBtnHandler: () => goToProgress('u3m'),
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
  if (!currentSide.value) throw new Error('current side undefined')
  currentSide.value.perspectiveEditStatus = editStatus
}

onMounted(async () => {
  const getSide = async (
    sideName: U3M_CUT_SIDE,
    sideTitle: string,
    imageSrc: string,
    image: U3mImage
  ): Promise<U3mSide> => {
    const sideCropper = new Cropper({
      src: imageSrc,
      dpi: image.dpi,
      cropRectSize,
    })
    await sideCropper.formatImage()
    const { config } = sideCropper
    const widthInCm = pixelToCm(config.image.width, config.dpi)
    const scaleSizeInCm =
      image.u3mCropRecord.squareCropRecord?.scaleRatio ||
      scaleOptions.defaultScaleSizeInCm
    config.scaleRatio = widthInCm.div(scaleSizeInCm).toNumber()
    if (image.u3mCropRecord.squareCropRecord) {
      const { x, y, rotateDeg } = image.u3mCropRecord.squareCropRecord
      config.options.x = x
      config.options.y = y
      config.rotateDeg = rotateDeg
    }

    return {
      sideName,
      title: sideTitle,
      image,
      cropMode: image.u3mCropRecord.perspectiveCropRecord
        ? CROP_MODE.PERSPECTIVE
        : CROP_MODE.SQUARE,
      croppedImage: null,
      perspectiveCropRecord: image.u3mCropRecord.perspectiveCropRecord,
      config,
      scaleSizeInCm,
      scaleStartInCm: scaleSizeInCm,
      perspectiveEditStatus: {
        isValid: true,
        isPositionsDirty: false,
        isRotationDirty: false,
      },
      rotateStart: config.rotateDeg,
    }
  }

  const getCurrentSide = () => {
    if (isFaceSideMaterial) {
      return faceSide.value
    }
    if (isBackSideMaterial) {
      return backSide.value
    }
    return faceSideUrl ? faceSide.value : backSide.value
  }

  store.dispatch('helper/pushModalLoading', { theme: 'dark' })

  if (faceSideUrl) {
    faceSide.value = await getSide(
      U3M_CUT_SIDE.FACE_SIDE,
      t('EE0051'),
      faceSideUrl,
      faceSideImg
    )
  }

  if (backSideUrl) {
    backSide.value = await getSide(
      U3M_CUT_SIDE.BACK_SIDE,
      t('EE0052'),
      backSideUrl,
      backSideImg
    )
  }

  currentSide.value = getCurrentSide()
  store.dispatch('helper/closeModalLoading')
})
</script>
