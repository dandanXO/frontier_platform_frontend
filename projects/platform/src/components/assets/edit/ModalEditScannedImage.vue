<template lang="pug">
modal-behavior(
  :header="$t('EE0050')"
  :primaryBtnText="$t('UU0018')"
  primaryBtnIcon="done"
  :secondaryBtnText="$t('Edit Later')"
  :primaryBtnDisabled="!isAllSideImgLoaded"
  @click:primary="confirm"
  @click:secondary="closeModal"
  :closable="false"
)
  div(class="flex")
    div(
      v-if="isDoubleSide || sideType === MaterialSideType.FACE_SIDE"
      class="w-70 text-grey-900 text-body2 font-bold text-center mb-3.5"
    ) {{ $t('EE0051') }}
    div(v-if="isDoubleSide" class="w-40")
    div(
      v-if="isDoubleSide || sideType === MaterialSideType.BACK_SIDE"
      class="w-70 text-grey-900 text-body2 font-bold text-center mb-3.5"
    ) {{ $t('EE0052') }}
  div(
    class="flex justify-between min-h-88.5"
    :class="[isExchange ? 'flex-row-reverse' : '']"
  )
    template(v-for="(side, index) in sides" :key="index")
      cropper-default-layout(
        v-if="side != null"
        class="w-70 z-100"
        scaleUnit="cm"
        :scaleInputStep="scaleOptions.step"
        :scaleStart="initScaleSizeInCm"
        :scaleRange="[scaleOptions.min, scaleOptions.max]"
        :showScale="!isDoubleSide"
        :rotateStart="side.rotateStart"
        :config="side.config"
        @update:rotateDeg="side.config.rotateDeg = $event"
        @update:scaleRatio="handleUpdateScaleSize(side, $event)"
      )
        template(#imageCropArea)
          image-crop-area(
            :ref="(el) => handleRefUpdate(side.sideName, el)"
            :config="side.config"
            :cropRectSize="cropRectSize"
            @update:options="Object.assign(side.config.options, $event)"
            @load="handleLoad"
          )
            div(class="mt-1 absolute w-full")
              div(class="h-2 flex items-center border-r-2 border-l-2 border-grey-900")
                div(class="h-0.5 bg-grey-900 w-full")
              div(class="text-caption text-grey-900 font-bold text-center") {{ scaleSizeInCm }}cm
      //- placeholder dom component.
      //- 避免在沒有 faceSide 的情況下，backSide cropper 跑到 faceSide cropper 的位置
      div(v-else)
      div(
        v-if="isDoubleSide && sides.length < 2"
        class="w-70 h-70 flex justify-center items-center bg-[#F1F2F5]"
      )
        div(
          class="bg-grey-250"
          :style="{ width: cropRectSize + 'px', height: cropRectSize + 'px' }"
        )
    div(
      v-if="isDoubleSide"
      class="absolute inset-x-0 w-full h-88.5 flex flex-col items-center"
    )
      f-input-slider(
        ref="refDoubleSideScale"
        :range="scaleSizeInCm"
        @update:range="handleUpdateDoubleMaterialScaleSize"
        v-bind="scaleOptions"
        class="h-full mb-3"
        withInput
        inputUnit="cm"
        :label="$t('EE0098')"
        labelIcon="open_in_full"
      )
      div(class="mt-7 cursor-pointer text-grey-900" @click="isExchange = !isExchange")
        f-svg-icon(iconName="swap" size="32" class="m-auto")
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { ref, computed, onMounted, watch } from 'vue'
import Decimal from 'decimal.js'
import { FInputSlider } from '@frontier/ui-component'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import { Cropper, pixelToCm, toDP1 } from '@/utils/cropper'
import { U3M_CUT_SIDE } from '@/utils/constants'
import type { Side, SquareCropRecord } from '@/types'
import { MaterialSideType } from '@frontier/platform-web-sdk'
import type { MaterialSideImage } from '@frontier/platform-web-sdk'

const props = defineProps<{
  isDoubleSide: boolean
  sideType: MaterialSideType | null
  faceSideImg: MaterialSideImage
  backSideImg: MaterialSideImage
  afterCropHandler: (params: {
    faceSideCropImg: File | null
    backSideCropImg: File | null
    isExchange: boolean
    faceSideCropImageRecord: SquareCropRecord | null
    backSideCropImageRecord: SquareCropRecord | null
  }) => Promise<void>
}>()

const refDoubleSideScale = ref<InstanceType<typeof FInputSlider> | null>(null)
const refFaceSide = ref<InstanceType<typeof ImageCropArea> | null>(null)
const refBackSide = ref<InstanceType<typeof ImageCropArea> | null>(null)

const faceSide = ref<Side>()
const backSide = ref<Side>()
const sides = computed(() => {
  return [faceSide.value, backSide.value]
})

const store = useStore()
const defaultScaleSizeInCm = 4
const initScaleSizeInCm =
  props.faceSideImg.cropRecord?.scaleRatio || defaultScaleSizeInCm
const scaleSizeInCm = ref(initScaleSizeInCm)
const scaleOptions = {
  min: 1,
  max: 21,
  step: 0.1,
  tooltips: false,
  orientation: 'vertical',
  defaultRange: initScaleSizeInCm,
}
const isExchange = ref(false)
const cropRectSize = 176

const handleUpdateScaleSize = (side: Side, newScaleSizeInCm: number) => {
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
  const imgWidthInCm = pixelToCm(widthInPixel, dpi)
  const imgHeightInCm = pixelToCm(heightInPixel, dpi)
  const imgMainRulerInCm = Decimal.min(imgWidthInCm, imgHeightInCm)
  side.config.scaleRatio = imgMainRulerInCm.div(newScaleSizeInCm).toNumber()
  scaleSizeInCm.value = newScaleSizeInCm
}

const handleUpdateDoubleMaterialScaleSize = (
  newScaleSizeInCm: number,
  fromInputChange = false
) => {
  for (let side of sides.value) {
    if (side != null) {
      handleUpdateScaleSize(side, newScaleSizeInCm)
    }
  }
  if (fromInputChange) refDoubleSideScale.value.setValue(newScaleSizeInCm)
}

const faceSideUrl = computed(() => {
  return props.faceSideImg?.originalUrl || null
})

const backSideUrl = computed(() => {
  return props.backSideImg?.originalUrl || null
})

const confirm = async () => {
  store.dispatch('helper/pushModalLoading')

  const getCropImage = async (
    url: string,
    refSide: InstanceType<typeof ImageCropArea> | null
  ) => {
    if (!url || !refSide) {
      return null
    }
    return refSide.cropImage()
  }

  const toRecord = (side?: Side): SquareCropRecord | null => {
    if (!side) {
      return null
    }

    const { options, rotateDeg } = side.config
    return {
      x: toDP1(options.x),
      y: toDP1(options.y),
      rotateDeg: toDP1(rotateDeg),
      scaleRatio: toDP1(scaleSizeInCm.value),
    }
  }

  await props.afterCropHandler({
    isExchange: isExchange.value,
    faceSideCropImg: await getCropImage(faceSideUrl.value, refFaceSide.value),
    backSideCropImg: await getCropImage(backSideUrl.value, refBackSide.value),
    faceSideCropImageRecord: toRecord(faceSide.value),
    backSideCropImageRecord: toRecord(backSide.value),
  })

  store.dispatch('helper/closeModalLoading')
  closeModal()
}

const handleRefUpdate = (
  sideName: U3M_CUT_SIDE,
  el: InstanceType<typeof ImageCropArea>
) => {
  if (sideName === U3M_CUT_SIDE.FACE_SIDE) {
    refFaceSide.value = el
  }
  if (sideName === U3M_CUT_SIDE.BACK_SIDE) {
    refBackSide.value = el
  }
}

const sideImgLoadCount = ref(0)
const isAllSideImgLoaded = computed(
  () =>
    sideImgLoadCount.value >=
    [faceSideUrl.value, backSideUrl.value].filter((url) => !!url).length
)
const handleLoad = () => {
  sideImgLoadCount.value++
}
watch(isAllSideImgLoaded, () => {
  if (isAllSideImgLoaded.value) {
    store.dispatch('helper/closeModalLoading')
  }
})

const closeModal = () => store.dispatch('helper/closeModal')

store.dispatch('helper/pushModalLoading')
onMounted(async () => {
  const getSide = async (
    sideName: U3M_CUT_SIDE,
    sideImage: MaterialSideImage
  ): Promise<Side> => {
    const sideCropper = new Cropper({
      src: sideImage.originalUrl,
      dpi: sideImage.dpi,
      cropRectSize,
    })
    await sideCropper.formatImage()
    const { config } = sideCropper
    const widthInCm = pixelToCm(config.image.width, config.dpi)
    config.scaleRatio = widthInCm.div(scaleSizeInCm.value).toNumber()
    if (sideImage.cropRecord) {
      const { x, y, rotateDeg } = sideImage.cropRecord
      config.options.x = x
      config.options.y = y
      config.rotateDeg = rotateDeg
    }
    return { sideName, config, rotateStart: config.rotateDeg }
  }

  if (props.faceSideImg) {
    faceSide.value = await getSide(U3M_CUT_SIDE.FACE_SIDE, props.faceSideImg)
  }

  if (props.backSideImg) {
    backSide.value = await getSide(U3M_CUT_SIDE.BACK_SIDE, props.backSideImg)
  }
})
</script>
