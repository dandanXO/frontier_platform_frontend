<template lang="pug">
div(class="w-50 h-50 relative")
  div(class="absolute" :style="cropRectStyles")
    croped-image(:imageSrc="image.src" :options="options" @update="updateOptions" isTransparent)
  div(class="overflow-hidden bg-black-0"
    ref="cropRect"
    :style="cropRectStyles"
  )
    div(class="cursor-move" :style="cropRectStyles")
      croped-image(:imageSrc="image.src" :options="options" @update="updateOptions")
</template>

<script>
import CropedImage from '@/components/management/logo/CropedImage.vue'
import * as htmlToImage from 'html-to-image'
import { ref, computed, reactive } from 'vue'
import dataUrlToBlob from '@/utils/dataUrlToBlob'

export default {
  name: 'ImageCrop',
  components: {
    CropedImage
  },
  props: {
    cropRectSize: {
      type: Number,
      required: true
    },
    image: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const cropRect = ref(null)
    const image = reactive(props.image)
    const { width, height } = image
    const aspectRatio = width / height
    const resizeRatio = aspectRatio > 1 ? height / props.cropRectSize : width / props.cropRectSize
    const scaledWidth = aspectRatio > 1 ? width / resizeRatio : props.cropRectSize
    const scaledHeight = aspectRatio > 1 ? props.cropRectSize : height / (resizeRatio)

    const options = reactive({
      x: props.cropRectSize / 2 - scaledWidth / 2,
      y: props.cropRectSize / 2 - scaledHeight / 2,
      scale: 1,
      scaleX: 0,
      scaleY: 0,
      rotate: 0,
      width: scaledWidth,
      height: scaledHeight,
      initWidth: scaledWidth,
      initHeight: scaledHeight,
      imgWidth: scaledWidth,
      imgHeight: scaledHeight
    })

    const cropRectStyles = computed(() => ({
      width: `${props.cropRectSize}px`,
      height: `${props.cropRectSize}px`
    }))

    const updateOptions = (o) => {
      Object.assign(options, o)
    }

    const cropImage = () => {
      return new Promise((resolve, reject) => {
        htmlToImage.toJpeg(cropRect.value)
          .then((dataUrl) => {
            resolve(dataUrlToBlob(dataUrl))

            // used to see the croped image in local
            // const link = document.createElement('a')
            // link.download = 'my-image-name.jpeg'
            // link.href = dataUrl
            // link.click()
          })
          .catch(error => reject(error))
      })
    }

    return {
      cropRectStyles,
      cropRect,
      options,
      updateOptions,
      cropImage
    }
  }
}
</script>
