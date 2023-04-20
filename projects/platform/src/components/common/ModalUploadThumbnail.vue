<template lang="pug">
modal-behavior(
  :header="header"
  :secondaryBtnText="$t('UU0002')"
  @click:secondary="closeModal"
)
  template(#note)
    file-upload-error-note(
      v-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
    )
  div(class="w-86 h-100 flex justify-center items-center")
    div(v-if="!isUploading && !haveUploadedImage")
      f-button(size="md" class="mb-6" @click="uploadImg" prependIcon="upload") {{ $t('BB0035') }}
      div(class="grid gap-0.5 text-caption leading-1.6 text-grey-600")
        div {{ $t('RR0243') }}
          span(class="text-grey-600 ml-1") {{ acceptType.join(', ').toUpperCase() }}
        div {{ $t('RR0244') }}
          span(class="text-grey-600 ml-1") 200 x 200 px
        div {{ $t('RR0145') }}
          span(class="text-grey-600 ml-1") {{ fileSizeMaxLimit }} MB
    f-svg-icon(
      v-else-if="isUploading"
      iconName="loading"
      size="100"
      class="justify-self-end cursor-pointer text-primary-500"
    )
    div(v-else class="w-full flex flex-col items-center")
      f-avatar(:imageUrl="thumbnail" type="org" size="4xl" class="mb-9")
      f-button(size="md" @click="uploadImg" prependIcon="tune" class="mb-2.5") {{ $t('UU0019') }}
      f-button(size="md" type="text" @click="removeLogo") {{ $t('UU0016') }}
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ImageOperator } from '@/utils/fileOperator.js'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  header: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  defaultImage: {
    type: String,
  },
  updateHandler: {
    type: Function,
  },
  removeHandler: {
    type: Function,
  },
})

const { t } = useI18n()
const store = useStore()
const cropRectSize = 200
const isUploading = ref(false)
const errorCode = ref('')
const haveUploadedImage = computed(
  () => !props.thumbnail.includes(props.defaultImage)
)

const fileSizeMaxLimit = 5
const acceptType = ['jpeg', 'jpg', 'png']
const imageOperator = new ImageOperator(
  acceptType,
  fileSizeMaxLimit,
  cropRectSize
)

imageOperator.on('uploading', () => (isUploading.value = true))
imageOperator.on('error', (code) => {
  isUploading.value = false
  errorCode.value = code
})

imageOperator.on('finish', (image) => {
  errorCode.value = ''
  store.dispatch('helper/replaceModalBehavior', {
    component: 'modal-crop-image',
    properties: {
      title: props.header,
      image,
      cropRectSize,
      afterCropHandler: async (croppedImage, originalImage) => {
        await props.updateHandler(croppedImage, originalImage)
      },
      isCircular: true,
    },
  })
})

const uploadImg = () => {
  imageOperator.upload()
}

const removeLogo = async () => {
  store.dispatch('helper/pushModalLoading')
  await props.removeHandler()
  store.dispatch('helper/closeModalLoading')
  closeModal()
}

const closeModal = () => {
  store.dispatch('helper/closeModalBehavior')
}
</script>
