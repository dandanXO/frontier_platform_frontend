<template lang="pug">
div(class="w-120 border-t border-black-400")
  div(class="w-full flex justify-center items-center border-b border-black-400 overflow-hidden")
    div(class="w-full h-full flex justify-center items-center py-15 relative")
      div(
        v-if="!isUploading && !haveUploadedImage"
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
        v-else-if="isUploading"
        iconName="loading"
        size="100"
        class="justify-self-end cursor-pointer text-brand-dark"
      )
      img(v-else class="w-50 h-50" :src="image")
  div(class="h-25 flex justify-center items-center")
    div(v-if="!isUploading && haveUploadedImage" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="innerRemoveHandler") {{$t('UU0016') }}
      btn(size="md" @click="uploadImg") {{$t('UU0019')}}
    btn(v-else size="md" :disabled="true") {{$t('UU0001')}}
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ImageOperator } from '@/utils/fileOperator.js'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalUploadLogo',
  props: {
    image: {
      type: String,
      default: ''
    },
    removeHandler: {
      type: Function,
      required: true
    },
    afterUploadHandler: {
      type: Function,
      required: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const cropRectSize = ref(200)
    const isUploading = ref(false)
    const haveUploadedImage = computed(() => !!props.image)

    const closeModal = () => {
      store.dispatch('helper/closeModal')
    }

    const imageOperator = new ImageOperator(['jpeg', 'png'], 5, cropRectSize.value)

    imageOperator.on('uploading', () => {
      isUploading.value = true
    })

    imageOperator.on('finish', (image) => {
      if (typeof props.afterUploadHandler === 'function') {
        props.afterUploadHandler(image, cropRectSize.value)
      }
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
            primaryText: t('UU0031')
          })
          break
        case ERROR_CODE.TOO_SMALL:
          store.dispatch('helper/pushModalConfirm', {
            title: t('BB0063'),
            content: t('WW0018'),
            primaryText: t('UU0031')
          })
          break
      }

      isUploading.value = false
    })

    const uploadImg = () => {
      imageOperator.upload()
    }

    const onDrop = (evt) => {
      imageOperator.onDrop(evt)
    }

    const innerRemoveHandler = async () => {
      await props.removeHandler()
      closeModal()
    }

    return {
      isUploading,
      closeModal,
      confirm,
      uploadImg,
      innerRemoveHandler,
      onDrop,
      haveUploadedImage
    }
  }
}
</script>
