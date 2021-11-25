<template lang="pug">
div(class='w-44 rounded bg-black-100')
  div(
    class='relative cursor-pointer h-33 rounded-t bg-contain bg-center bg-no-repeat bg-black-400'
    :style="{'background-image': showFileIcon ? 'none' : `url(${attachment.url})`}"
    @click="$emit('openModalPreview', attachment.tempMaterialAttachmentId)"
  )
    svg-icon(iconName='open_in_full' size="20" class='absolute top-1.5 left-1.5 text-black-0')
    div(v-if='showFileIcon' class='w-full h-full flex justify-center items-center')
      svg-icon(iconName='folder' size="50" class='text-black-100')
  div(class='h-11 flex justify-between items-center px-3 py-4')
    div(class='text-primary text-caption') {{attachment.displayFileName}}
    svg-icon(iconName="delete" size="20" class='text-black-700 cursor-pointer' @click="$emit('handleRemove', attachment.tempMaterialAttachmentId)")
</template>

<script>
import { ref } from '@vue/runtime-core'
export default {
  name: 'SingleAttachment',
  props: {
    attachment: {
      type: Object
    }
  },
  setup (props) {
    const showFileIcon = ref(true)

    const showPlaceholderOrNot = () => {
      const tester = new Image()
      tester.onload = imageFound
      tester.onerror = imageNotFound
      tester.src = props.attachment.url
    }

    const imageFound = () => {
      showFileIcon.value = false
    }

    const imageNotFound = () => {
      showFileIcon.value = true
    }

    showPlaceholderOrNot()

    return {
      showFileIcon
    }
  }
}
</script>
