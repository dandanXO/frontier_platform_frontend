<template lang="pug">
div
  div(class="h-15 flex items-center")
    h5(class="text-h5 text-primary font-bold") {{$t('DD0026')}}
  div(class='px-15')
    div(class='mt-5 mb-10')
      div(class='mb-4.5 text-body2') {{$t('DD0027')}}
      btn(size='md' @click='openModalUpload') {{$t('UU0022')}}
    div(class='flex gap-5')
      attachment-item(
        v-for='attachment in attachmentList'
        :key='attachment.url'
        :attachment='attachment'
        @handleRemove='handleRemove'
      )
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import AttachmentItem from '@/components/assets/material/edit/AttachmentItem'

export default {
  name: 'BlockMaterialAttachment',
  props: {
    tempMaterialId: {
      type: String
    }
  },
  components: { AttachmentItem },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const attachmentList = computed(() => store.getters['material/attachmentList'])
    const isEditMode = computed(() => store.getters['material/material'].materialId !== null)

    const openModalUpload = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-upload-attachment',
        properties: {
          uploadHandler: async (file, fileName) => {
            if (isEditMode.value) {
              await store.dispatch('material/uploadAttachmentWhenUpdate', {
                file,
                fileName
              })
            } else {
              await store.dispatch('material/uploadAttachmentWhenCreate', {
                tempMaterialId: props.tempMaterialId,
                file,
                fileName
              })
            }
          }
        }
      })
    }

    const handleRemove = (attachment) => {
      store.dispatch('helper/openModalConfirm', {
        title: t('DD0068'),
        content: t('DD0069'),
        secondaryText: t('UU0001'),
        secondaryHandler: async () => {
          if (isEditMode.value) {
            store.dispatch('material/removeAttachmentWhenUpdate', {
              materialAttachmentId: attachment.materialAttachmentId
            })
          } else {
            store.dispatch('material/removeAttachmentWhenCreate', {
              tempMaterialId: props.tempMaterialId,
              tempMaterialAttachmentId: attachment.tempMaterialAttachmentId
            })
          }
        }
      })
    }

    const openModalPreview = () => {
      console.log('openModalPreview')
    }

    return {
      attachmentList,
      openModalUpload,
      handleRemove,
      openModalPreview
    }
  }
}
</script>
