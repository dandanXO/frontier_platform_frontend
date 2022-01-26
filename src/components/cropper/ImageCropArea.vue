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
    div(
      v-if="!lowResolution"
      ref="cropRectExact"
      class="w-0 h-0 overflow-hidden bg-black-0 box-content border-transparent"
      :style="{ 'border-width': isU3m ? borderPixelWidth + 'px' : 0 }"
    )
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
    },
    isU3m: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:options'],
  setup (props, { emit }) {
    const cropRectGeneral = ref(null)
    const cropRectExact = ref(null)

    const borderPixelWidth = computed(() => {
      // 為了讓後端製作更精準的3D模型，裁切布片時要額外在每一邊增加0.2公分的寬度
      // 也就是原本使用者裁切5公分的布片，真正送到後端是5.4公分，但後端回傳會提供已經去掉0.4公分邊界的圖片
      return props.lowResolution ? 0 : 0.2 / (2.54 / props.config.dpi)
    })

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

    const cropImage = (file) => {
      return new Promise((resolve, reject) => {
        const cropRect = props.lowResolution ? cropRectGeneral.value : cropRectExact.value
        let width = cropRect.clientWidth
        let height = cropRect.clientHeight

        if (props.isU3m) {
          width = realSize.value + borderPixelWidth.value * 2
          height = realSize.value + borderPixelWidth.value * 2
        } else if (!props.lowResolution) {
          width = realSize.value
          height = realSize.value
        }

        domtoimage.toJpeg(cropRect, { width, height, style: { overflow: 'visible' } })
          .then(dataUrl => {
            const fileName = file?.name.length > 0 ? file.name : `${tempFilenameGenerator()}.jpeg`
            const blob = dataUrlToBlob(dataUrl)
            resolve(new File([blob], fileName, { type: 'image/jpeg' }))
          })
          .catch(error => reject(error))
      })
    }

    return {
      realSize,
      styleSize,
      borderPixelWidth,
      cropRectStyle,
      cropRectGeneral,
      cropRectExact,
      updateOptions,
      cropImage
    }
  }
}
</script>
