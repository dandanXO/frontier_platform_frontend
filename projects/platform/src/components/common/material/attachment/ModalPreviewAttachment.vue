<template lang="pug">
div(class="w-90 xl:w-200")
  div(
    class="relative h-80 xl:h-113 flex flex-col justify-center items-center"
    :class="[extensionInfo[currentAttachment.extension].display === 'video' ? 'bg-grey-900' : 'bg-grey-100']"
  )
    img(
      v-if="extensionInfo[currentAttachment.extension].display === 'image'"
      :src="currentAttachment.url"
      class="max-h-full max-w-full"
    )
    video(
      v-else-if="extensionInfo[currentAttachment.extension].display === 'video'"
      class="max-h-113"
      :key="currentAttachment.url"
      controls
    )
      source(:src="currentAttachment.url" type="video/mp4")
    f-svg-icon(
      v-else
      :iconName="extensionInfo[currentAttachment.extension].placeholder"
      size="110"
      class="text-grey-900"
    )
    a(
      v-if="extensionInfo[currentAttachment.extension].display === 'open-new-tab'"
      class="flex items-center"
      :href="currentAttachment.url"
      target="_blank"
    )
      f-svg-icon(iconName="open_in_new" size="20" class="text-grey-900")
      p(class="text-body2 leading-1.6 text-grey-900 pl-1.5") {{ $t('DD0070') }}
  div(class="h-16 xl:h-25 bg-grey-0 flex justify-between items-center px-4 xl:px-8")
    div(class="text-grey-900 flex items-center")
      span(class="text-caption xl:text-h6/1.6 mr-5 line-clamp-1") {{ currentAttachment.displayFileName }}
      f-svg-icon(
        iconName="download"
        size="24"
        class="text-grey-900 cursor-pointer"
        @click="downloadDataURLFile(currentAttachment.url, currentAttachment.displayFileName)"
      )
    div(class="flex justify-between items-center gap-5 flex-shrink-0")
      f-svg-icon(
        iconName="keyboard_arrow_left"
        size="24"
        class="cursor-pointer"
        @click="getLast"
      )
      span(class="text-grey-900 text-caption xl:text-h6 font-bold") {{ currentIndex + 1 }} / {{ attachmentList.length }}
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="24"
        class="cursor-pointer"
        @click="getNext"
      )
</template>

<script>
import { ref, computed } from 'vue'
import { downloadDataURLFile } from '@/utils/fileOperator'

export default {
  name: 'ModalPreviewAttachment',
  props: {
    attachmentList: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    targetItem: {
      type: Object,
    },
  },
  setup(props) {
    const extensionInfo = {
      '.png': { placeholder: null, display: 'image' },
      '.jpg': { placeholder: null, display: 'image' },
      '.jpeg': { placeholder: null, display: 'image' },
      '.gif': { placeholder: 'file_gif', display: 'image' },
      '.mov': { placeholder: 'file_mov', display: 'video' },
      '.mp4': { placeholder: 'file_mp4', display: 'video' },
      '.pdf': { placeholder: 'file_pdf', display: 'open-new-tab' },
      '.zip': { placeholder: 'file_zip', display: 'no-preview' },
    }

    const currentIndex = ref(props.index)
    const currentAttachment = computed(
      () => props.attachmentList[currentIndex.value]
    )

    const getNext = () => {
      if (currentIndex.value < props.attachmentList.length - 1) {
        currentIndex.value++
      } else {
        currentIndex.value = 0
      }
    }

    const getLast = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--
      } else {
        currentIndex.value = props.attachmentList.length - 1
      }
    }

    return {
      currentAttachment,
      extensionInfo,
      currentIndex,
      getNext,
      getLast,
      downloadDataURLFile,
    }
  },
}
</script>
