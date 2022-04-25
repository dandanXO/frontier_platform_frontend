<template lang="pug">
div(class="w-86 h-136 border-t border-black-400 flex flex-col")
  div(class="w-full h-full flex justify-center items-center px-11")
    div(
      v-if="!isUploading && !haveUploadedImage"
      class="flex flex-col"
      @drop.stop.prevent="onDrop($event)"
      @dragover.prevent
      @dragenter.prevent
    )
      btn(size="md" type="secondary" class="h-10 mb-4" @click="uploadImg") {{ $t("MM0020") }}
      span(class="text-body2 font-bold mb-2 text-black-500") {{ $t("MM0021") }}
      span(class="text-body2 mb-2 text-black-500") {{ $t("MM0022") }}
      span(class="text-body2 mb-2 text-black-500") {{ $t("MM0023") }}
      span(class="text-body2 mb-2 text-black-500") {{ $t("MM0024") }}
    svg-icon(
      v-else-if="isUploading"
      iconName="loading"
      size="100"
      class="justify-self-end cursor-pointer text-brand-dark"
    )
    img(v-else class="w-50 h-50 rounded-full" :src="avatar")
  div(class="h-25 flex justify-center items-center")
    div(v-if="!isUploading && haveUploadedImage" class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="innerRemoveHandler") {{ $t('UU0016') }}
      btn(size="md" @click="uploadImg") {{ $t('UU0019') }}
    btn(v-else size="md" :disabled="true") {{ $t('UU0001') }}
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ImageOperator } from '@/utils/fileOperator.js'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalChangeAvatar',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const cropRectSize = 200
    const isUploading = ref(false)
    const avatar = computed(() => store.getters['user/orgUser/orgUser'].avatar)
    const haveUploadedImage = computed(() => {
      const defaultAvatar = 'default_user.png' // This file name is static
      return !avatar.value.includes(defaultAvatar)
    })

    const imageOperator = new ImageOperator(['jpeg', 'jpg', 'png'], 5, cropRectSize)

    imageOperator.on('uploading', () => (isUploading.value = true))
    imageOperator.on('customError', () => (isUploading.value = false))
    imageOperator.on('finish', (image) => {
      store.dispatch('helper/replaceModal', {
        component: 'modal-crop-image',
        header: t('MM0019'),
        properties: {
          image,
          cropRectSize,
          afterCropHandler: async (croppedImage, originalImage) => {
            await store.dispatch('user/orgUser/updateAvatar', {
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

    const onDrop = (evt) => {
      imageOperator.onDrop(evt)
    }

    const innerRemoveHandler = async () => {
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('user/orgUser/removeAvatar')
      await fetchMemberList()
      store.dispatch('helper/closeModalLoading')
      store.dispatch('helper/closeModal')
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

    return {
      isUploading,
      confirm,
      uploadImg,
      innerRemoveHandler,
      onDrop,
      avatar,
      haveUploadedImage
    }
  }
}
</script>
