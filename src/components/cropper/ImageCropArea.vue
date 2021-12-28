<template lang="pug">
div(class="relative")
  div(class="absolute" :style="cropRectStyle")
    cropped-image(:config="config" :scaleControl="scaleControl" isTransparent @update="updateOptions")
    slot
  div(ref="cropRectGeneral" class="overflow-hidden bg-black-0" :style="cropRectStyle")
    div(class="cursor-move" :style="cropRectStyle")
      cropped-image(:config="config" :scaleControl="scaleControl" @update="updateOptions")
  div(class="corner absolute w-4.5 h-4.5 border-t-2 border-l-2 top-0 left-0 border-primary")
  div(class="corner absolute w-4.5 h-4.5 border-t-2 border-r-2 top-0 right-0 border-primary")
  div(class="corner absolute w-4.5 h-4.5 border-b-2 border-l-2 bottom-0 left-0 border-primary")
  div(class="corner absolute w-4.5 h-4.5 border-b-2 border-r-2 bottom-0 right-0 border-primary")
  teleport(to="body")
    div(v-if="!scaleControl" ref="cropRectExact" class="w-0 h-0 overflow-hidden bg-black-0")
      div(:style="styleSize")
        cropped-image(:config="config" :movable="false" :previewScaleRatio="realSize/cropRectSize")
</template>

<script>
import { ref, computed } from 'vue'
import domtoimage from 'dom-to-image'
import CroppedImage from '@/components/cropper/CroppedImage'
import { dataUrltoBlob } from '@/utils/fileOperator'

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
    const cropRectGeneral = ref(null)
    const cropRectExact = ref(null)

    const cropRectStyle = computed(() => {
      return {
        width: `${props.cropRectSize}px`,
        height: `${props.cropRectSize}px`
      }
    })

    const realSize = computed(() => props.config.image.width / props.config.scaleRatio)

    const styleSize = computed(() => {
      return {
        width: `${realSize.value}px`,
        height: `${realSize.value}px`
      }
    })

    const updateOptions = (option) => {
      emit('update:options', option)
    }

    const cropImage = (file) => {
      return new Promise((resolve, reject) => {
        if (props.scaleControl) {
          const controllers = cropRectGeneral.value.querySelectorAll('.controller-point')
          controllers.forEach(node => node.remove())
        }

        const cropRect = props.scaleControl ? cropRectGeneral.value : cropRectExact.value

        domtoimage.toJpeg(cropRect, {
          width: props.scaleControl ? cropRect.clientWidth : realSize.value,
          height: props.scaleControl ? cropRect.clientHeight : realSize.value
        })
          .then(dataUrl => {
            const fileName = file?.name.length > 0 ? file.name : 'file name'
            const blob = dataUrltoBlob(dataUrl)
            resolve(new File([blob], fileName, { type: 'image/jpeg' }))
          })
          .catch(error => reject(error))
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
