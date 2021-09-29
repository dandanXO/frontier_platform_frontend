<template lang="pug">
div(class="w-120 border-t border-black-400")
  div(class="w-full flex justify-center items-center border-b border-black-400 overflow-hidden")
    div(class="w-full h-full flex justify-center items-center py-15 relative"
        :class="{'bg-black-500': uploadStatus === 'done' || uploadStatus === 'croping'}")
      div(v-if="uploadStatus === 'none' && organization.logo === ''"
        class="flex flex-col")
        btn(size="md" type="secondary" class="h-10 mb-2" @click="uploadImg") {{$t('b.chooseImageToUpload') }}
        span(class="text-body2 font-bold mb-2 text-black-500") {{$t('b.pictureRestriction')}}
        span(class="text-body2 mb-2 text-black-500") {{$t('b.fileSupported')}}
        span(class="text-body2 mb-2 text-black-500") {{$t('b.imageFormat')}}
        span(class="text-body2 mb-2 text-black-500") {{$t('b.ImageMaxSize')}}
      img(v-else-if="uploadStatus === 'none' && organization.logo === ''" class="w-50 h-50" :src="organization.logo"
        :class="{'rounded-full': uploadStatus === 'none'}")
      svg-icon(v-else-if="uploadStatus === 'uploading'" iconName="loading" size="100" class="justify-self-end cursor-pointer text-brand-dark" @click="closeModal")
      image-crop(v-else-if="uploadStatus === 'done' || uploadStatus === 'croping'")
      img(v-else class="w-50 h-50" :src="organization.logo"
        :class="{'rounded-full': uploadStatus === 'none'}")
      div(v-if="uploadStatus === 'croping'" class="w-full absolute bottom-0 flex justify-center")
        svg-icon(iconName="loading" size="50" class="justify-self-end cursor-pointer text-brand-dark" @click="closeModal")
  div(class="h-25 flex justify-center items-center")
    div(v-if="uploadStatus === 'done'" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" class="h-10" :disabled="btnDisabled" @click="cancel") {{$t('b.cancel') }}
      btn(size="md" class="h-10" :disabled="btnDisabled" @click="confirm") {{$t('b.confirm')}}
    div(v-else-if="uploadStatus === 'none' && organization.logo !== ''" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" class="h-10"  @click="removeOrgLogo") {{$t('b.remove') }}
      btn(size="md" class="h-10"  @click="uploadImg") {{$t('b.changeLogo')}}
    btn(v-else size="md" class="h-10" :disabled="btnDisabled") {{$t('b.confirm')}}
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import ImageCrop from '@/components/management/logo/ImageCrop.vue'
import * as htmlToImage from 'html-to-image'
import FileUtils from '@/utils/fileUtils.js'

export default {
  name: 'ModalUpload',
  components: {
    ImageCrop
  },
  setup () {
    const store = useStore()
    const organization = computed(() => store.getters['organization/organization'])
    const uploadStatus = computed(() => store.getters['helper/uploadImage/getUploadStatus'])
    const uploadImgConfig = computed(() => store.getters['helper/uploadImage/getUploadImgConfig'])

    const btnDisabled = computed(() => {
      return ['none', 'croping', 'uploading'].includes(uploadStatus.value)
    })

    const closeModal = () => store.dispatch('helper/closeModal')

    async function removeOrgLogo () {
      store.dispatch('organization/removeOrgLogo')
      closeModal()
    }

    async function uploadImg () {
      FileUtils.uploadImg()
    }

    function cancel () {
      store.commit('helper/uploadImage/SET_uploadStatus', 'none')
      closeModal()
    }

    function confirm () {
      const cropTarget = document.getElementById('crop-target')
      store.commit('helper/uploadImage/SET_uploadStatus', 'croping')
      htmlToImage.toJpeg(cropTarget).then((dataUrl) => {
        store.commit('helper/uploadImage/SET_uploadStatus', 'none')
        closeModal()
        const formData = new FormData()
        formData.append('orgId', store.getters['organization/orgId'])
        formData.append('logo', dataURLtoBlob(dataUrl))
        formData.append('originalLogo', dataURLtoBlob(uploadImgConfig.value.src))
        store.dispatch('organization/updateOrgLogo', formData)

        // used to see the croped image in local

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

    return {
      organization,
      uploadStatus,
      btnDisabled,
      removeOrgLogo,
      closeModal,
      cancel,
      confirm,
      uploadImg
    }
  }
}
</script>
