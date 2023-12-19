<template lang="pug">
div(class="flex flex-col gap-y-7.5")
  div(class="flex flex-col gap-y-4")
    h6(class="text-h6 text-grey-600 font-bold") {{ $t('Internal Information') }}
    div(class="flex flex-col gap-y-5")
      p(class="text-caption text-grey-600") Add pictures, videos, test reports and other helpful information about the material for internal members only.
  div
    f-button(
      type="secondary"
      size="md"
      prependIcon="add"
      @click="openModalAttachmentSelect"
    ) {{ $t('Attach file') }}
    div(class="text-caption2 text-grey-600 mt-1")
      p Supported file formats : JPG, JPEG, PNG, GIF, MOV, MP4, PDF, ZIP, SCCH, YDT
      p Maximum file size : 20MB (per file)
    div(v-if="attachmentList.length > 0" class="flex flex-wrap gap-5 mt-10")
      draggable(
        class="flex flex-wrap gap-5"
        v-model="attachmentListForDraggable"
        v-bind="fileCardDragOptions"
        group="attachment"
        @change="handleAttachmentListChange"
      )
        template(#item="{ element: attachment, index }")
          attachment-card(
            :key="attachment.id"
            :thumbnailUrl="attachment.thumbnailUrl"
            :originalUrl="attachment.originalUrl"
            :displayFileName="attachment.displayFileName"
            :extension="attachment.extension"
            :menuTree="getAttachmentMenuTree(attachment.fileId)"
            @click="openAttachmentPreview(index)"
          )
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import Draggable from 'vuedraggable'
import {
  materialAttachmentUpdateServiceKey,
  fileCardDragOptions,
} from '@/utils/constants'
import AttachmentCard from '@/components/common/material/attachment/AttachmentCard.vue'
import type { MaterialAttachmentUpdateService } from '@/types'
import useMaterial from '@/composables/material/useMaterial'

const attachmentUpdateService = inject<MaterialAttachmentUpdateService>(
  materialAttachmentUpdateServiceKey
)

if (!attachmentUpdateService) {
  throw new Error('MaterialAttachmentUpdateService is not provided')
}

const {
  material,
  attachmentList,
  getAttachmentMenuTree,
  openModalAttachmentSelect,
  updateAttachmentList,
  moveAttachment,
} = attachmentUpdateService

const store = useStore()

const { attachmentViewModeList } = useMaterial(material)

const attachmentListForDraggable = computed({
  get: () => attachmentList.value,
  set: updateAttachmentList,
})

const openAttachmentPreview = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList: attachmentViewModeList,
        getMenuTree: getAttachmentMenuTree,
      },
    },
  })
}

const handleAttachmentListChange = (e: any) => {
  const { element, newIndex } = e.moved
  moveAttachment(element.fileId, newIndex)
}
</script>

<style scoped></style>
