<template lang="pug">
modal-behavior(
  :header="$t('MM0019')"
  :secondaryBtnText="$t('UU0002')"
  @click:secondary="closeModal"
)
  div(class="w-86 h-100 flex justify-center items-center")
    div(v-if="!isUploading && !haveUploadedImage")
      f-button(size="md" class="mb-6" @click="uploadImg" prependIcon="upload") {{ $t("BB0035") }}
      div(class="grid gap-0.5 text-caption leading-1.6 text-black-600")
        div {{ $t("RR0243") }}
          span(class="text-black-800 ml-1") {{ acceptType.join(', ').toUpperCase() }}
        div {{ $t("RR0244") }}
          span(class="text-black-800 ml-1") 200 x 200 px
        div {{ $t("RR0145") }}
          span(class="text-black-800 ml-1") {{ fileSizeMaxLimit }} MB
    f-svg-icon(
      v-else-if="isUploading"
      iconName="loading"
      size="100"
      class="justify-self-end cursor-pointer text-brand-dark"
    )
    div(v-else class="w-full flex flex-col items-center")
      img(class="w-50 h-50 rounded-full mb-9" :src="avatar")
      f-button(size="sm" @click="uploadImg" prependIcon="tune" class="mb-2.5") {{ $t("UU0019") }}
      f-button(size="sm" type="text" @click="innerRemoveHandler") {{ $t('UU0016') }}
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
const avatar = computed(() => store.getters['organization/orgUser/orgUser'].avatar)
const haveUploadedImage = computed(() => {
  const defaultAvatar = 'default_user.png' // This file name is static
  return !avatar.value.includes(defaultAvatar)
})

const fileSizeMaxLimit = 5
const acceptType = ['jpeg', 'jpg', 'png']
const imageOperator = new ImageOperator(acceptType, fileSizeMaxLimit, cropRectSize)

imageOperator.on('uploading', () => (isUploading.value = true))
imageOperator.on('selfDefinedError', () => (isUploading.value = false))
imageOperator.on('finish', (image) => {
  store.dispatch('helper/replaceModalBehavior', {
    component: 'modal-crop-image',
    properties: {
      title: t('MM0019'),
      image,
      cropRectSize,
      afterCropHandler: async (croppedImage, originalImage) => {
        await store.dispatch('organization/orgUser/updateAvatar', {
          avatar: croppedImage,
          originalAvatar: originalImage
        })
        await fetchMemberList()
      }
    }
  })
})

const uploadImg = () => {
  imageOperator.upload()
}

const innerRemoveHandler = async () => {
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('organization/orgUser/removeAvatar')
  await fetchMemberList()
  store.dispatch('helper/closeModalLoading')
  closeModal()
}

const fetchMemberList = async () => {
  const routeLocation = store.getters['helper/routeLocation']

  if (routeLocation === 'org') {
    const orgNo = store.getters['organization/orgNo']
    await store.dispatch('organization/getOrg', { orgNo })
  } else {
    const groupId = store.getters['group/groupId']
    await store.dispatch('group/getGroup', { groupId })
  }
}

const closeModal = () => {
  store.dispatch('helper/closeModal')
}
</script>
