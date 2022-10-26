<template lang="pug">
modal-behavior(
  :header="title"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="isAllowGoBack ? $t('UU0004') : $t('UU0002')"
  @click:primary="confirm"
  @click:secondary="closeModal"
)
  div(class="w-full flex justify-center items-center")
    cropper-default-layout(
      class="w-70"
      :config="config"
      @update:rotateDeg="config.rotateDeg = $event"
      @update:scaleRatio="config.scaleRatio = $event / 100"
    )
      template(#imageCropArea)
        image-crop-area(
          ref="imageCropper"
          :config="config"
          :cropRectSize="cropRectSize"
          @update:options="Object.assign(config.options, $event)"
        )
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import { Cropper } from '@/utils/cropper'

const props = defineProps({
  title: {
    type: String,
  },
  image: {
    type: [Object, String],
  },
  cropRectSize: {
    type: Number,
    required: true,
  },
  afterCropHandler: {
    type: Function,
    required: true,
  },
})

const store = useStore()
const imageCropper = ref(null)

const cropper = new Cropper({
  src: props.image,
  cropRectSize: props.cropRectSize,
})
const config = reactive(cropper.config)

const confirm = async () => {
  store.dispatch('helper/pushModalLoading')
  const croppedImage = await imageCropper.value?.cropImage()
  await props.afterCropHandler(croppedImage, props.image?.file)
  store.dispatch('helper/closeModalLoading')
  closeModal()
}

const isAllowGoBack = computed(
  () => store.getters['helper/modalPipeline'].length > 1
)

const closeModal = () => {
  store.dispatch('helper/closeModal')
}
</script>
