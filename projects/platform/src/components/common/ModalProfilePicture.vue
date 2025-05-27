<template lang="pug">
modal-behavior(
  :header="headerText"
  :primaryBtnIcon="isCroppingImage ? undefined : 'edit_pencil'"
  :primaryBtnText="page === 0 ? $t('UU0019') : isCroppingImage ? $t('UU0018') : undefined"
  secondaryBtnIcon="trash"
  :secondaryBtnText="page === 0 ? $t('UU0016') : undefined"
  @click:primary="primaryBtnHandler"
  @click:secondary="removeImage"
  @click:back="goBack"
  modalTheme="success"
  :page="page"
  :showBackButton="true"
  :closable="!isRemovingImage && !isChangingImage"
  data-theme="new"
  actionBtnFullWidth
)
  div(v-if="isCroppingImage" class="flex items-center justify-center w-full")
    cropper-default-layout(
      :config="config"
      :scaleStart="scaleStart"
      :showRotate="false"
      @update:scaleRatio="config.scaleRatio = $event / 100"
    )
      template(#imageCropArea)
        image-crop-area(
          ref="imageCropper"
          :config="config"
          :cropRectSize="cropRectSize"
          @update:options="Object.assign(config.options, $event)"
          :isCircular="true"
        )
  template(v-else)
    div(v-if="!isChangingImage && !isRemovingImage")
      f-avatar(:imageUrl="thumbnail" type="org" size="5xl")
    div(class="w-full space-y-4" v-if="isChangingImage")
      div(
        class="flex items-center justify-center w-full px-10 border border-dashed rounded-lg border-green-500-v1 bg-green-50-v1 py-15"
        data-cy="modal-smart-upload_dropzone"
        @drop.stop.prevent="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      )
        div(class="flex flex-col items-center gap-4")
          div(class="p-5 rounded-full bg-green-500-v1")
            f-svg-icon(iconName="upload" size="24" class="text-white")
          div(class="flex flex-col items-center w-full gap-2")
            p(class="text-sm text-grey-900-v1") {{ $t('RR0484') }}
            f-button(
              class="border-green-200-v1 text-green-500-v1 bg-transparent !font-bold text-sm"
              type="secondary"
              size="md"
              data-cy="modal-smart-upload_browse"
              @click="uploadImg"
            ) {{ $t('DD0038') }}
      div(class="p-2 space-y-1 text-sm")
        p {{ $t('RR0244') }}
        p {{ $t('WW0145') }}
    div(class="flex flex-col items-center w-full space-y-6" v-if="isRemovingImage")
      p(class="text-sm text-center") {{ $t('MA0014') }}
      div(
        class="h-[256px] w-[256px] flex justify-center items-center bg-green-50-v1 rounded-full"
      )
        f-svg-icon(iconName="person" size="48" class="text-green-500-v1")
      f-button(
        class="hover:brightness-110 flex-1 px-3 py-2 text-sm !font-bold transition-all"
        type="primary"
        @click="removeLogo"
      ) {{ $t('UU0182') }}
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ImageOperator, VERSION } from '@frontier/lib'
import { Cropper } from '@/utils/cropper'
import { useNotifyStore } from '@/stores/notify'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
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

const store = useStore()
const { t } = useI18n()

const cropRectSize = 276
const isUploading = ref(false)
const isChangingImage = ref(false)
const isRemovingImage = ref(false)
const isCroppingImage = ref(false)
const page = ref(0)
const originalImage = ref(null)

const notify = useNotifyStore()
const imageCropper = ref(null)
const config = ref(null)
const scaleStart = ref(null)

const errorCode = ref('')

const fileSizeMaxLimit = computed(
  () => store.getters['organization/materialAttachmentUploadSizeLimit']
)

const headerText = computed(() => {
  if (isCroppingImage.value) {
    return t('MA0012')
  } else if (page.value === 0) {
    return t('MA0004')
  } else if (isChangingImage.value) {
    return t('MA0011')
  } else if (isRemovingImage.value) {
    return t('MA0013')
  } else {
    return t('MA0004')
  }
})
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
  isCroppingImage.value = true
  const cropper = new Cropper({
    src: image,
    cropRectSize: cropRectSize,
  })

  originalImage.value = image
  config.value = cropper.config
  scaleStart.value = cropper.config.scaleRatio * 100
})

const primaryBtnHandler = () => {
  if (isCroppingImage.value) {
    confirm()
  } else {
    changeImage()
  }
}

const uploadImg = () => {
  imageOperator.upload()
}

const onDrop = (evt) => {
  imageOperator.onDrop(evt)
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

const changeImage = () => {
  isChangingImage.value = true
  page.value = page.value + 1
}
const removeImage = () => {
  isRemovingImage.value = true
  page.value = page.value + 1
}

const goBack = () => {
  isChangingImage.value = false
  isRemovingImage.value = false
  isCroppingImage.value = false
  page.value = page.value - 1
}

const confirm = async () => {
  store.dispatch('helper/pushModalLoading')
  const croppedImage = await imageCropper.value?.cropImage()
  await props.updateHandler(croppedImage, originalImage.value?.file)
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModalBehavior')
  notify.showNotifySnackbar({
    messageText: t('WW0194'),
    version: VERSION.V2,
    hasCloseButton: false,
    delay: 5000,
  })
}
</script>

<style></style>
