<template lang="pug">
div(class="min-w-86 max-w-196 px-8 pt-5")
  div(class="flex")
    div(v-if="isDoubleSideMaterial || isFaceSide" class="w-70 text-primary text-body2 font-bold text-center mb-3.5") {{$t('EE0051')}}
    div(v-if="isDoubleSideMaterial" class="w-32")
    div(v-if="isDoubleSideMaterial || isBackSide" class="w-70 text-primary text-body2 font-bold text-center mb-3.5") {{$t('EE0052')}}
  div(class="flex" :class="[isExchange ? 'flex-row-reverse' : '']")
    layout-edit(
      v-if="isDoubleSideMaterial || isFaceSide"
      :showScale="isFaceSide"
      :image="faceSideObj"
      :scaleSizeDoubleSide="scaleSize"
      class="w-70"
    )
      template(#imageCropArea="{image, rotationAngle, croppedScaleRatio, scaleSize, cropRectSize}")
        image-crop-area(
          ref="faceSideImageCropper"
          :image="image"
          :rotationAngle="rotationAngle"
          :croppedScaleRatio="croppedScaleRatio"
          :scaleSize="scaleSize"
          :cropRectSize="cropRectSize"
        )
    div(v-if="isDoubleSideMaterial" class="w-32 mx-auto")
      input-range(
        v-model:range="scaleSize"
        :min="1"
        :max="getMaxRatio"
        :width="2"
        :height="166"
        :startAtCenter="true"
        :interval="0.1"
        class="h-54 mt-7"
        direction="ttb"
      )
        template(#min-end)
          svg-icon(iconName="zoom_in" size="20")
        template(#max-end)
          svg-icon(iconName="zoom_out" size="20")
      div(class="mt-5" @click="isExchange = !isExchange")
        svg-icon(iconName="swap_horiz" size="24" class="text-primary cursor-pointer m-auto")
      div(class="mt-3.5 text-center text-primary text-caption") {{$t('EE0053')}}
    layout-edit(
      v-if="isDoubleSideMaterial || isBackSide"
      :showScale="isBackSide"
      :image="backSideObj"
      :scaleSizeDoubleSide="scaleSize"
      class="w-70"
    )
      template(#imageCropArea="{image, rotationAngle, croppedScaleRatio, scaleSize, cropRectSize}")
        image-crop-area(
          ref="backSideImageCropper"
          :image="image"
          :rotationAngle="rotationAngle"
          :croppedScaleRatio="croppedScaleRatio"
          :scaleSize="scaleSize"
          :cropRectSize="cropRectSize"
        )
  btn-group(
    class="h-25"
    :primaryText="$t('UU0018')"
    @click:primary="confirm"
    :secondaryButton="true"
    @click:secondary="closeModal"
  )
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import ImageCropArea from '@/components/imageCropper/scannedImageCropper/ImageCropArea'
import LayoutEdit from '@/components/imageCropper/scannedImageCropper/LayoutEdit'
import { SIDE_TYPE } from '@/utils/constants'

export default {
  name: 'ModalEditScannedImage',
  components: { ImageCropArea, LayoutEdit },
  props: {
    afterCropHandler: {
      type: Function,
      required: true
    }
  },
  async setup (props) {
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const { isDoubleSideMaterial, sideType, faceSideImg, backSideImg } = material.value
    const scaleSize = ref(4)
    const isExchange = ref(false)
    const faceSideImageCropper = ref(null)
    const backSideImageCropper = ref(null)

    const isFaceSide = !isDoubleSideMaterial && sideType === SIDE_TYPE.FACE
    const isBackSide = !isDoubleSideMaterial && sideType === SIDE_TYPE.BACK

    const getImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          const { width, height, src } = img
          resolve({ width, height, src })
        }

        img.src = url
      })
    }

    const faceSideObj = !!faceSideImg.original && await getImage(faceSideImg.original)
    const backSideObj = !!backSideImg.original && await getImage(backSideImg.original)

    const getMaxRatio = computed(() => {
      const dpi = 300
      const cmPerPixel = 2.54 / dpi

      // 如果 faceSideObj 或 backSideObj 不存在（值會是 false），那麼這邊寬度一定是 0
      const faceSideWidth = Math.floor((faceSideObj.width * cmPerPixel) * 10) / 10
      const backSideWidth = Math.floor((backSideObj.width * cmPerPixel) * 10) / 10

      if (faceSideWidth === 0) {
        return Math.min(10, backSideWidth)
      } else if (backSideWidth === 0) {
        return Math.min(10, faceSideWidth)
      } else {
        return Math.min(10, Math.min(faceSideWidth, backSideWidth))
      }
    })

    const closeModal = () => { store.dispatch('helper/closeModal') }

    const confirm = async () => {
      store.dispatch('helper/pushModalLoading')

      const faceSideCropImg = faceSideObj ? await faceSideImageCropper.value?.cropImage() : null
      const backSideCropImg = backSideObj ? await backSideImageCropper.value?.cropImage() : null

      await props.afterCropHandler({ faceSideCropImg, backSideCropImg, isExchange: isExchange.value })

      store.dispatch('helper/closeModalLoading')
      closeModal()
    }

    return {
      faceSideImageCropper,
      backSideImageCropper,
      isFaceSide,
      isBackSide,
      isDoubleSideMaterial,
      faceSideObj,
      backSideObj,
      closeModal,
      scaleSize,
      getMaxRatio,
      confirm,
      isExchange
    }
  }
}
</script>
