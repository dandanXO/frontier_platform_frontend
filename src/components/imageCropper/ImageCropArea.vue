<template lang="pug">
div(class="w-50 h-50 relative")
  div(class="absolute" :style="cropRectStyles")
    cropped-image(
      :imageSrc="image.src"
      :options="options"
      :rotationAngle="rotationAngle"
      isTransparent
      @update="updateOptions"
    )
  div(
    ref="cropRect"
    class="overflow-hidden bg-black-0"
    :style="cropRectStyles"
  )
    div(class="cursor-move" :style="cropRectStyles")
      cropped-image(
        :imageSrc="image.src"
        :options="options"
        :rotationAngle="rotationAngle"
        @update="updateOptions"
      )
</template>

<script>
import CroppedImage from '@/components/imageCropper/CroppedImage.vue'
import { ref, computed, reactive } from 'vue'
import domtoimage from 'dom-to-image'

export default {
  name: 'ImageCropArea',
  components: { CroppedImage },
  props: {
    cropRectSize: {
      type: Number,
      required: true
    },
    rotationAngle: {
      type: Number,
      default: 0
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
        const controllers = cropRect.value.querySelectorAll('.controller-point')
        controllers.forEach(node => node.remove())

        domtoimage.toBlob(cropRect.value, {
          width: cropRect.value.clientWidth,
          height: cropRect.value.clientHeight
        })
          .then(blob => {
            resolve(new File([blob], 'file.name', { type: 'image/jpeg' }))
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
