<template lang="pug">
modal-behavior(
  :header="$t('BB0032')"
  :secondaryBtnText="$t('UU0002')"
  @click:secondary="closeModal"
)
  template(#note)
    file-upload-error-note(v-if="errorCode" :errorCode="errorCode" :fileSizeMaxLimit="fileSizeMaxLimit")
  div(class="w-86 h-100 flex items-center")
    div(v-if="!isUploading && !haveUploadedImage")
      btn(size="md" class="mb-6" @click="uploadImg" prependIcon="upload") {{ $t("BB0035") }}
      div(class="grid gap-0.5 text-caption leading-1.6 text-black-600")
        div {{ $t("RR0243") }}
          span(class="text-black-800 ml-1") {{acceptType.join(', ').toUpperCase()}}
        div {{ $t("RR0244") }}
          span(class="text-black-800 ml-1") 200 x 200 px
        div {{ $t("RR0145") }}
          span(class="text-black-800 ml-1") {{fileSizeMaxLimit}} MB
    svg-icon(
      v-else-if="isUploading"
      iconName="loading"
      size="100"
      class="justify-self-end cursor-pointer text-brand-dark"
    )
    div(v-else class="w-full flex flex-col items-center")
      img(class="w-50 h-50 rounded-full mb-9" :src="orgLogo")
      btn(size="md" @click="uploadImg" prependIcon="tune" class="mb-2.5") {{$t("UU0019")}}
      btn(size="md" type="text" @click="removeLogo") {{$t('UU0016')}}
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ImageOperator } from '@/utils/fileOperator.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const cropRectSize = 200
const isUploading = ref(false)
const errorCode = ref('')
const orgLogo = computed(() => store.getters['organization/organization'].logo)
const haveUploadedImage = computed(() => {
  const defaultLogo = 'logo-default.png' // This file name is static
  return !orgLogo.value.includes(defaultLogo)
})

const fileSizeMaxLimit = 5
const acceptType = ['jpeg', 'jpg', 'png']
const imageOperator = new ImageOperator(acceptType, fileSizeMaxLimit, cropRectSize)

imageOperator.on('uploading', () => (isUploading.value = true))
imageOperator.on('selfDefinedError', () => {
  isUploading.value = false
  errorCode.value = code
})

imageOperator.on('finish', (image) => {
  errorCode.value = ''
  store.dispatch('helper/replaceModalBehavior', {
    component: 'modal-crop-image',
    properties: {
      title: t('BB0032'),
      image,
      cropRectSize,
      afterCropHandler: async (croppedImage, originalImage) => {
        await store.dispatch('organization/updateOrgLogo', { logo: croppedImage, originalLogo: originalImage })
      }
    }
  })
})

const uploadImg = () => {
  imageOperator.upload()
}

const removeLogo = async () => {
  await store.dispatch('organization/removeOrgLogo')
}

const closeModal = () => {
  store.dispatch('helper/closeModalBehavior')
}
</script>
