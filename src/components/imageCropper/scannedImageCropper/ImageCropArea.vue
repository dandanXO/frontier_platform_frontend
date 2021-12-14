<template lang="pug">
div(class="relative")
  div(class="absolute" :style="cropRectStyles")
    cropped-image(
      :imageSrc="image.src"
      :options="options"
      :scaleRatio="croppedScaleRatio"
      :rotationAngle="rotationAngle"
      isTransparent
      @update="updateOptions"
    )
    div(class="mt-1 absolute w-full")
      div(class="h-2 flex items-center border-r-2 border-l-2 border-primary")
        div(class="h-0.5 bg-primary w-full")
      div(class="text-caption text-primary font-bold text-center") {{`${scaleSize} cm`}}
  div(ref="cropRect" class="overflow-hidden bg-black-400 relative" :style="cropRectStyles")
    div(class="cursor-move" :style="cropRectStyles")
      cropped-image(
        :imageSrc="image.src"
        :options="options"
        :scaleRatio="croppedScaleRatio"
        :rotationAngle="rotationAngle"
        @update="updateOptions"
      )
</template>

<script>
import CroppedImage from '@/components/imageCropper/scannedImageCropper/CroppedImage'
import { ref, watch, computed, reactive } from 'vue'
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
    croppedScaleRatio: {
      type: Number,
      default: 1
    },
    scaleSize: {
      type: Number,
      default: 4
    },
    image: {
      type: Object,
      required: true
    },
    externalOptions: {
      type: Object
    }
  },
  // Let parent component get internal variable
  emits: ['update:externalOptions'],
  async setup (props, { emit }) {
    const cropRect = ref(null)
    const options = reactive({
      x: 0,
      y: 0,
      scale: 1,
      scaleX: 0,
      scaleY: 0,
      rotate: 0,
      width: props.cropRectSize,
      height: props.cropRectSize,
      initWidth: props.cropRectSize,
      initHeight: props.cropRectSize,
      imgWidth: props.cropRectSize,
      imgHeight: props.cropRectSize
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

    // Let parent component get internal variable
    watch(
      () => options,
      (v) => {
        emit('update:externalOptions', v)
      },
      {
        deep: true
      }
    )

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
