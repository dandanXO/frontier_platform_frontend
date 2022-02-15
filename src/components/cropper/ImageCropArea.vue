<template lang="pug">
div(class="relative")
  div(class="absolute" :style="cropRectStyle")
    cropped-image(:config="config" isTransparent @update="updateOptions")
    slot
  div(ref="cropRectGeneral" class="overflow-hidden bg-black-0" :style="cropRectStyle")
    div(class="cursor-move" :style="cropRectStyle")
      cropped-image(:config="config" @update="updateOptions")
  div(class="corner absolute w-4.5 h-4.5 border-t-2 border-l-2 top-0 left-0 border-primary")
  div(class="corner absolute w-4.5 h-4.5 border-t-2 border-r-2 top-0 right-0 border-primary")
  div(class="corner absolute w-4.5 h-4.5 border-b-2 border-l-2 bottom-0 left-0 border-primary")
  div(class="corner absolute w-4.5 h-4.5 border-b-2 border-r-2 bottom-0 right-0 border-primary")
  teleport(to="body")
    div(v-if="!lowResolution" ref="cropRectExact" class="w-0 h-0 overflow-hidden bg-black-0")
      div(:style="styleSize")
        cropped-image(:config="config" :movable="false" :previewScaleRatio="realSize/cropRectSize")
</template>

<script>
import { ref, computed } from 'vue'
import domtoimage from 'dom-to-image'
import CroppedImage from '@/components/cropper/CroppedImage'
import { dataUrlToBlob } from '@/utils/fileOperator'
import tempFilenameGenerator from '@/utils/temp-filename-generator'

export default {
  name: 'ImageCropArea',
  components: { CroppedImage },
  props: {
    config: {
      type: Object,
      required: true
    },
    cropRectSize: {
      type: Number,
      default: 0
    },
    lowResolution: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:options'],
  setup (props, { emit }) {
    const cropRectGeneral = ref(null)
    const cropRectExact = ref(null)

    const cropRectStyle = computed(() => {
      return {
        width: `${props.cropRectSize}px`,
        height: `${props.cropRectSize}px`
      }
    })

    const realSize = computed(() => {
      if (props.config.image.width > props.config.image.height) {
        return props.config.image.height / props.config.scaleRatio
      } else {
        return props.config.image.width / props.config.scaleRatio
      }
    })

    const styleSize = computed(() => {
      return {
        width: `${realSize.value}px`,
        height: `${realSize.value}px`
      }
    })

    const updateOptions = (option) => {
      emit('update:options', option)
    }

    const cropImage = () => {
      return new Promise((resolve, reject) => {
        const cropRect = props.lowResolution ? cropRectGeneral.value : cropRectExact.value

        /**
         * Because image is often missing on first render on Safari iOS,
         * so we need to run domtoimage.toJpeg() twice.
         * Source: https://github.com/tsayen/dom-to-image/issues/343
         */
        domtoimage.toJpeg(cropRect, {}).then(() => {
          domtoimage.toJpeg(cropRect, {
            width: props.lowResolution ? cropRect.clientWidth : realSize.value,
            height: props.lowResolution ? cropRect.clientHeight : realSize.value
          })
            .then(dataUrl => {
              const fileName = `${tempFilenameGenerator()}.jpeg`
              const blob = dataUrlToBlob(dataUrl)
              resolve(new File([blob], fileName, { type: 'image/jpeg' }))
            })
            .catch(error => reject(error))
        })
      })
    }

    return {
      realSize,
      styleSize,
      cropRectStyle,
      cropRectGeneral,
      cropRectExact,
      updateOptions,
      cropImage
    }
  }
}
</script>
