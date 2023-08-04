<template lang="pug">
modal-behavior(
  :header="$t('EE0047')"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="choose"
  @click:secondary="closeModal"
)
  div(class="w-115")
    p(class="text-body2 font-bold text-grey-900 pb-4.5") {{ $t('EE0048') }}
    f-scrollbar-container(class="h-70 -mx-5 px-5")
      div(class="grid grid-cols-4 gap-x-5 gap-y-4.5")
        div(
          class="w-25 h-25 rounded border border-dashed border-grey-250 flex justify-center items-center cursor-pointer"
          @click="openModalUploadFileGeneral"
        )
          f-svg-icon(iconName="add" size="24" class="text-grey-900")
        template(v-for="(image, index) in imageList")
          label(v-if="!hideNotExistSide(index)" class="w-25 h-30.5")
            div(
              class="h-25 rounded border border-grey-250 relative flex justify-center items-center"
            )
              img(
                v-if="!!image.imgSrc"
                :src="image.imgSrc"
                class="max-w-full max-h-full"
              )
              div(
                v-else
                class="rounded w-full h-full bg-grey-100 flex items-center justify-center text-body2 font-bold text-grey-250"
              ) {{ $t('RR0103') }}
              f-input-radio(
                v-model:inputValue="coverImageIndex"
                :value="index"
                iconSize="20"
                class="absolute top-1 left-1"
              )
            p(class="text-body2 font-bold text-grey-900 pt-1.5 word-break line-clamp-1") {{ image.name }}
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref, toRefs } from 'vue'
import { COVER_MODE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { image2Object } from '@/utils/cropper'
import useMaterialImage from '@/composables/useMaterialImage'

const { t } = useI18n()
const store = useStore()
const material = computed(() => store.getters['assets/material'])
const coverImageIndex = ref(0)
const { coverMode, attachmentList } = toRefs(material.value)
const { isFaceSideMaterial, isBackSideMaterial } = useMaterialImage(
  material.value
)

const attachmentImageList = computed(() => {
  return attachmentList.value.filter((attachment) => {
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
  coverImageIndex.value =
    attachmentImageList.value.findIndex((attachment) => attachment.isCover) + 2
}

const imageList = computed(() => {
  const { faceSideImg, backSideImg } = material.value
  const list = []

  list.push(
    { name: t('RR0075'), imgSrc: faceSideImg.crop },
    { name: t('RR0078'), imgSrc: backSideImg.crop }
  )

  for (let i = 0; i < attachmentImageList.value.length; i++) {
    const { materialAttachmentId, displayFileName, url, isCover } =
      attachmentImageList.value[i]

    list.push({
      materialAttachmentId,
      name: displayFileName,
      imgSrc: url,
      cropRecord: isCover ? material.value.attachmentCropImageRecord : null,
    })
  }

  return list
})

const choose = async () => {
  let coverMode

  if (coverImageIndex.value - 2 >= 0) {
    const targetAttachment = imageList.value[coverImageIndex.value]
    const { materialAttachmentId, imgSrc, cropRecord } = targetAttachment
    const image = await image2Object(imgSrc)
    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-crop-image',
      properties: {
        title: t('EE0048'),
        image,
        cropRectSize: 200,
        cropRecord,
        afterCropHandler: async (croppedImage, _file, cropRecord) => {
          await store.dispatch('assets/changeCoverImg', {
            coverMode: COVER_MODE.SUP,
            materialAttachmentId,
            attachmentCropImg: croppedImage,
            attachmentCropImageRecord: cropRecord,
          })
          closeModal()
          store.dispatch('helper/reloadInnerApp')
        },
      },
    })
  } else {
    coverMode = coverImageIndex.value + 1
    store.dispatch('assets/changeCoverImg', { coverMode })
    closeModal()
    store.dispatch('helper/reloadInnerApp')
  }
}

const openModalUploadFileGeneral = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-upload-file-general',
    properties: {
      acceptType: ['jpg', 'jpeg', 'png'],
      uploadHandler: async (file, displayFileName) => {
        await store.dispatch('assets/uploadAttachmentWhenUpdate', {
          file,
          displayFileName,
        })
      },
    },
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

const closeModal = () => {
  store.dispatch('helper/closeModal')
}
</script>
