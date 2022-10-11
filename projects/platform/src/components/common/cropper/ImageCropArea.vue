<template lang="pug">
div(class="relative")
  div(class="absolute" :style="cropRectStyle")
    cropped-image(:config="config" isTransparent @update="updateOptions")
    slot
  div(class="overflow-hidden bg-grey-0" :style="cropRectStyle")
    div(class="cursor-move" :style="cropRectStyle")
      cropped-image(:config="config" @update="updateOptions")
  div(class="corner absolute w-4.5 h-4.5 border-t-2 border-l-2 top-0 left-0 border-grey-900")
  div(class="corner absolute w-4.5 h-4.5 border-t-2 border-r-2 top-0 right-0 border-grey-900")
  div(class="corner absolute w-4.5 h-4.5 border-b-2 border-l-2 bottom-0 left-0 border-grey-900")
  div(class="corner absolute w-4.5 h-4.5 border-b-2 border-r-2 bottom-0 right-0 border-grey-900")
  teleport(to="body")
    div(ref="cropRect" class="w-0 h-0 overflow-hidden -z-1")
      div(:style="styleSize")
        cropped-image(:config="config" :movable="false" :previewScaleRatio="realSize / cropRectSize")
</template>

<script setup>
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'
import CroppedImage from '@/components/common/cropper/CroppedImage.vue'
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
    cropRect.value.style.width = styleSize.value.width
    cropRect.value.style.height = styleSize.value.height
    document.body.classList.add('overflow-hidden', 'bg-grey-0')
    html2canvas(cropRect.value, {
      allowTaint: true,
      useCORS: true,
      width: realSize.value,
      height: realSize.value,
      scale: 1
    }).then((canvas) => {
      cropRect.value.style.width = 0
      cropRect.value.style.height = 0
      document.body.classList.remove('overflow-hidden', 'bg-grey-0')
      const dataUrl = canvas.toDataURL('image/jpeg')
      const fileName = `${tempFilenameGenerator()}.jpeg`
      const blob = dataUrlToBlob(dataUrl)
      resolve(new File([blob], fileName, { type: 'image/jpeg' }))
    })
  })
}

defineExpose({
  cropImage
})
</script>
