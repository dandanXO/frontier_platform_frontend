<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-grey-900 font-bold") {{ $t("EE0069") }}
  template(#right)
    btn-group(
      :primaryText="hasNext ? $t('UU0021') : $t('UU0020')"
      @click:primary="hasNext ? getNext() : confirm()"
      :secondaryText="isAtSecondStep ? $t('UU0004') : $t('UU0002')"
      @click:secondary="isAtSecondStep ? goBack() : closeModal()"
    )
  template(#content)
    template(v-for="cropper in croppers")
      div(v-show="cropper.ref === currentSide" class="flex h-full justify-center items-center" :class="[cropper.ref]")
        div
          div(class="mb-4.5 text-center text-grey-900 text-body2 font-bold") {{ cropper.title }}
          cropper-default-layout(
            class="w-82.5"
            scaleUnit="cm"
            :scaleInputStep="0.1"
            :scaleStart="4"
            :scaleRange="[1, 21]"
            :config="cropper.config"
            @update:rotateDeg="cropper.config.rotateDeg = $event"
            @update:scaleRatio="handleUpdateScaleRatio(cropper, $event)"
          )
            template(#imageCropArea="{ innerScaleSize }")
              image-crop-area(
                :ref="(el => handleRefUpdate(cropper.ref, el))"
                :config="cropper.config"
                :cropRectSize="cropRectSize"
                @update:options="Object.assign(cropper.config.options, $event)"
              )
                div(class="mt-1 absolute w-full")
                  div(class="h-2 flex items-center border-r-2 border-l-2 border-grey-900")
                    div(class="h-0.5 bg-grey-900 w-full")
                  div(class="text-caption text-grey-900 font-bold text-center") {{ `${innerScaleSize} cm` }}
        div(class="w-125 h-125 bg-grey-200 ml-21 grid grid-cols-3 grid-rows-3")
          div(v-for="i in 9" class="overflow-hidden")
            cropped-image(
              :config="cropper.config"
              :previewScaleRatio="previewScaleRatio"
              :movable="false"
            )
    div(class="absolute invisible w-125 h-125 grid grid-cols-3 grid-rows-3 inset-0")
      div(ref="previewRect")
</template>

<script setup>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ref, computed, reactive, onMounted } from 'vue'
import useMaterialImage from '@/composables/useMaterialImage'
import useNavigation from '@/composables/useNavigation'
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import CroppedImage from '@/components/common/cropper/CroppedImage.vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import { Cropper } from '@/utils/cropper'

const { t } = useI18n()
const store = useStore()
const { goToProgress } = useNavigation()
const previewRect = ref(null)
const refFaceSide = ref(null)
const refBackSide = ref(null)
const material = computed(() => store.getters['assets/material'])
const { faceSideImg, backSideImg } = material.value
const cropRectSize = 208
const pxPerCm = 2.54 // 1 dpi = 0.393701 pixel/cm; 1 pixel/cm = 2.54 dpi
const croppers = reactive([])
const faceSideConfig = reactive({})
const backSideConfig = reactive({})
const previewScaleRatio = computed(() => previewRect.value ? previewRect.value.clientWidth / cropRectSize : 1)

let faceSideCropImg = null
let backSideCropImg = null

const {
  isDoubleSideMaterial,
  isFaceSideMaterial,
  faceSideUrl,
  backSideUrl
} = useMaterialImage(material.value, 'u3m')

const hasNext = ref(isDoubleSideMaterial && faceSideUrl && backSideUrl)
const isAtSecondStep = ref(false)
const currentSide = computed(() => {
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

const handleUpdateScaleRatio = (cropper, event) => {
  const width2Cm = cropper.config.image?.width * (pxPerCm / cropper.config.dpi)
  const height2Cm = cropper.config.image?.height * (pxPerCm / cropper.config.dpi)
  const mainRuler = width2Cm > height2Cm ? height2Cm : width2Cm
  cropper.config.scaleRatio = mainRuler / event
}

const confirm = async () => {
  store.dispatch('helper/pushModalLoading')
  if (currentSide.value === 'refFaceSide') {
    faceSideCropImg = await refFaceSide.value?.cropImage()
  } else {
    backSideCropImg = await refBackSide.value?.cropImage()
  }

  await store.dispatch('assets/generateU3m', {
    faceSideCropImg,
    backSideCropImg,
    isAutoRepeat: false
  })

  store.dispatch('helper/closeModalLoading')
  closeModal()

  store.dispatch('helper/openModalConfirm', {
    type: 2,
    header: t('EE0121'),
    contentText: t('EE0122', { RR0008: t('RR0008') }),
    primaryBtnText: t('UU0103'),
    secondaryBtnText: t('UU0090'),
    secondaryBtnHandler: () => goToProgress('u3m')
  })
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
      title: t('EE0051'),
      config: faceSideCropper.config
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
      title: t('EE0052'),
      config: backSideCropper.config
    })
    croppers.push(backSideConfig)
  }
})
</script>
