<template lang="pug">
modal-behavior(
  :header="$t('EE0050')"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="confirm"
  @click:secondary="closeModal"
)
  div(class="flex")
    div(v-if="isDoubleSideMaterial || isFaceSideMaterial" class="w-70 text-grey-900 text-body2 font-bold text-center mb-3.5") {{ $t("EE0051") }}
    div(v-if="isDoubleSideMaterial" class="w-40")
    div(v-if="isDoubleSideMaterial || !isFaceSideMaterial" class="w-70 text-grey-900 text-body2 font-bold text-center mb-3.5") {{ $t("EE0052") }}
  div(class="flex justify-between" :class="[isExchange ? 'flex-row-reverse' : '']")
    template(v-for="cropper in croppers")
      cropper-default-layout(
        class="w-70 z-100"
        scaleUnit="cm"
        :scaleInputStep="0.1"
        :scaleStart="4"
        :scaleRange="[1, 21]"
        :showScale="!isDoubleSideMaterial"
        :config="cropper.config"
        @update:rotateDeg="cropper.config.rotateDeg = $event"
        @update:scaleRatio="handleUpdateScaleRatio(cropper, $event)"
      )
        template(#imageCropArea="{ innerScaleSize, innerShowScale }")
          image-crop-area(
            :ref="(el => handleRefUpdate(cropper.ref, el))"
            :config="cropper.config"
            :cropRectSize="cropRectSize"
            @update:options="Object.assign(cropper.config.options, $event)"
          )
            div(class="mt-1 absolute w-full")
              div(class="h-2 flex items-center border-r-2 border-l-2 border-grey-900")
                div(class="h-0.5 bg-grey-900 w-full")
              div(class="text-caption text-grey-900 font-bold text-center") {{ innerShowScale ? innerScaleSize : formattedScaleSize }}cm
      div(v-if="isDoubleSideMaterial && croppers.length < 2" class="w-70 h-70 flex justify-center items-center bg-[#F1F2F5]")
        div(class="bg-grey-200" :style="{ width: cropRectSize + 'px', height: cropRectSize + 'px' }")
    div(v-if="isDoubleSideMaterial" class="absolute inset-x-0 w-full flex flex-col items-center transform -translate-y-1.5")
      div(class="text-grey-900 text-body2 flex justify-center items-center mb-3.5 gap-1")
        div {{ $t('EE0098') }}
        div(class="w-15 flex justify-center items-center")
          input(
            v-model.number="formattedScaleSize"
            type="number"
            class="w-full text-right py-1 pr-6 border border-grey-200 rounded"
            step="0.1"
            min="1"
            max="21"
            @change="handleDoubleSideScaleChange"
          )
          span(class="inline-block -ml-6 w-5 text-left") cm
      f-input-range(
        ref="refDoubleSideScale"
        v-model:range="formattedScaleSize"
        v-bind="options"
      )
      div(class="mt-3 cursor-pointer text-grey-900" @click="isExchange = !isExchange")
        f-svg-icon(iconName="swap_horiz" size="24" class="m-auto")
      div(class="mt-2 text-center text-caption") {{ $t("EE0053") }}
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed, reactive, watch, onMounted } from 'vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import useMaterialImage from '@/composables/useMaterialImage'
import { Cropper } from '@/utils/cropper'

const props = defineProps({
  afterCropHandler: {
    type: Function,
    required: true
  }
})

const refDoubleSideScale = ref(null)
const store = useStore()
const material = computed(() => store.getters['assets/material'])
const { faceSideImg, backSideImg } = material.value
const scaleSize = ref(4)
const options = {
  min: 1,
  max: 21,
  step: 0.1,
  tooltips: false,
  orientation: 'vertical'
}
const isExchange = ref(false)
const refFaceSide = ref(null)
const refBackSide = ref(null)
const cropRectSize = 176
const pxPerCm = 2.54 // 1 dpi = 0.393701 pixel/cm; 1 pixel/cm = 2.54 dpi
const croppers = reactive([])
const faceSideConfig = reactive({})
const backSideConfig = reactive({})

const { isDoubleSideMaterial, isFaceSideMaterial, faceSideUrl, backSideUrl } = useMaterialImage(material.value)

watch(
  () => scaleSize.value,
  () => {
    if (faceSideConfig?.config) {
      const baseWidth = Math.min(faceSideConfig.config.image.width, faceSideConfig.config.image.height)
      faceSideConfig.config.scaleRatio = (baseWidth * (pxPerCm / faceSideImg.dpi)) / scaleSize.value
    }
    if (backSideConfig?.config) {
      const baseWidth = Math.min(backSideConfig.config.image.width, backSideConfig.config.image.height)
      backSideConfig.config.scaleRatio = (baseWidth * (pxPerCm / backSideImg.dpi)) / scaleSize.value
    }
  }
)

const formattedScaleSize = computed({
  get: () => scaleSize.value,
  set: (val) => {
    if (val > options.max || val < options.min) return
    scaleSize.value = val
  }
})

const handleUpdateScaleRatio = (cropper, event) => {
  if (faceSideUrl && backSideUrl) {
    return
  }
  const width2Cm = cropper.config.image?.width * (pxPerCm / cropper.config.dpi)
  const height2Cm = cropper.config.image?.height * (pxPerCm / cropper.config.dpi)
  const mainRuler = width2Cm > height2Cm ? height2Cm : width2Cm
  cropper.config.scaleRatio = mainRuler / event
}

const handleDoubleSideScaleChange = (event) => {
  refDoubleSideScale.value.setValue(event.target.value)
}

const confirm = async () => {
  store.dispatch('helper/pushModalLoading')

  const faceSideCropImg = faceSideUrl ? await refFaceSide.value?.cropImage() : null
  const backSideCropImg = backSideUrl ? await refBackSide.value?.cropImage() : null

  await props.afterCropHandler({ faceSideCropImg, backSideCropImg, isExchange: isExchange.value })

  store.dispatch('helper/closeModalLoading')
  closeModal()
}

const handleRefUpdate = (ref, el) => {
  if (ref === 'refFaceSide') {
    refFaceSide.value = el
  }
  if (ref === 'refBackSide') {
    refBackSide.value = el
  }
}

const closeModal = () => store.dispatch('helper/closeModal')

onMounted(async () => {
  if (faceSideUrl) {
    const faceSideCropper = new Cropper({
      src: faceSideUrl,
      dpi: faceSideImg.dpi,
      cropRectSize
    })
    await faceSideCropper.formatImage()
    Object.assign(faceSideConfig, {
      ref: 'refFaceSide',
      config: {
        ...faceSideCropper.config,
        scaleRatio: (faceSideCropper.config.image.width * (pxPerCm / faceSideImg.dpi)) / scaleSize.value
      }
    })
    croppers.push(faceSideConfig)
  }

  if (backSideUrl) {
    const backSideCropper = new Cropper({
      src: backSideUrl,
      dpi: backSideImg.dpi,
      cropRectSize
    })
    await backSideCropper.formatImage()
    Object.assign(backSideConfig, {
      ref: 'refBackSide',
      config: {
        ...backSideCropper.config,
        scaleRatio: (backSideCropper.config.image.width * (pxPerCm / backSideImg.dpi)) / scaleSize.value
      }
    })
    croppers.push(backSideConfig)
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
