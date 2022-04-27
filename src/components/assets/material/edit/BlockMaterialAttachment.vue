<template lang="pug">
div
  div(class="h-15 flex items-center")
    h5(class="text-h5 text-primary font-bold") {{ $t("DD0026") }}
  div(class="px-15")
    div(class="mt-5 mb-10")
      div(class="mb-4.5 text-body2") {{ $t("DD0027") }}
      btn(size="md" @click="openModalUpload") {{ $t("UU0022") }}
    div(class="flex flex-wrap gap-5")
      attachment-item(
        v-for="(attachment, index) in attachmentList"
        :key="attachment.url"
        :attachmentList="attachmentList"
        :attachment="attachment"
        :index="index"
        @handleRemove="handleRemove"
      )
</template>

<script setup>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import AttachmentItem from '@/components/assets/material/edit/AttachmentItem.vue'

const props = defineProps({
  tempMaterialId: {
    type: String
  }
})

const { t } = useI18n()
const store = useStore()
const attachmentList = computed(() => store.getters['assets/attachmentList'])
const isEditMode = computed(() => store.getters['assets/material'].materialId !== null)

const openModalUpload = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-upload-attachment',
    properties: {
      uploadHandler: async (file, displayFileName) => {
        if (isEditMode.value) {
          await store.dispatch('assets/uploadAttachmentWhenUpdate', {
            file,
            displayFileName
          })
        } else {
          await store.dispatch('assets/uploadAttachmentWhenCreate', {
            tempMaterialId: props.tempMaterialId,
            file,
            displayFileName
          })
        }
      }
    }
  })
}

const handleRemove = (attachment) => {
  store.dispatch('helper/openModalConfirm', {
    type: 0,
    header: t('DD0068'),
    content: t('DD0069'),
    primaryBtnText: t('UU0001'),
    primaryBtnHandler: async () => {
      if (isEditMode.value) {
        store.dispatch('assets/removeAttachmentWhenUpdate', {
          materialAttachmentId: attachment.materialAttachmentId
        })
      } else {
        store.dispatch('assets/removeAttachmentWhenCreate', {
          tempMaterialId: props.tempMaterialId,
          tempMaterialAttachmentId: attachment.tempMaterialAttachmentId
        })
      }
    },
    secondaryBtnText: t('UU0002')
  })
}
</script>
