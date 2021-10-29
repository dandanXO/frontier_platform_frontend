<template lang="pug">
div(class="w-131 px-8")
  div
    h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{$t('EE0047')}}
    div
      p(class="text-body2 font-bold text-primary pb-4.5") {{$t('EE0048')}}
      overlay-scrollbar-container(class="min-h-31" :class="{ 'h-66': imageList.length > 3 }")
        div(class="grid grid-cols-4 gap-x-5 gap-y-4.5")
          div(class="h-25 rounded border border-dashed border-black-500 flex justify-center items-center cursor-pointer")
            svg-icon(iconName="add" size="24" class="text-primary")
          label(v-for="(image, index) in imageList" class="h-30.5")
            div(class="h-25 rounded border overflow-hidden relative")
              img(v-if="!!image.imgSrc" :src="image.imgSrc")
              div(v-else class="rounded w-full h-full border border-black-400 bg-black-200 flex items-center justify-center text-body2 font-bold text-black-400") {{$t('No image')}}
              input-radio(
                v-model:inputValue="coverImageIndex"
                :value="index"
                size="20"
                class="absolute top-1 left-1"
              )
            p(class="text-body2 font-bold text-primary pt-1.5") {{image.name}}
  div(class="h-25 flex justify-center items-center")
    div(class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="closeModal") {{$t('reuse.cancel') }}
      btn(size="md" @click="choose") {{$t('reuse.save')}}
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { COVER_MODE } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'ModalChangeCover',
  setup () {
    const store = useStore()
    const { location } = useNavigation()
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

      // const faceSideImg = {
      //   crop: null,
      //   ruler: '',
      //   original: 'https://picsum.photos/id/1/200/200',
      //   dpi: 300,
      //   u3mCrop: '',
      //   u3mOriginal: ''
      // }
      // const backSideImg = {
      //   crop: 'https://picsum.photos/id/1/200/200',
      //   ruler: 'https://picsum.photos/id/1/200/200',
      //   original: 'https://picsum.photos/id/1/200/200',
      //   dpi: 300,
      //   u3mCrop: '',
      //   u3mOriginal: ''
      // }
      // const attachmentList = [
      //   {
      //     materialAttachmentId: 0,
      //     displayFileName: 'string',
      //     url: 'http://20200611170258423_HPCD-012-1.pdf',
      //     isCover: false
      //   },
      //   {
      //     materialAttachmentId: 1,
      //     displayFileName: 'a1',
      //     url: 'http://20200611170258423_HPCD-012-1.png',
      //     isCover: false
      //   }
      // ]

      list.push({ name: 'Front', imgSrc: faceSideImg.crop }, { name: 'Back', imgSrc: backSideImg.crop })

      for (let i = 0; i < attachmentList.length; i++) {
        const { displayFileName, url } = attachmentList[i]
        const splitedUrl = url.split('.')
        const fileType = splitedUrl[splitedUrl.length - 1]

        if (['jpg', 'jpeg', 'png'].includes(fileType)) {
          list.push({
            name: displayFileName,
            imgSrc: url
          })
        }
      }

      return list
    })

    const choose = () => {
      let coverMode

      if (coverImageIndex.value - 2 > 0) {
        /**
         * @todo crop attachment
         */
      } else {
        coverMode = coverImageIndex.value + 1
        store.dispatch('material/changeCoverImg', {
          location: location.value,
          coverMode
        })
      }
    }

    const closeModal = () => { store.dispatch('helper/closeModal') }

    return {
      choose,
      closeModal,
      imageList,
      coverImageIndex
    }
  }
}
</script>
