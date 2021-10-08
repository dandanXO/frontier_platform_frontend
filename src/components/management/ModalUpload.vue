<template lang="pug">
div(class="w-120 border-t border-black-400")
  div(class="w-full flex justify-center items-center border-b border-black-400 overflow-hidden")
    div(class="w-full h-full flex justify-center items-center py-15 relative"
        :class="{'bg-black-500': uploadStatus === 'done' || uploadStatus === 'croping'}")
      div(v-if="uploadStatus === 'none' && image === ''"
        class="flex flex-col"
        @drop.stop.prevent="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      )
        btn(size="md" type="secondary" class="h-10 mb-2" @click="uploadImg") {{$t('b.chooseImageToUpload') }}
        span(class="text-body2 font-bold mb-2 text-black-500") {{$t('b.pictureRestriction')}}
        span(class="text-body2 mb-2 text-black-500") {{$t('b.fileSupported')}}
        span(class="text-body2 mb-2 text-black-500") {{$t('b.imageFormat')}}
        span(class="text-body2 mb-2 text-black-500") {{$t('b.ImageMaxSize')}}
      svg-icon(v-else-if="uploadStatus === 'uploading'" iconName="loading" size="100" class="justify-self-end cursor-pointer text-brand-dark")
      image-crop(ref="imageCroper" v-else-if="uploadStatus === 'done' || uploadStatus === 'croping'" :cropRectSize="cropRectSize" :image="uploadedImage")
      img(v-else class="w-50 h-50" :src="image")
      div(v-if="uploadStatus === 'croping'" class="w-full absolute bottom-0 flex justify-center")
        svg-icon(iconName="loading" size="50" class="justify-self-end cursor-pointer text-brand-dark")
  div(class="h-25 flex justify-center items-center")
    div(v-if="uploadStatus === 'done'" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" :disabled="btnDisabled" @click="closeModal") {{$t('b.cancel') }}
      btn(size="md" :disabled="btnDisabled" @click="confirm") {{$t('b.confirm')}}
    div(v-else-if="uploadStatus === 'none' && image !== ''" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="innerRemoveHandler") {{$t('b.remove') }}
      btn(size="md" @click="uploadImg") {{$t('b.changeLogo')}}
    btn(v-else size="md" :disabled="btnDisabled") {{$t('b.confirm')}}
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import ImageCrop from '@/components/management/logo/ImageCrop.vue'
import ImageOperator from '@/utils/imageOperator.js'
import { useI18n } from 'vue-i18n'
import dataUrlToBlob from '@/utils/dataUrlToBlob'

export default {
  name: 'ModalUpload',
  components: {
    ImageCrop
  },
  props: {
    image: {
      type: String,
      default: ''
    },
    removeHandler: {
      type: Function,
      required: true
    },
    uploadHandler: {
      type: Function,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const { t } = useI18n()
    const uploadStatus = ref('none')
    const uploadedImage = reactive({})
    const imageCroper = ref(null)
    const btnDisabled = computed(() => {
      return ['none', 'croping', 'uploading'].includes(uploadStatus.value)
    })

    const setUploadStatus = (status) => {
      uploadStatus.value = status
    }

    const closeModal = () => {
      setUploadStatus('none')
      store.dispatch('helper/closeModal')
    }

    const cropRectSize = ref(200)
    const imageOperator = new ImageOperator(cropRectSize.value)

    imageOperator.on('uploading', () => {
      setUploadStatus('uploading')
    })
    imageOperator.on('finish', (image) => {
      setUploadStatus('done')
      Object.assign(uploadedImage, image)
    })
    imageOperator.on('error', (errorCode) => {
      const ERROR_CODE = imageOperator.errorCode
      switch (errorCode) {
        case ERROR_CODE.INVALID_TYPE:
          store.dispatch('helper/pushModalConfirm', {
            title: t('b.uploadFailed'),
            content: t(t('err.errorImageFormat')),
            primaryText: t('b.confirm')
          })
          break
        case ERROR_CODE.EXCEED_LIMIT:
          store.dispatch('helper/pushModalConfirm', {
            title: t('b.uploadFailed'),
            content: t('err.errorExceedImageSize'),
            primaryText: t('b.confirm')
          })
          break
        case ERROR_CODE.TOO_SMALL:
          store.dispatch('helper/pushModalConfirm', {
            title: t('b.uploadFailed'),
            content: t('err.errorImageTooSmall'),
            primaryText: t('b.confirm')
          })
          break
      }
      setUploadStatus('none')
    })

    const uploadImg = () => {
      imageOperator.uploadImg()
    }

    const onDrop = (evt) => {
      imageOperator.onDropImg(evt)
    }

    const confirm = async () => {
      setUploadStatus('croping')
      const cropedImage = await imageCroper.value?.cropImage()
      props.uploadHandler(cropedImage, dataUrlToBlob(uploadedImage.src))
      closeModal()
    }

    const innerRemoveHandler = async () => {
      await props.removeHandler()
      closeModal()
    }

    return {
      uploadStatus,
      btnDisabled,
      closeModal,
      confirm,
      uploadImg,
      innerRemoveHandler,
      onDrop,
      cropRectSize,
      uploadedImage,
      imageCroper
    }
  }
}
</script>
