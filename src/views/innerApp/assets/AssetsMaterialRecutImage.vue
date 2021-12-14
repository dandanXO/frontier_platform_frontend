<template lang="pug">
div(class="fixed inset-0 z-index:modal pt-16 w-screen h-screen bg-black-0")
  fullscreen-header(
    :title="$t('EE0069')"
    :primaryText ="hasNext ? $t('UU0021') : $t('UU0020')"
    :secondaryText="isAtSecondStep ? $t('UU0004') : $t('UU0002')"
    @click:primary="hasNext ? getNext() : confirm()"
    @click:secondary="isAtSecondStep ? goBack() : leavePage()"
  )
  div(class="flex h-full justify-center items-center")
    div
      div(class="mb-4.5 text-center text-primary text-body2 font-bold") {{isFaceSideNow ? $t("EE0051") : $t("EE0052")}}
      layout-edit(
        :image="currentImage"
        :cropRectSize="cropRectSize"
        :key="currentImage"
        class="w-82.5"
        @update:externalRotationAngle="externalRotationAngle = $event"
        @update:externalCroppedScaleRatio="externalCroppedScaleRatio = $event"
      )
        template(#imageCropArea="{image, rotationAngle, croppedScaleRatio, scaleSize, cropRectSize}")
          image-crop-area(
            ref="imageCropper"
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
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, computed, reactive, onMounted } from 'vue'
import useMaterialImage from '@/composables/useMaterialImage'
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import LayoutEdit from '@/components/imageCropper/scannedImageCropper/LayoutEdit'
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
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()
    const imageCropper = ref(null)
    const previewRect = ref(null)
    const previewScaleRatio = ref(1)
    const material = computed(() => store.getters['material/material'])
    const cropRectSize = 208

    const defaultOptions = () => {
      return {
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
      }
    }

    // These 3 variable are set for getting child component property ('previewRect' will use it)
    const externalOptions = reactive(defaultOptions())
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
    const isAtSecondStep = ref(false)
    const isFaceSideNow = computed(() => isFaceSideMaterial || (isDoubleSideMaterial && !isAtSecondStep.value))
    const currentImage = computed(() => isFaceSideNow.value ? faceSideObj : backSideObj)

    let faceSideCropImg = null
    let backSideCropImg = null

    const getNext = async () => {
      store.dispatch('helper/pushModalLoading')
      faceSideCropImg = await imageCropper.value?.cropImage()
      hasNext.value = false
      isAtSecondStep.value = true
      resetData()
      store.dispatch('helper/closeModalLoading')
    }

    const goBack = () => {
      hasNext.value = true
      isAtSecondStep.value = false
    }

    const confirm = async () => {
      store.dispatch('helper/pushModalLoading')
      if (isFaceSideNow.value) {
        faceSideCropImg = await imageCropper.value?.cropImage()
      } else {
        backSideCropImg = await imageCropper.value?.cropImage()
      }

      await store.dispatch('material/generateU3m', {
        faceSideCropImg,
        backSideCropImg,
        isAutoRepeat: false
      })

      store.dispatch('helper/closeModalLoading')
      leavePage()

      store.dispatch('helper/openModalConfirm', {
        title: t('EE0016'),
        content: t('EE0070'),
        primaryText: t('UU0031')
      })
    }

    const leavePage = () => {
      router.go(-1)
    }

    const resetData = () => {
      Object.assign(externalOptions, defaultOptions())
      externalRotationAngle.value = 0
      externalCroppedScaleRatio.value = 1
    }

    return {
      cropRectSize,
      imageCropper,
      previewRect,
      previewScaleRatio,
      hasNext,
      isAtSecondStep,
      isFaceSideNow,
      getNext,
      goBack,
      confirm,
      leavePage,
      currentImage,
      externalOptions,
      externalRotationAngle,
      externalCroppedScaleRatio
    }
  }
}
</script>
