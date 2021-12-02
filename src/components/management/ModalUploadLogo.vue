<template lang="pug">
div(class="w-120 border-t border-black-400")
  div(class="w-full flex justify-center items-center border-b border-black-400 overflow-hidden")
    div(class="w-full h-full flex justify-center items-center py-15 relative" :class="{'bg-black-0': uploadStatus === 'done' || uploadStatus === 'croping'}")
      div(
        v-if="uploadStatus === 'none' && !haveUploadedImage"
        class="flex flex-col"
        @drop.stop.prevent="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      )
        btn(size="md" type="secondary" class="h-10 mb-2" @click="uploadImg") {{$t('BB0035') }}
        span(class="text-body2 font-bold mb-2 text-black-500") {{$t('BB0033')}}
        span(class="text-body2 mb-2 text-black-500") {{$t('BB0034')}}
        span(class="text-body2 mb-2 text-black-500") {{$t('BB0059')}}
        span(class="text-body2 mb-2 text-black-500") {{$t('BB0060')}}
      svg-icon(
        v-else-if="uploadStatus === 'uploading'"
        iconName="loading"
        size="100"
        class="justify-self-end cursor-pointer text-brand-dark"
      )
      image-crop(
        v-else-if="uploadStatus === 'done' || uploadStatus === 'croping'"
        ref="imageCroper"
        :cropRectSize="cropRectSize"
        :image="uploadedImage"
      )
      img(v-else class="w-50 h-50" :src="image")
      div(v-if="uploadStatus === 'croping'" class="w-full absolute bottom-0 flex justify-center")
        svg-icon(iconName="loading" size="50" class="justify-self-end cursor-pointer text-brand-dark")
  div(class="h-25 flex justify-center items-center")
    div(v-if="uploadStatus === 'done'" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" :disabled="btnDisabled" @click="closeModal") {{$t('UU0002') }}
      btn(size="md" :disabled="btnDisabled" @click="confirm") {{$t('UU0001')}}
    div(v-else-if="uploadStatus === 'none' && haveUploadedImage" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="innerRemoveHandler") {{$t('UU0016') }}
      btn(size="md" @click="uploadImg") {{$t('UU0019')}}
    btn(v-else size="md" :disabled="btnDisabled") {{$t('UU0001')}}
</template>

<script>
import { ref, reactive, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import ImageCrop from '@/components/management/logo/ImageCrop.vue'
import { ImageOperator } from '@/utils/fileOperator.js'
import { useI18n } from 'vue-i18n'

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

    const haveUploadedImage = computed(() => !!props.image)
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
    const imageOperator = new ImageOperator(['jpeg', 'png'], 5, cropRectSize.value)

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
            title: t('BB0063'),
            content: t(t('WW0016')),
            primaryText: t('UU0001')
          })
          break
        case ERROR_CODE.EXCEED_LIMIT:
          store.dispatch('helper/pushModalConfirm', {
            title: t('BB0063'),
            content: t('WW0017'),
            primaryText: t('UU0001')
          })
          break
        case ERROR_CODE.TOO_SMALL:
          store.dispatch('helper/pushModalConfirm', {
            title: t('BB0063'),
            content: t('WW0018'),
            primaryText: t('UU0001')
          })
          break
      }
      setUploadStatus('none')
    })

    const uploadImg = () => {
      imageOperator.upload()
    }

    const onDrop = (evt) => {
      imageOperator.onDrop(evt)
    }

    const confirm = async () => {
      setUploadStatus('croping')
      await nextTick()
      const cropedImage = await imageCroper.value?.cropImage()
      await props.uploadHandler(cropedImage, uploadedImage.file)
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
      imageCroper,
      haveUploadedImage
    }
  }
}
</script>
