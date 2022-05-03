<template lang="pug">
div(class="relative")
  div(class="absolute" :style="cropRectStyle")
    cropped-image(:config="config" isTransparent @update="updateOptions")
    slot
  div(class="overflow-hidden bg-black-0" :style="cropRectStyle")
    div(class="cursor-move" :style="cropRectStyle")
      cropped-image(:config="config" @update="updateOptions")
  div(class="corner absolute w-4.5 h-4.5 border-t-2 border-l-2 top-0 left-0 border-primary")
  div(class="corner absolute w-4.5 h-4.5 border-t-2 border-r-2 top-0 right-0 border-primary")
  div(class="corner absolute w-4.5 h-4.5 border-b-2 border-l-2 bottom-0 left-0 border-primary")
  div(class="corner absolute w-4.5 h-4.5 border-b-2 border-r-2 bottom-0 right-0 border-primary")
  teleport(to="body")
    div(ref="cropRect" class="w-0 h-0 overflow-hidden")
      div(:style="styleSize")
        cropped-image(:config="config" :movable="false" :previewScaleRatio="realSize / cropRectSize")
</template>

<script setup>
import { ref, computed } from 'vue'
import domtoimage from 'dom-to-image'
import CroppedImage from '@/components/cropper/CroppedImage.vue'
import { dataUrlToBlob } from '@/utils/fileOperator'
import tempFilenameGenerator from '@/utils/temp-filename-generator'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  cropRectSize: {
    type: Number,
    default: 0
  },
  isU3m: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:options'])

const cropRect = ref(null)

const cropRectStyle = computed(() => {
  return {
    width: `${props.cropRectSize}px`,
    height: `${props.cropRectSize}px`
  }
})

// 為了讓後端製作更精準的3D模型，裁切布片時要額外在每一邊增加0.2公分的寬度
// 也就是原本使用者裁切5公分的布片，真正送到後端是5.4公分，但後端回傳會提供已經去掉0.4公分邊界的圖片
const borderPixelWidth = computed(() => props.isU3m ? 0.2 / (2.54 / props.config.dpi) : 0)

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
    height: `${realSize.value}px`,
    padding: `${borderPixelWidth.value}px`
  }
})

const updateOptions = (option) => {
  emit('update:options', option)
}

const cropImage = () => {
  return new Promise((resolve, reject) => {
    /**
     * Because image is often missing on first render on Safari iOS,
     * so we need to run domtoimage.toJpeg() twice.
     * Source: https://github.com/tsayen/dom-to-image/issues/343
     */
    domtoimage.toJpeg(cropRect.value, {}).then(() => {
      domtoimage.toJpeg(cropRect.value, {
        width: realSize.value + (borderPixelWidth.value * 2),
        height: realSize.value + (borderPixelWidth.value * 2)
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

defineExpose({
  cropImage
})
</script>
