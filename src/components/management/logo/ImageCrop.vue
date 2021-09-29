<template lang="pug">
div(class="upload__upload-area w-50 h-50 relative"
    @drop.stop.prevent="onDrop($event)"
    @dragover.prevent,
    @dragenter.prevent)
  template(v-if="uploaded || croping")
    div(class="upload__uploaded relative")
      div(class="upload__crop-rect absolute"
          :style="cropRectStyles()")
        croped-image(:rotateDeg="rotateDeg" :scaleRatio="cropedScaleRatio" :movable="true" :isTransparent="true")
      div(class="upload__crop-rect overflow-hidden bg-black-0"
          id="crop-target"
          :style="cropRectStyles()"
          ref="cropRect" )
        div(class="target cursor-move" :style="cropRectStyles()")
          croped-image(:rotateDeg="rotateDeg" :scaleRatio="cropedScaleRatio" :movable="true")
</template>

<script>
import CropedImage from '@/components/management/logo/CropedImage.vue'
import FileUtils from '@/utils/fileUtils.js'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ImageCrop',
  components: {
    CropedImage
  },

  setup () {
    const store = useStore()
    const cropRect = ref(null)
    const previewRect = ref(null)
    const cropedScaleRatio = ref(1)
    const scaleSize = ref(4)
    const previewScaleRatio = ref(1)
    const rotateDeg = ref(0)
    const cropedImage = ref(null)
    const uploadStatus = computed(() => store.getters['organization/orgLogo/getUploadStatus'])

    const uploaded = computed(() => {
      return uploadStatus.value === 'done'
    })

    const uploadWarning = computed(() => {
      return store.getters.getUploadWarning
    })

    const croping = computed(() => {
      return uploadStatus.value === 'croping'
    })

    function onBlur () {
      if (rotateDeg.value.toString().length === 0) {
        rotateDeg.value = 0
      }
    }

    function cropRectStyles () {
      return {
        width: '200px',
        height: '200px'
      }
    }
    function uploadImg () {
      FileUtils.uploadImg()
    }

    function onDrop (e) {
      const dt = e.dataTransfer
      const files = dt.files
      FileUtils.onDropImg(files)
    }
    return {
      previewRect,
      cropedImage,
      previewScaleRatio,
      cropedScaleRatio,
      rotateDeg,
      uploadImg,
      uploaded,
      uploadWarning,
      cropRectStyles,
      onDrop,
      onBlur,
      scaleSize,
      cropRect,
      croping
    }
  }
}
</script>
