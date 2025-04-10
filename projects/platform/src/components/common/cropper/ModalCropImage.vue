<template lang="pug">
modal-behavior(
  :header="title"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="version === 'v2' ? undefined : isAllowGoBack ? $t('UU0004') : $t('UU0002')"
  @click:primary="confirm"
  @click:secondary="closeModal"
  @click:back="closeModal"
  :version="version"
  :showBackButton="version === 'v2'"
  page="1"
)
  div(class="w-full flex justify-center items-center")
    cropper-default-layout(
      class="w-70"
      :config="config"
      :scaleStart="scaleStart"
      :rotateStart="rotateStart"
      @update:rotateDeg="config.rotateDeg = $event"
      @update:scaleRatio="config.scaleRatio = $event / 100"
    )
      template(#imageCropArea)
        image-crop-area(
          ref="imageCropper"
          :config="config"
          :cropRectSize="cropRectSize"
          @update:options="Object.assign(config.options, $event)"
          :isCircular="isCircular"
        )
</template>

<script setup>
import { reactive, computed, ref, toRaw } from 'vue'
import { useStore } from 'vuex'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import { Cropper, configToPercentScaleRecord } from '@/utils/cropper'
import { useNotifyStore } from '@/stores/notify'
import { VERSION } from '@frontier/constants'

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
  isCircular: {
    type: Boolean,
    default: false,
  },
  cropRecord: {
    type: Object,
  },
  version: {
    type: String,
    default: 'v2',
  },
})

const store = useStore()
const notify = useNotifyStore()
const imageCropper = ref(null)

const cropper = new Cropper({
  src: props.image,
  cropRectSize: props.cropRectSize,
})

if (props.cropRecord) {
  const {
    cropRecord: { scaleRatio, rotateDeg, x, y },
  } = toRaw(props)
  cropper.config.options.x = x
  cropper.config.options.y = y
  cropper.config.scaleRatio = scaleRatio
  cropper.config.rotateDeg = rotateDeg
}
const config = reactive(cropper.config)
const scaleStart = config.scaleRatio * 100
const rotateStart = config.rotateDeg

const confirm = async () => {
  store.dispatch('helper/pushModalLoading')
  const croppedImage = await imageCropper.value?.cropImage()
  const record = configToPercentScaleRecord(config)
  await props.afterCropHandler(croppedImage, props.image?.file, record)
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModalBehavior')
  store.dispatch('helper/closeModalBehavior')
  notify.showNotifySnackbar({
    messageText: t('WW0194'),
    version: VERSION.V2,
    hasCloseButton: false,
    delay: 5000,
  })
}

const isAllowGoBack = computed(
  () => store.getters['helper/modalPipeline'].length > 1
)

const closeModal = () => {
  store.dispatch('helper/closeModal')
}
</script>
