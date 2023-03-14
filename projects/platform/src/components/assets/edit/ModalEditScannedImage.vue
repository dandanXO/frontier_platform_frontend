<template lang="pug">
modal-behavior(
  :header="$t('EE0050')"
  :primaryBtnText="$t('UU0018')"
  primaryBtnIcon="done"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="!isAllSideImgLoaded"
  @click:primary="confirm"
  @click:secondary="closeModal"
  :closable="false"
)
  div(class="flex")
    div(
      v-if="isDoubleSideMaterial || isFaceSideMaterial"
      class="w-70 text-grey-900 text-body2 font-bold text-center mb-3.5"
    ) {{ $t('EE0051') }}
    div(v-if="isDoubleSideMaterial" class="w-40")
    div(
      v-if="isDoubleSideMaterial || !isFaceSideMaterial"
      class="w-70 text-grey-900 text-body2 font-bold text-center mb-3.5"
    ) {{ $t('EE0052') }}
  div(
    class="flex justify-between min-h-88.5"
    :class="[isExchange ? 'flex-row-reverse' : '']"
  )
    template(v-for="side in sides" :key="side.sideName")
      cropper-default-layout(
        class="w-70 z-100"
        scaleUnit="cm"
        :scaleInputStep="scaleOptions.step"
        :scaleStart="initScaleSizeInCm"
        :scaleRange="[scaleOptions.min, scaleOptions.max]"
        :showScale="!isDoubleSideMaterial"
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
      div(
        v-if="isDoubleSideMaterial && sides.length < 2"
        class="w-70 h-70 flex justify-center items-center bg-[#F1F2F5]"
      )
        div(
          class="bg-grey-250"
          :style="{ width: cropRectSize + 'px', height: cropRectSize + 'px' }"
        )
    div(
      v-if="isDoubleSideMaterial"
      class="absolute inset-x-0 w-full h-88.5 flex flex-col items-center"
    )
      div(class="text-grey-900 text-body2 flex justify-center items-center mb-3")
        span {{ $t('EE0098') }}
        f-svg-icon(iconName="open_in_full" size="16" class="ml-2")
      f-button-label(
        size="sm"
        :disabled="!scaleDirty"
        class="mb-3"
        @click="resetDoubleMaterialScaleSize"
      ) {{ $t('RR0255') }}
      f-input-range(
        ref="refDoubleSideScale"
        :range="scaleSizeInCm"
        @update:range="handleUpdateDoubleMaterialScaleSize"
        v-bind="scaleOptions"
        class="h-43 mb-3"
      )
      div(class="w-22")
        f-input-number(
          v-model:value="scaleSizeInCm"
          :step="scaleOptions.step"
          :min="scaleOptions.min"
          :max="scaleOptions.max"
          unit="cm"
          @update:value="handleUpdateDoubleMaterialScaleSize"
          @change="handleUpdateDoubleMaterialScaleSize($event, true)"
        )
      div(class="mt-7 cursor-pointer text-grey-900" @click="isExchange = !isExchange")
        f-svg-icon(iconName="swap" size="32" class="m-auto")
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { ref, computed, onMounted, watch } from 'vue'
import Decimal from 'decimal.js'
import FInputRange from '@frontier/ui-component/src/FInput/FInputRange/FInputRange.vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import useMaterialImage from '@/composables/useMaterialImage'
import { Cropper, pixelToCm, toDP1 } from '@/utils/cropper'
import { U3M_CUT_SIDE } from '@/utils/constants'
import type { Side, SquareCropRecord, ScannedImage } from '@/types'

const props = defineProps<{
  afterCropHandler: (params: {
    faceSideCropImg: File | null
    backSideCropImg: File | null
    isExchange: boolean
    faceSideCropImageRecord: SquareCropRecord | null
    backSideCropImageRecord: SquareCropRecord | null
  }) => Promise<void>
}>()

const refDoubleSideScale = ref<InstanceType<typeof FInputRange> | null>(null)
const refFaceSide = ref<InstanceType<typeof ImageCropArea> | null>(null)
const refBackSide = ref<InstanceType<typeof ImageCropArea> | null>(null)

const faceSide = ref<Side>()
const backSide = ref<Side>()
const sides = computed(() => {
  return [faceSide.value, backSide.value].filter((s) => !!s) as Side[]
})

const store = useStore()
const material = computed(() => store.getters['assets/material'])
const {
  faceSideImg,
  backSideImg,
}: {
  faceSideImg: ScannedImage
  backSideImg: ScannedImage
} = material.value
const defaultScaleSizeInCm = 4
const initScaleSizeInCm: number =
  faceSideImg.cropRecord?.scaleRatio || defaultScaleSizeInCm
const scaleSizeInCm = ref(initScaleSizeInCm)
const scaleOptions = {
  min: 1,
  max: 21,
  step: 0.1,
  tooltips: false,
  orientation: 'vertical',
}
const isExchange = ref(false)
const cropRectSize = 176

const { isDoubleSideMaterial, isFaceSideMaterial, faceSideUrl, backSideUrl } =
  useMaterialImage(material.value)

const scaleDirty = computed(() => scaleSizeInCm.value !== initScaleSizeInCm)

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
    handleUpdateScaleSize(side, newScaleSizeInCm)
  }
  if (fromInputChange) refDoubleSideScale.value.setValue(newScaleSizeInCm)
}

const resetDoubleMaterialScaleSize = () => {
  handleUpdateDoubleMaterialScaleSize(initScaleSizeInCm)
  refDoubleSideScale.value.setValue(initScaleSizeInCm)
}

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
    faceSideCropImg: await getCropImage(faceSideUrl, refFaceSide.value),
    backSideCropImg: await getCropImage(backSideUrl, refBackSide.value),
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
    [faceSideUrl, backSideUrl].filter((url) => !!url).length
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
    imageSrc: string,
    image: ScannedImage
  ): Promise<Side> => {
    const sideCropper = new Cropper({
      src: imageSrc,
      dpi: image.dpi,
      cropRectSize,
    })
    await sideCropper.formatImage()
    const { config } = sideCropper
    const widthInCm = pixelToCm(config.image.width, config.dpi)
    config.scaleRatio = widthInCm.div(scaleSizeInCm.value).toNumber()
    if (image.cropRecord) {
      const { x, y, rotateDeg } = image.cropRecord
      config.options.x = x
      config.options.y = y
      config.rotateDeg = rotateDeg
    }
    return { sideName, config, rotateStart: config.rotateDeg }
  }

  if (faceSideUrl) {
    faceSide.value = await getSide(
      U3M_CUT_SIDE.FACE_SIDE,
      faceSideUrl,
      faceSideImg
    )
  }

  if (backSideUrl) {
    backSide.value = await getSide(
      U3M_CUT_SIDE.BACK_SIDE,
      backSideUrl,
      backSideImg
    )
  }
})
</script>

<style lang="scss" scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;

  &:focus {
    outline: 0;
  }
}
</style>
