<template lang="pug">
div(class="w-120 border-t border-black-400")
  div(class="w-full flex justify-center items-center border-b border-black-400 overflow-hidden")
    div(class="w-full h-full flex justify-center items-center py-15 relative")
      div(
        v-if="!isUploading && !haveUploadedImage"
        class="flex flex-col"
        @drop.stop.prevent="imageOperator.onDrop($event)"
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
      img(v-else class="w-50 h-50" :src="orgLogo")
  div(class="h-25 flex justify-center items-center")
    div(v-if="!isUploading && haveUploadedImage" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="removeLogo") {{$t('UU0016') }}
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
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const cropRectSize = 200
    const isUploading = ref(false)
    const orgLogo = computed(() => store.getters['organization/organization'].logo)
    const haveUploadedImage = computed(() => !!orgLogo.value)
    const imageOperator = new ImageOperator(['jpeg', 'png'], 5, cropRectSize)

    imageOperator.on('uploading', () => (isUploading.value = true))
    imageOperator.on('customError', () => (isUploading.value = false))
    imageOperator.on('finish', (image) => {
      store.dispatch('helper/replaceModal', {
        component: 'modal-crop-image',
        header: t('BB0032'),
        properties: {
          image,
          cropRectSize,
          afterCropHandler: async (cropImage, originalImage) => {
            await store.dispatch('organization/updateOrgLogo', { logo: cropImage, originalLogo: originalImage })
          }
        }
      })
    })

    const uploadImg = () => {
      imageOperator.upload()
    }

    const onDrop = (evt) => {
      imageOperator.onDrop(evt)
    }

    const removeLogo = async () => {
      await store.dispatch('organization/removeOrgLogo')
      store.dispatch('helper/closeModal')
    }

    return {
      isUploading,
      confirm,
      uploadImg,
      removeLogo,
      onDrop,
      orgLogo,
      imageOperator,
      haveUploadedImage
    }
  }
}
</script>
