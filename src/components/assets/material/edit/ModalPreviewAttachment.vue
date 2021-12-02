<template lang="pug">
div(class="w-200")
  div(
    class="relative h-113 flex justify-center items-center"
    :class="[extensionInfo[currentAttachment.extension].display === 'video' ? 'bg-black-900' : 'bg-primary-thin']"
  )
    img(v-if="extensionInfo[currentAttachment.extension].display === 'image'" :src="currentAttachment.url" class="max-h-full max-w-full")
    video(v-else-if="extensionInfo[currentAttachment.extension].display === 'video'" class="max-h-113" controls)
      source(:src="currentAttachment.url" type="video/mp4")
    svg-icon(v-else :iconName="extensionInfo[currentAttachment.extension].placeholder" size="110" class="text-primary")
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
import { useStore } from 'vuex'

export default {
  name: 'ModalPreviewAttachment',
  props: {
    targetItem: {
      type: Object
    }
  },
  setup (props) {
    const extensionInfo = {
      '.png': { placeholder: null, display: 'image' },
      '.jpg': { placeholder: null, display: 'image' },
      '.gif': { placeholder: 'gif_folder', display: 'image' },
      '.mov': { placeholder: 'mov_folder', display: 'video' },
      '.mp4': { placeholder: 'mp4_folder', display: 'video' },
      '.pdf': { placeholder: 'pdf_folder', display: 'no-priview' },
      '.zip': { placeholder: 'zip_folder', display: 'no-priview' }
    }
    const store = useStore()
    const attachmentList = computed(() => store.getters['material/attachmentList'])
    const isEditMode = computed(() => store.getters['material/material'].materialId !== null)

    const currentIndex = ref(
      attachmentList.value.findIndex(item => {
        if (isEditMode.value) {
          return item.materialAttachmentId === props.targetItem.materialAttachmentId
        } else {
          return item.tempMaterialAttachmentId === props.targetItem.tempMaterialAttachmentId
        }
      })
    )

    const currentAttachment = computed(() => attachmentList.value[currentIndex.value])

    const getNext = () => {
      if (currentIndex.value < attachmentList.value.length - 1) {
        currentIndex.value++
      } else {
        currentIndex.value = 0
      }
    }

    const getLast = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--
      } else {
        currentIndex.value = attachmentList.value.length - 1
      }
    }

    return {
      attachmentList,
      currentAttachment,
      extensionInfo,
      currentIndex,
      getNext,
      getLast
    }
  }
}
</script>
