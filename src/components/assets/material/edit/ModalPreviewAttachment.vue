<template lang="pug">
div(class="w-200")
  div(
    class="relative h-113 flex flex-col justify-center items-center"
    :class="[extensionInfo[currentAttachment.extension].display === 'video' ? 'bg-black-900' : 'bg-primary-thin']"
  )
    img(v-if="extensionInfo[currentAttachment.extension].display === 'image'" :src="currentAttachment.url" class="max-h-full max-w-full")
    video(v-else-if="extensionInfo[currentAttachment.extension].display === 'video'" class="max-h-113" :key="currentAttachment.url" controls)
      source(:src="currentAttachment.url" type="video/mp4")
    svg-icon(v-else :iconName="extensionInfo[currentAttachment.extension].placeholder" size="110" class="text-primary")
    a(
      v-if="extensionInfo[currentAttachment.extension].display === 'open-new-tab'"
      class="flex items-center"
      :href="currentAttachment.url"
      target="_blank"
    )
      svg-icon(iconName="open_in_new" size="20" class="text-primary")
      p(class="text-body2 line-height-1.6 text-primary pl-1.5") {{$t('DD0070')}}
  div(class="h-25 bg-black-0 flex justify-between items-center px-8")
    div(class="text-primary flex")
      span(class="text-h6 mr-5") {{currentAttachment.displayFileName}}
      a(:href="currentAttachment.url" :download="currentAttachment.displayFileName" target="_blank")
        svg-icon(iconName="download" size="24" class="text-primary cursor-pointer")
    div(class="flex justify-between items-center gap-5")
      svg-icon(iconName="keyboard_arrow_left" size="24"  class="cursor-pointer" @click="getLast")
      div(class="text-primary text-h6 font-bold") {{currentIndex + 1}} / {{attachmentList.length}}
      svg-icon(iconName="keyboard_arrow_right" size="24"  class="cursor-pointer" @click="getNext")
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ModalPreviewAttachment',
  props: {
    attachmentList: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    targetItem: {
      type: Object
    }
  },
  setup (props) {
    const extensionInfo = {
      '.png': { placeholder: null, display: 'image' },
      '.jpg': { placeholder: null, display: 'image' },
      '.jpeg': { placeholder: null, display: 'image' },
      '.gif': { placeholder: 'gif_folder', display: 'image' },
      '.mov': { placeholder: 'mov_folder', display: 'video' },
      '.mp4': { placeholder: 'mp4_folder', display: 'video' },
      '.pdf': { placeholder: 'pdf_folder', display: 'open-new-tab' },
      '.zip': { placeholder: 'zip_folder', display: 'no-preview' }
    }

    const currentIndex = ref(props.index)
    const currentAttachment = computed(() => props.attachmentList[currentIndex.value])

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
      getLast
    }
  }
}
</script>
