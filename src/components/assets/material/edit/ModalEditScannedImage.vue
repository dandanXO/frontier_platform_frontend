<template lang="pug">
div(class="min-w-86 max-w-196 px-8 pt-5")
  div(class="flex")
    div(v-if="isDoubleSideMaterial || isFaceSideMaterial" class="w-70 text-primary text-body2 font-bold text-center mb-3.5") {{$t('EE0051')}}
    div(v-if="isDoubleSideMaterial" class="w-32")
    div(v-if="isDoubleSideMaterial || !isFaceSideMaterial" class="w-70 text-primary text-body2 font-bold text-center mb-3.5") {{$t('EE0052')}}
  div(class="flex justify-between" :class="[isExchange ? 'flex-row-reverse' : '']")
    template(v-for="cropper in croppers")
      cropper-default-layout(
        v-if="isDoubleSideMaterial || isFaceSideMaterial"
        class="w-70 z-100"
        :showScale="isFaceSideMaterial"
        :config="cropper.config"
        @update:rotateDeg="cropper.config.rotateDeg = $event"
        @update:scaleRatio="cropper.config.scaleRatio = $event"
      )
        template(#imageCropArea="{innerScaleSize, innerShowScale}")
          image-crop-area(
            :ref="cropper.ref"
            :config="cropper.config"
            :cropRectSize="cropRectSize"
            @update:options="Object.assign(cropper.config.options, $event)"
          )
            div(class="mt-1 absolute w-full")
              div(class="h-2 flex items-center border-r-2 border-l-2 border-primary")
                div(class="h-0.5 bg-primary w-full")
              div(class="text-caption text-primary font-bold text-center") {{`${innerShowScale? innerScaleSize : scaleSize} cm`}}
    div(v-if="isDoubleSideMaterial" class="absolute inset-x-0 w-full mx-auto")
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
import { ref, computed, reactive, watch } from 'vue'
import ImageCropArea from '@/components/cropper/ImageCropArea'
import CropperDefaultLayout from '@/components/cropper/layout/CropperDefaultLayout'
import useMaterialImage from '@/composables/useMaterialImage'
import { Cropper } from '@/utils/cropper'

export default {
  name: 'ModalEditScannedImage',
  components: { ImageCropArea, CropperDefaultLayout },
  props: {
    afterCropHandler: {
      type: Function,
      required: true
    }
  },
  async setup (props) {
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const scaleSize = ref(4)
    const isExchange = ref(false)
    const faceSide = ref(null)
    const backSide = ref(null)
    const cropRectSize = 176
    const croppers = []
    let faceSideConfig
    let backSideConfig

    const {
      isDoubleSideMaterial,
      isFaceSideMaterial,
      faceSideObj,
      backSideObj
    } = useMaterialImage(material.value)

    watch(
      () => scaleSize.value,
      () => {
        faceSideConfig.config.scaleRatio = width2Cm(faceSideConfig) / scaleSize.value
        backSideConfig.config.scaleRatio = width2Cm(backSideConfig) / scaleSize.value
      })

    if (faceSideObj) {
      const faceSideCropper = new Cropper(faceSideObj, cropRectSize, true)
      await faceSideCropper.formatImage()
      faceSideConfig = reactive({
        ref: 'faceSide',
        config: faceSideCropper.config
      })
      croppers.push(faceSideConfig)
    }

    if (backSideObj) {
      const backSideCropper = new Cropper(backSideObj, cropRectSize, true)
      await backSideCropper.formatImage()
      backSideConfig = reactive({
        ref: 'backSide',
        config: backSideCropper.config
      })
      croppers.push(backSideConfig)
    }

    const getMaxRatio = computed(() => {
      // 如果 faceSideObj 或 backSideObj 不存在（值會是 false），那麼這邊寬度一定是 0
      const faceSideWidth = Math.floor(width2Cm(faceSideConfig) * 10) / 10
      const backSideWidth = Math.floor(width2Cm(backSideConfig) * 10) / 10

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

      const faceSideCropImg = faceSideObj ? await faceSide.value?.cropImage() : null
      const backSideCropImg = backSideObj ? await backSide.value?.cropImage() : null

      await props.afterCropHandler({ faceSideCropImg, backSideCropImg, isExchange: isExchange.value })

      store.dispatch('helper/closeModalLoading')
      closeModal()
    }

    const width2Cm = (obj) => {
      return obj.config.image.width * (2.54 / 300)
    }

    return {
      cropRectSize,
      faceSide,
      backSide,
      isFaceSideMaterial,
      isDoubleSideMaterial,
      closeModal,
      scaleSize,
      getMaxRatio,
      confirm,
      isExchange,
      croppers
    }
  }
}
</script>
