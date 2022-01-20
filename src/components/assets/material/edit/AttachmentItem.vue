<template lang="pug">
div(class="w-44 rounded bg-black-100")
  div(
    class="relative cursor-pointer h-33 rounded-t bg-black-400 flex justify-center items-center"
    @click="openModalPreviewAttachment"
  )
    svg-icon(iconName='open_in_full' size="20" class='absolute top-1.5 left-1.5 text-black-0')
    img(v-if="['.png', '.jpg', '.jpeg', '.gif'].includes(attachment.extension)" :src="attachment.url" class="max-h-full max-w-full")
    video(v-else-if="['.mov', '.mp4'].includes(attachment.extension)" class="max-h-full max-w-full")
      source(:src="attachment.url" type="video/mp4")
    svg-icon(v-else iconName="file" size="50" class="text-black-100")
  div(class="h-11 flex justify-between items-center px-3 py-4")
    div(class="text-primary text-caption line-clamp-1") {{attachment.displayFileName}}
    svg-icon(
      v-if="!isReadOnly"
      iconName="delete"
      size="20"
      class="text-black-700 cursor-pointer"
      @click="$emit('handleRemove', attachment)"
    )
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'AttachmentItem',
  props: {
    attachmentList: {
      type: Array,
      required: true
    },
    attachment: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()

    const openModalPreviewAttachment = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-preview-attachment',
        header: t('DD0060'),
        properties: {
          attachmentList: props.attachmentList,
          index: props.index
        }
      })
    }

    return {
      openModalPreviewAttachment
    }
  }
}
</script>
