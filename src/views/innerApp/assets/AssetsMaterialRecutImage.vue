<template lang="pug">
div(class="fixed inset-0 z-index:modal pt-16 w-screen h-screen bg-black-0")
  fullscreen-header(
    :title="$t('EE0069')"
    :primaryText ="hasNext ? $t('UU0021') : $t('UU0020')"
    :secondaryText="isAtSecondStep ? $t('UU0004') : $t('UU0002')"
    @click:primary="hasNext ? getNext() : confirm()"
    @click:secondary="isAtSecondStep ? goBack() : goToAssets()"
  )
  div(class="flex h-full justify-center items-center")
    div
      div(class="mb-4.5 text-center text-primary text-body2 font-bold") {{isFaceSideMaterial || (isDoubleSideMaterial && hasNext) ? $t("EE0051") : $t("EE0052")}}
      layout-edit(
        :image="currentImage"
        :cropRectSize="cropRectSize"
        class="w-82.5"
        @update:externalRotationAngle="externalRotationAngle = $event"
        @update:externalCroppedScaleRatio="externalCroppedScaleRatio = $event"
      )
        template(#imageCropArea="{image, rotationAngle, croppedScaleRatio, scaleSize, cropRectSize}")
          image-crop-area(
            v-if="isFaceSideMaterial || (isDoubleSideMaterial && hasNext)"
            ref="faceSideImageCropper"
            :image="image"
            :rotationAngle="rotationAngle"
            :croppedScaleRatio="croppedScaleRatio"
            :scaleSize="scaleSize"
            :cropRectSize="cropRectSize"
            @update:externalOptions="Object.assign(externalOptions, $event)"
          )
          image-crop-area(
            v-else
            ref="backSideImageCropper"
            :image="image"
            :rotationAngle="rotationAngle"
            :croppedScaleRatio="croppedScaleRatio"
            :scaleSize="scaleSize"
            :cropRectSize="cropRectSize"
            @update:externalOptions="Object.assign(externalOptions, $event)"
          )
    div(class="w-125 h-125 bg-black-400 ml-21 grid grid-cols-3 grid-rows-3")
      div(v-for="i in 9" ref="previewRect" class="overflow-hidden")
        cropped-image(
          :imageSrc="currentImage.src"
          :options="externalOptions"
          :movable="false"
          :previewScaleRatio="previewScaleRatio"
          :scaleRatio="externalCroppedScaleRatio"
          :rotationAngle="externalRotationAngle"
        )
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import LayoutEdit from '@/components/imageCropper/scannedImageCropper/LayoutEdit'
import { useStore } from 'vuex'
import { ref, computed, reactive, onMounted } from 'vue'
import useMaterialImage from '@/composables/useMaterialImage'
import useNavigation from '@/composables/useNavigation'
import ImageCropArea from '@/components/imageCropper/scannedImageCropper/ImageCropArea'
import CroppedImage from '@/components/imageCropper/scannedImageCropper/CroppedImage'

export default {
  name: 'AssetsMaterialRecutImage',
  components: {
    FullscreenHeader,
    LayoutEdit,
    ImageCropArea,
    CroppedImage
  },
  async setup () {
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const isAtSecondStep = ref(false)
    const previewRect = ref(null)
    const previewScaleRatio = ref(1)
    const cropRectSize = 208
    const { goToAssets } = useNavigation()
    const faceSideImageCropper = ref(null)
    const backSideImageCropper = ref(null)

    // 為了取得 child component 的資料
    const externalOptions = reactive({
      x: 0,
      y: 0,
      scale: 1,
      scaleX: 0,
      scaleY: 0,
      rotate: 0,
      width: cropRectSize,
      height: cropRectSize,
      initWidth: cropRectSize,
      initHeight: cropRectSize,
      imgWidth: cropRectSize,
      imgHeight: cropRectSize
    })
    const externalRotationAngle = ref(0)
    const externalCroppedScaleRatio = ref(1)

    onMounted(() => {
      previewScaleRatio.value = previewRect.value.clientWidth / cropRectSize
    })

    const {
      isDoubleSideMaterial,
      isFaceSideMaterial,
      faceSideObj,
      backSideObj
    } = await useMaterialImage(material.value, 'u3m')

    const hasNext = ref(isDoubleSideMaterial && faceSideObj && backSideObj)

    const currentImage = ref(
      isFaceSideMaterial || (isDoubleSideMaterial && hasNext.value)
        ? faceSideObj
        : backSideObj
    )

    let faceSideCropImg
    let backSideCropImg

    const getNext = async () => {
      store.dispatch('helper/pushModalLoading')
      faceSideCropImg = faceSideObj ? await faceSideImageCropper.value?.cropImage() : null
      hasNext.value = false
      isAtSecondStep.value = true
      currentImage.value = backSideObj
      store.dispatch('helper/closeModalLoading')
    }

    const goBack = () => {
      hasNext.value = true
      isAtSecondStep.value = false
      currentImage.value = faceSideObj
    }

    const confirm = async () => {
      store.dispatch('helper/pushModalLoading')
      if (isFaceSideMaterial || (isDoubleSideMaterial && hasNext.value)) {
        faceSideCropImg = faceSideObj ? await faceSideImageCropper.value?.cropImage() : null
      }

      backSideCropImg = backSideObj ? await backSideImageCropper.value?.cropImage() : null
      await store.dispatch('material/generateU3m', {
        faceSideCropImg,
        backSideCropImg,
        isAutoRepeat: false
      })

      store.dispatch('helper/closeModalLoading')
      goToAssets()
    }

    return {
      cropRectSize,
      previewRect,
      previewScaleRatio,
      faceSideObj,
      backSideObj,
      hasNext,
      isAtSecondStep,
      getNext,
      goBack,
      confirm,
      goToAssets,
      currentImage,
      externalOptions,
      externalRotationAngle,
      externalCroppedScaleRatio,
      faceSideImageCropper,
      backSideImageCropper,
      isDoubleSideMaterial,
      isFaceSideMaterial
    }
  }
}
</script>
