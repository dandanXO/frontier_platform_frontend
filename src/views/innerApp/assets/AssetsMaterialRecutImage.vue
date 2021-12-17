<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-primary font-bold") {{$t('EE0069')}}
  template(#right)
    btn-group(
      :primaryText="hasNext ? $t('UU0021') : $t('UU0020')"
      @click:primary="hasNext ? getNext() : confirm()"
      :secondaryText="isAtSecondStep ? $t('UU0004') : $t('UU0002')"
      @click:secondary="isAtSecondStep ? goBack() : leavePage()"
    )
  template(#content)
    template(v-for="cropper in croppers")
      div(v-show="cropper.ref === currentSide" class="flex h-full justify-center items-center" :class="[cropper.ref]")
        div
          div(class="mb-4.5 text-center text-primary text-body2 font-bold") {{cropper.title}}
          layout-edit(:image="cropper.image" :cropRectSize="cropRectSize" class="w-82.5")
            template(#imageCropArea="{image, rotationAngle, croppedScaleRatio, scaleSize, cropRectSize}")
              image-crop-area(
                :ref="cropper.ref"
                :image="image"
                :rotationAngle="rotationAngle"
                :croppedScaleRatio="croppedScaleRatio"
                :scaleSize="scaleSize"
                :cropRectSize="cropRectSize"
              )
                template(#croppedImage="{imageSrc, options, croppedScaleRatio, rotationAngle}")
                  teleport(:to="`.${cropper.ref}`")
                    div(class="w-125 h-125 bg-black-400 ml-21 grid grid-cols-3 grid-rows-3")
                      div(v-for="i in 9" ref="previewRect" class="overflow-hidden")
                        cropped-image(
                          :options="options"
                          :imageSrc="imageSrc"
                          :scaleRatio="croppedScaleRatio"
                          :rotationAngle="rotationAngle"
                          :previewScaleRatio="previewScaleRatio"
                          :movable="false"
                        )
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
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
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()
    const previewRect = ref(null)
    const faceSide = ref(null)
    const backSide = ref(null)
    const material = computed(() => store.getters['material/material'])
    const cropRectSize = 208
    const {
      isDoubleSideMaterial,
      isFaceSideMaterial,
      faceSideObj,
      backSideObj
    } = useMaterialImage(material.value, 'u3m')

    const croppers = [
      {
        title: t('EE0051'),
        image: faceSideObj,
        ref: 'faceSide'
      },
      {
        title: t('EE0052'),
        image: backSideObj,
        ref: 'backSide'
      }
    ]

    const previewScaleRatio = computed(() => {
      if (previewRect.value !== null) {
        return previewRect.value.clientWidth / cropRectSize
      } else {
        return 1
      }
    })

    const hasNext = ref(isDoubleSideMaterial && faceSideObj && backSideObj)
    const isAtSecondStep = ref(false)
    const currentSide = computed(() => {
      return isFaceSideMaterial || (isDoubleSideMaterial && !isAtSecondStep.value)
        ? 'faceSide'
        : 'backSide'
    })

    let faceSideCropImg = null
    let backSideCropImg = null

    const getNext = async () => {
      store.dispatch('helper/pushModalLoading')
      faceSideCropImg = await faceSide.value?.cropImage() // 測試換頁時把這個註解掉
      hasNext.value = false
      isAtSecondStep.value = true
      store.dispatch('helper/closeModalLoading')
    }

    const goBack = () => {
      hasNext.value = true
      isAtSecondStep.value = false
    }

    const confirm = async () => {
      store.dispatch('helper/pushModalLoading')
      if (currentSide.value === 'faceSide') {
        faceSideCropImg = await faceSide.value?.cropImage()
      } else {
        backSideCropImg = await backSide.value?.cropImage()
      }

      await store.dispatch('material/generateU3m', {
        faceSideCropImg,
        backSideCropImg,
        isAutoRepeat: false
      })

      store.dispatch('helper/closeModalLoading')
      leavePage()

      store.dispatch('helper/openModalConfirm', {
        title: t('RR0132'),
        content: t('EE0070'),
        primaryText: t('UU0031')
      })
    }

    const leavePage = () => {
      router.go(-1)
    }

    return {
      cropRectSize,
      faceSide,
      backSide,
      previewRect,
      previewScaleRatio,
      hasNext,
      isAtSecondStep,
      currentSide,
      getNext,
      goBack,
      confirm,
      leavePage,
      croppers
    }
  }
}
</script>
