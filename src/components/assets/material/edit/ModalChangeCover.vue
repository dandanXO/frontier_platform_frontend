<template lang="pug">
div(class="w-131 px-8")
  div
    h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{$t('EE0047')}}
    div
      p(class="text-body2 font-bold text-primary pb-4.5") {{$t('EE0048')}}
      overlay-scrollbar-container(class="min-h-31" :class="{ 'h-66': imageList.length > 3 }")
        div(class="grid grid-cols-4 gap-x-5 gap-y-4.5")
          div(class="h-25 rounded border border-dashed border-black-500 flex justify-center items-center cursor-pointer" @click="openModalUploadCoverImage")
            svg-icon(iconName="add" size="24" class="text-primary")
          template(v-for="(image, index) in imageList")
            label(v-if="!hideNotExistSide(index)" class="h-30.5")
              div(class="h-25 rounded border relative flex justify-center items-center")
                img(v-if="!!image.imgSrc" :src="image.imgSrc" class='max-w-full max-h-full')
                div(v-else class="rounded w-full h-full border border-black-400 bg-black-200 flex items-center justify-center text-body2 font-bold text-black-400") {{$t('RR0103')}}
                input-radio(
                  v-model:inputValue="coverImageIndex"
                  :value="index"
                  size="20"
                  class="absolute top-1 left-1"
                )
              p(class="text-body2 font-bold text-primary pt-1.5 line-clamp-1") {{image.name}}
  div(class="h-25 flex justify-center items-center")
    div(class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="closeModal") {{$t('UU0002') }}
      btn(size="md" @click="choose") {{$t('UU0018')}}
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, toRefs } from 'vue'
import { COVER_MODE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { image2Object } from '@/utils/cropper'
import useMaterialImage from '@/composables/useMaterialImage'

export default {
  name: 'ModalChangeCover',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const coverImageIndex = ref(0)
    const { coverMode, attachmentList } = toRefs(material.value)
    const { isFaceSideMaterial, isBackSideMaterial } = useMaterialImage(material.value)

    const attachmentImageList = computed(() => {
      return attachmentList.value.filter(attachment => {
        const splitedUrl = attachment.url.split('.')
        const fileType = splitedUrl[splitedUrl.length - 1]
        return ['jpg', 'jpeg', 'png'].includes(fileType)
      })
    })

    if (coverMode.value === COVER_MODE.FACE) {
      coverImageIndex.value = 0
    } else if (coverMode.value === COVER_MODE.BACK) {
      coverImageIndex.value = 1
    } else if (coverMode.value === COVER_MODE.SUP) {
      coverImageIndex.value = attachmentImageList.value.findIndex(attachment => attachment.isCover) + 2
    }

    const imageList = computed(() => {
      const { faceSideImg, backSideImg } = material.value
      const list = []

      list.push({ name: t('RR0075'), imgSrc: faceSideImg.crop }, { name: t('RR0078'), imgSrc: backSideImg.crop })

      for (let i = 0; i < attachmentImageList.value.length; i++) {
        const { materialAttachmentId, displayFileName, url } = attachmentImageList.value[i]

        list.push({
          materialAttachmentId,
          name: displayFileName,
          imgSrc: url
        })
      }

      return list
    })

    const choose = async () => {
      let coverMode

      if (coverImageIndex.value - 2 >= 0) {
        const targetAttachment = imageList.value[coverImageIndex.value]
        const { materialAttachmentId, imgSrc } = targetAttachment
        const image = await image2Object(imgSrc)
        store.dispatch('helper/pushModal', {
          component: 'modal-crop-image',
          header: t('EE0048'),
          properties: {
            image,
            cropRectSize: 200,
            afterCropHandler: async (croppedImage) => {
              await store.dispatch('material/changeCoverImg', {
                coverMode: COVER_MODE.SUP,
                materialAttachmentId,
                attachmentCropImg: croppedImage
              })
              closeModal()
              store.dispatch('helper/reloadInnerApp')
            }
          }
        })
      } else {
        coverMode = coverImageIndex.value + 1
        store.dispatch('material/changeCoverImg', { coverMode })
        closeModal()
        store.dispatch('helper/reloadInnerApp')
      }
    }

    const openModalUploadCoverImage = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-upload-cover-image',
        properties: {
          uploadHandler: (file, fileName) => {
            store.dispatch('material/uploadAttachmentWhenUpdate', {
              file,
              fileName
            })
          }
        }
      })
    }

    const hideNotExistSide = (imageIndex) => {
      if (isFaceSideMaterial && imageIndex === 1) {
        return true
      } else if (isBackSideMaterial && imageIndex === 0) {
        return true
      } else {
        return false
      }
    }

    const closeModal = () => { store.dispatch('helper/closeModal') }

    return {
      choose,
      closeModal,
      openModalUploadCoverImage,
      imageList,
      coverImageIndex,
      hideNotExistSide
    }
  }
}
</script>
