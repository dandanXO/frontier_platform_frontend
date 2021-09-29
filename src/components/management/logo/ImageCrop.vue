<template lang="pug">
div(class="upload__upload-area w-50 h-50 relative")
  template(v-if="uploaded || croping")
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
import { useStore } from 'vuex'

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
    const store = useStore()
    const cropRect = ref(null)
    const rotateDeg = ref(0)
    const uploadStatus = computed(() => store.getters['helper/uploadImage/getUploadStatus'])

    const uploaded = computed(() => {
      return uploadStatus.value === 'done'
    })

    const croping = computed(() => {
      return uploadStatus.value === 'croping'
    })

    const cropRectStyles = computed(() => ({
      width: `${props.cropRectSize}px`,
      height: `${props.cropRectSize}px`
    }))

    return {
      rotateDeg,
      uploaded,
      cropRectStyles,
      cropRect,
      croping
    }
  }
}
</script>
