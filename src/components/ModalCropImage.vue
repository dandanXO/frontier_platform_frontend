<template lang="pug">
div(class="w-86 border-t border-black-400 pt-12")
  div(class="w-full flex justify-center items-center")
    cropper-default-layout(
      class="w-70"
      :config="config"
      @update:rotateDeg="config.rotateDeg = $event"
      @update:scaleRatio="config.scaleRatio = $event"
    )
      template(#imageCropArea)
        image-crop-area(
          ref="imageCropper"
          :config="config"
          :cropRectSize="cropRectSize"
          @update:options="Object.assign(config.options, $event)"
        )
  div(class="h-25 flex justify-center items-center")
    div(class="flex justify-center gap-3")
      btn(size="md" type="secondary" @click="closeModal") {{ isAllowGoBack ? $t('UU0004') : $t('UU0002') }}
      btn(size="md" @click="confirm") {{$t('UU0018')}}
</template>

<script>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import CropperDefaultLayout from '@/components/cropper/layout/CropperDefaultLayout'
import ImageCropArea from '@/components/cropper/ImageCropArea'
import { Cropper } from '@/utils/cropper'

export default {
  name: 'ModalCropImage',
  components: {
    CropperDefaultLayout,
    ImageCropArea
  },
  props: {
    image: {
      type: [Object, String]
    },
    cropRectSize: {
      type: Number,
      required: true
    },
    afterCropHandler: {
      type: Function,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const imageCropper = ref(null)

    const cropper = new Cropper({
      src: props.image,
      cropRectSize: props.cropRectSize
    })
    const config = reactive(cropper.config)

    const confirm = async () => {
      store.dispatch('helper/pushModalLoading')
      const croppedImage = await imageCropper.value?.cropImage(props.image?.file)
      await props.afterCropHandler(croppedImage, props.image?.file)
      store.dispatch('helper/closeModalLoading')
      closeModal()
    }

    const isAllowGoBack = computed(() => store.getters['helper/modalPipeline'].length > 1)

    const closeModal = () => {
      store.dispatch('helper/closeModal')
    }

    return {
      isAllowGoBack,
      closeModal,
      confirm,
      imageCropper,
      config,
      cropper
    }
  }
}
</script>
