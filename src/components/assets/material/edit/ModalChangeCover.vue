<template lang="pug">
div(class="w-131 px-8")
  div
    h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{$t('EE0047')}}
    div
      p(class="text-body2 font-bold text-primary pb-4.5") {{$t('EE0048')}}
      overlay-scrollbar-container(class="min-h-31" :class="{ 'h-66': imageList.length > 3 }")
        div(class="grid grid-cols-4 gap-x-5 gap-y-4.5")
          div(class="h-25 rounded border border-dashed border-black-500 flex justify-center items-center cursor-pointer" @click="openModalUploadAttachment")
            svg-icon(iconName="add" size="24" class="text-primary")
          label(v-for="(image, index) in imageList" class="h-30.5")
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
import { computed, ref } from 'vue'
import { COVER_MODE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalChangeCover',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const coverImageIndex = ref(0)
    const { coverMode, attachmentList } = material.value

    if (coverMode === COVER_MODE.FACE) {
      coverImageIndex.value = 0
    } else if (coverMode === COVER_MODE.BACK) {
      coverImageIndex.value = 1
    } else if (coverMode === COVER_MODE.SUP) {
      coverImageIndex.value = attachmentList.findIndex(attachment => attachment.isCover) + 2
    }

    const imageList = computed(() => {
      const { faceSideImg, backSideImg, attachmentList } = material.value
      const list = []

      list.push({ name: t('RR0075'), imgSrc: faceSideImg.crop }, { name: t('RR0078'), imgSrc: backSideImg.crop })

      for (let i = 0; i < attachmentList.length; i++) {
        const { materialAttachmentId, displayFileName, url } = attachmentList[i]
        const splitedUrl = url.split('.')
        const fileType = splitedUrl[splitedUrl.length - 1]

        if (['jpg', 'jpeg', 'png'].includes(fileType)) {
          list.push({
            materialAttachmentId,
            name: displayFileName,
            imgSrc: url
          })
        }
      }

      return list
    })

    const choose = async () => {
      let coverMode

      if (coverImageIndex.value - 2 >= 0) {
        const targetAttachment = imageList.value[coverImageIndex.value]
        const { materialAttachmentId, imgSrc } = targetAttachment
        const image = await getImage(imgSrc)
        store.dispatch('helper/pushModal', {
          component: 'modal-crop-image',
          header: t('EE0048'),
          properties: {
            image,
            cropRectSize: 200,
            afterCropHandler: async (cropedImage, file) => {
              await store.dispatch('material/changeCoverImg', {
                coverMode: COVER_MODE.SUP,
                materialAttachmentId,
                attachmentCropImg: cropedImage
              })
              closeModal()
            }
          }
        })
      } else {
        coverMode = coverImageIndex.value + 1
        store.dispatch('material/changeCoverImg', { coverMode })
      }
    }

    const getImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          const { width, height, src } = img
          resolve({ width, height, src })
        }

        img.src = url
      })
    }

    const openModalUploadAttachment = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-upload-attachment',
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

    const closeModal = () => { store.dispatch('helper/closeModal') }

    return {
      choose,
      closeModal,
      openModalUploadAttachment,
      imageList,
      coverImageIndex
    }
  }
}
</script>
