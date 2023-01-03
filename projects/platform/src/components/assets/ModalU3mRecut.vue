<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-grey-900 font-bold") {{ $t('EE0069') }}
  template(#right)
    btn-group(
      :primaryText="hasNext ? $t('UU0021') : $t('UU0020')"
      @click:primary="hasNext ? getNext() : confirm()"
      :secondaryText="isAtSecondStep ? $t('UU0004') : $t('UU0002')"
      @click:secondary="isAtSecondStep ? goBack() : closeModal()"
    )
  template(#content)
    template(v-for="side in sides" :key="side.sideName")
      div(
        v-show="side.sideName === currentSide"
        class="flex h-full justify-center items-center"
        :class="[side.sideName]"
      )
        div
          div(class="mb-4.5 text-center text-grey-900 text-body2 font-bold") {{ side.title }}
          cropper-default-layout(
            class="w-70"
            scaleUnit="cm"
            :scaleInputStep="scaleOptions.step"
            :scaleStart="side.scaleStartInCm"
            :scaleRange="[scaleOptions.min, scaleOptions.max]"
            :rotateStart="side.rotateStart"
            :config="side.config"
            @update:rotateDeg="side.config.rotateDeg = $event"
            @update:scaleRatio="handleUpdateScaleSize(side, $event)"
          )
            template(#imageCropArea="{ innerScaleSize }")
              image-crop-area(
                :ref="(el) => handleRefUpdate(side.sideName, el)"
                :config="side.config"
                :cropRectSize="cropRectSize"
                @update:options="Object.assign(side.config.options, $event)"
              )
                div(class="mt-1 absolute w-full")
                  div(class="h-2 flex items-center border-r-2 border-l-2 border-grey-900")
                    div(class="h-0.5 bg-grey-900 w-full")
                  div(class="text-caption text-grey-900 font-bold text-center") {{ `${innerScaleSize} cm` }}
        div(class="w-125 h-125 bg-grey-200 ml-21 grid grid-cols-3 grid-rows-3")
          div(v-for="i in 9" class="overflow-hidden" :key="i")
            cropped-image(
              :config="side.config"
              :previewScaleRatio="previewScaleRatio"
              :movable="false"
            )
    div(class="absolute invisible w-125 h-125 grid grid-cols-3 grid-rows-3 inset-0")
      div(ref="previewRect")
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted } from 'vue'
import useMaterialImage from '@/composables/useMaterialImage'
import useNavigation from '@/composables/useNavigation'
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import CroppedImage from '@/components/common/cropper/CroppedImage.vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import { Cropper, pixelToCm } from '@/utils/cropper'
import type {
  Side,
  SideName,
  U3mCropRecord,
  MaterialImage,
} from '@/utils/cropper'
import { MODAL_TYPE } from '@/utils/constants'

interface U3mSide extends Side {
  title: string
  scaleSizeInCm: number
  scaleStartInCm: number
}

const { t } = useI18n()
const store = useStore()
const { goToProgress } = useNavigation()
const previewRect = ref<HTMLDivElement | null>(null)

const refFaceSide = ref<InstanceType<typeof ImageCropArea> | null>(null)
const refBackSide = ref<InstanceType<typeof ImageCropArea> | null>(null)

const material = computed(() => store.getters['assets/material'])
const {
  faceSideImg,
  backSideImg,
}: {
  faceSideImg: MaterialImage
  backSideImg: MaterialImage
} = material.value
const cropRectSize = 176
const faceSide = ref<U3mSide>()
const backSide = ref<U3mSide>()
const sides = computed(() => {
  return [faceSide.value, backSide.value].filter((s) => !!s) as U3mSide[]
})
const previewScaleRatio = computed(() =>
  previewRect.value ? previewRect.value.clientWidth / cropRectSize : 1
)

const defaultScaleSizeInCm = 4

const scaleOptions = {
  min: 1,
  max: 21,
  step: 0.1,
}

let faceSideCropImg: File | null = null
let backSideCropImg: File | null = null

const { isDoubleSideMaterial, isFaceSideMaterial, faceSideUrl, backSideUrl } =
  useMaterialImage(material.value, 'u3m')

const hasNext = ref(isDoubleSideMaterial && faceSideUrl && backSideUrl)
const isAtSecondStep = ref(false)
const currentSide = computed<SideName>(() => {
  return isFaceSideMaterial || (isDoubleSideMaterial && !isAtSecondStep.value)
    ? 'refFaceSide'
    : 'refBackSide'
})

const getNext = async () => {
  store.dispatch('helper/pushModalLoading')
  faceSideCropImg = await refFaceSide.value?.cropImage()
  hasNext.value = false
  isAtSecondStep.value = true
  store.dispatch('helper/closeModalLoading')
}

const goBack = () => {
  hasNext.value = true
  isAtSecondStep.value = false
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
  const mainRulerInCm = Math.min(widthInCm, heightInCm)
  side.config.scaleRatio = mainRulerInCm / newScaleSizeInCm
  side.scaleSizeInCm = newScaleSizeInCm
}

const confirm = async () => {
  store.dispatch('helper/pushModalLoading')
  if (currentSide.value === 'refFaceSide') {
    faceSideCropImg = await refFaceSide.value?.cropImage()
  } else {
    backSideCropImg = await refBackSide.value?.cropImage()
  }

  const toRecord = (side?: U3mSide): U3mCropRecord | null => {
    if (!side) {
      return null
    }

    const { options, rotateDeg } = side.config
    return {
      squareCropRecord: {
        x: Number(options.x.toFixed(1)),
        y: Number(options.y.toFixed(1)),
        rotateDeg: Number(rotateDeg.toFixed(1)),
        scaleRatio: Number(side.scaleSizeInCm.toFixed(1)),
      },
    }
  }

  await store.dispatch('assets/generateU3m', {
    faceSideCropImg,
    backSideCropImg,
    isAutoRepeat: false,
    faceSideCropImageRecord: toRecord(faceSide.value),
    backSideCropImageRecord: toRecord(backSide.value),
  })

  store.dispatch('helper/closeModalLoading')
  closeModal()

  store.dispatch('helper/openModalConfirm', {
    type: MODAL_TYPE.LOADING,
    header: t('EE0121'),
    contentText: t('EE0122', { RR0008: t('RR0008') }),
    primaryBtnText: t('UU0103'),
    secondaryBtnText: t('UU0090'),
    secondaryBtnHandler: () => goToProgress('u3m'),
  })
}

const handleRefUpdate = (
  sideName: SideName,
  el: InstanceType<typeof ImageCropArea>
) => {
  if (sideName === 'refFaceSide') {
    refFaceSide.value = el
  }
  if (sideName === 'refBackSide') {
    refBackSide.value = el
  }
}

const closeModal = () => store.dispatch('helper/closeModal')

onMounted(async () => {
  const getSide = async (
    sideName: SideName,
    sideTitle: string,
    imageSrc: string,
    image: MaterialImage
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
      image.u3mCropRecord.squareCropRecord?.scaleRatio || defaultScaleSizeInCm
    config.scaleRatio = widthInCm / scaleSizeInCm
    if (image.u3mCropRecord.squareCropRecord) {
      const { x, y, rotateDeg } = image.u3mCropRecord.squareCropRecord
      config.options.x = x
      config.options.y = y
      config.rotateDeg = rotateDeg
    }
    return {
      sideName,
      title: sideTitle,
      config,
      scaleSizeInCm,
      scaleStartInCm: scaleSizeInCm,
      rotateStart: config.rotateDeg,
    }
  }

  if (faceSideUrl) {
    faceSide.value = await getSide(
      'refFaceSide',
      t('EE0051'),
      faceSideUrl,
      faceSideImg
    )
  }

  if (backSideUrl) {
    backSide.value = await getSide(
      'refBackSide',
      t('EE0052'),
      backSideUrl,
      backSideImg
    )
  }
})
</script>
