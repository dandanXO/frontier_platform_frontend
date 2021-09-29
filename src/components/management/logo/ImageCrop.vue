<template lang="pug">
div(class="upload__upload-area w-50 h-50 relative")
  div(class="upload__uploaded relative")
    div(class="upload__crop-rect absolute"
        :style="cropRectStyles")
      croped-image(:rotateDeg="rotateDeg" isTransparent)
    div(class="upload__crop-rect overflow-hidden bg-black-0"
        id="crop-target"
        :style="cropRectStyles"
        ref="cropRect" )
      div(class="target cursor-move" :style="cropRectStyles")
        croped-image(:rotateDeg="rotateDeg")
</template>

<script>
import CropedImage from '@/components/management/logo/CropedImage.vue'
import { ref, computed } from 'vue'

export default {
  name: 'ImageCrop',
  components: {
    CropedImage
  },
  props: {
    cropRectSize: {
      type: Number,
      required: true
    }
  },
  setup (props) {
    const cropRect = ref(null)
    const rotateDeg = ref(0)

    const cropRectStyles = computed(() => ({
      width: `${props.cropRectSize}px`,
      height: `${props.cropRectSize}px`
    }))

    return {
      rotateDeg,
      cropRectStyles,
      cropRect
    }
  }
}
</script>
