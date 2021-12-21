<template lang="pug">
div(class="w-50 h-50 relative")
  div(class="absolute" :style="cropRectStyle")
    cropped-image(:config="config" isTransparent @update="updateOptions")
    slot
  div(ref="cropRect" class="overflow-hidden bg-black-0" :style="cropRectStyle")
    div(class="cursor-move" :style="cropRectStyle")
      cropped-image(:config="config" @update="updateOptions")
</template>

<script>
import { ref, computed } from 'vue'
import domtoimage from 'dom-to-image'
import CroppedImage from '@/components/cropper/CroppedImage'

export default {
  name: 'ImageCropArea',
  components: { CroppedImage },
  props: {
    config: {
      type: Object,
      required: true
    },
    scaleControl: {
      type: Boolean,
      default: false
    },
    cropRectSize: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:options'],
  setup (props, { emit }) {
    const cropRect = ref(null)

    const cropRectStyle = computed(() => {
      return {
        width: `${props.cropRectSize}px`,
        height: `${props.cropRectSize}px`
      }
    })

    const updateOptions = (option) => {
      emit('update:options', option)
    }

    const cropImage = () => {
      return new Promise((resolve, reject) => {
        if (props.scaleControl) {
          const controllers = cropRect.value.querySelectorAll('.controller-point')
          controllers.forEach(node => node.remove())
        }

        console.log(11111, cropRect.value)

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
      cropRectStyle,
      cropRect,
      updateOptions,
      cropImage
    }
  }
}
</script>
