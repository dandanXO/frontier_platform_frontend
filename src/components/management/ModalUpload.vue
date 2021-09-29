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
      img(v-else-if="uploadStatus === 'none' && image === ''" class="w-50 h-50" :src="image"
        :class="{'rounded-full': uploadStatus === 'none'}")
      svg-icon(v-else-if="uploadStatus === 'uploading'" iconName="loading" size="100" class="justify-self-end cursor-pointer text-brand-dark")
      image-crop(v-else-if="uploadStatus === 'done' || uploadStatus === 'croping'" :cropRectSize="cropRectSize")
      img(v-else class="w-50 h-50" :src="image"
        :class="{'rounded-full': uploadStatus === 'none'}")
      div(v-if="uploadStatus === 'croping'" class="w-full absolute bottom-0 flex justify-center")
        svg-icon(iconName="loading" size="50" class="justify-self-end cursor-pointer text-brand-dark" @click="closeModal")
  div(class="h-25 flex justify-center items-center")
    div(v-if="uploadStatus === 'done'" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" class="h-10" :disabled="btnDisabled" @click="closeModal") {{$t('b.cancel') }}
      btn(size="md" class="h-10" :disabled="btnDisabled" @click="confirm") {{$t('b.confirm')}}
    div(v-else-if="uploadStatus === 'none' && image !== ''" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" class="h-10"  @click="innerRemoveHandler") {{$t('b.remove') }}
      btn(size="md" class="h-10"  @click="uploadImg") {{$t('b.changeLogo')}}
    btn(v-else size="md" class="h-10" :disabled="btnDisabled") {{$t('b.confirm')}}
</template>

<script>
import { ref, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import ImageCrop from '@/components/management/logo/ImageCrop.vue'
import * as htmlToImage from 'html-to-image'
import ImageOperator from '@/utils/imageOperator.js'

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
    const uploadStatus = computed(() => store.getters['helper/uploadImage/getUploadStatus'])
    const uploadImgConfig = computed(() => store.getters['helper/uploadImage/getUploadImgConfig'])

    const btnDisabled = computed(() => {
      return ['none', 'croping', 'uploading'].includes(uploadStatus.value)
    })

    const closeModal = () => {
      store.commit('helper/uploadImage/SET_uploadStatus', 'none')
      store.dispatch('helper/closeModal')
    }

    const cropRectSize = ref(200)

    async function uploadImg () {
      new ImageOperator(cropRectSize.value).uploadImg()
    }

    function onDrop (evt) {
      new ImageOperator(cropRectSize.value).onDropImg(evt)
    }

    function confirm () {
      const cropTarget = document.getElementById('crop-target')
      store.commit('helper/uploadImage/SET_uploadStatus', 'croping')
      htmlToImage.toJpeg(cropTarget).then((dataUrl) => {
        props.uploadHandler(dataURLtoBlob(dataUrl), dataURLtoBlob(uploadImgConfig.value.src))
        closeModal()

        // used to see the croped image in local
        // const link = document.createElement('a')
        // link.download = 'my-image-name.jpeg'
        // link.href = dataUrl
        // link.click()
      })
    }

    function dataURLtoBlob (dataurl) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    }

    const innerRemoveHandler = async () => {
      await props.removeHandler()
      closeModal()
    }

    onUnmounted(() => {
      store.commit('helper/uploadImage/SET_uploadStatus', 'none')
    })

    return {
      uploadStatus,
      btnDisabled,
      closeModal,
      confirm,
      uploadImg,
      innerRemoveHandler,
      onDrop,
      cropRectSize
    }
  }
}
</script>
