<template lang="pug">
div(class="relative")
  div(class="absolute" :style="cropRectStyle")
    cropped-image(
      :config="config"
      isTransparent
      @update="updateOptions"
      @load="handleImgLoad"
    )
    slot
  div(
    class="overflow-hidden bg-grey-0"
    :style="cropRectStyle"
    :class="{ 'rounded-full': isCircular }"
  )
    div(class="cursor-move" :style="cropRectStyle")
      cropped-image(
        :config="config"
        @update="updateOptions"
        @load="handleImgLoad"
      )
  template(v-if="!isCircular")
    div(class="border-t-2 border-l-2 top-0 left-0" :class="basedBorderStyles")
    div(class="border-t-2 border-r-2 top-0 right-0" :class="basedBorderStyles")
    div(class="border-b-2 border-l-2 bottom-0 left-0" :class="basedBorderStyles")
    div(class="border-b-2 border-r-2 bottom-0 right-0" :class="basedBorderStyles")
  teleport(to="body")
    div(ref="cropRect" class="w-0 h-0 overflow-hidden -z-1")
      div(:style="styleSize")
        cropped-image(
          :config="config"
          :movable="false"
          :previewScaleRatio="realSize / cropRectSize"
          @load="handleImgLoad"
        )
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import html2canvas from 'html2canvas'
import CroppedImage from '@/components/common/cropper/CroppedImage.vue'
import { dataUrlToBlob } from '@/utils/fileOperator'
import tempFilenameGenerator from '@/utils/temp-filename-generator'
import { THEME } from '@/utils/constants'

const IMAGE_COUNT = 3

const props = defineProps({
  theme: {
    type: String,
    default: THEME.LIGHT,
  },
  config: {
    type: Object,
    required: true,
  },
  cropRectSize: {
    type: Number,
    default: 0,
  },
  isCircular: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:options', 'load'])

const cropRect = ref(null)

const cropRectStyle = computed(() => {
  return {
    width: `${props.cropRectSize}px`,
    height: `${props.cropRectSize}px`,
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
    height: `${realSize.value}px`,
  }
})

const updateOptions = (option) => {
  emit('update:options', option)
}

const imgLoadCount = ref(0)
const isAllImgLoad = computed(() => imgLoadCount.value >= IMAGE_COUNT)
const handleImgLoad = () => {
  imgLoadCount.value += 1
}
watch(isAllImgLoad, () => {
  if (isAllImgLoad.value) {
    emit('load')
  }
})

const basedBorderStyles = computed(() => {
  const styles = ['corner', 'absolute', 'w-4.5', 'h-4.5']
  if (props.theme === THEME.LIGHT) {
    styles.push('border-grey-900')
  } else {
    styles.push('border-grey-100')
  }
  return styles
})

const cropImage = () => {
  const classList = [
    'overflow-hidden',
    props.theme === THEME.LIGHT ? 'bg-grey-0' : 'bg-grey-900',
  ]

  return new Promise((resolve, reject) => {
    cropRect.value.style.width = styleSize.value.width
    cropRect.value.style.height = styleSize.value.height
    document.body.classList.add(...classList)
    html2canvas(cropRect.value, {
      allowTaint: true,
      useCORS: true,
      width: realSize.value,
      height: realSize.value,
      scale: 1,
    }).then((canvas) => {
      cropRect.value.style.width = 0
      cropRect.value.style.height = 0
      document.body.classList.remove(...classList)
      const dataUrl = canvas.toDataURL('image/jpeg')
      const fileName = `${tempFilenameGenerator()}.jpeg`
      const blob = dataUrlToBlob(dataUrl)
      resolve(new File([blob], fileName, { type: 'image/jpeg' }))
    })
  })
}

defineExpose({
  cropImage,
})
</script>
