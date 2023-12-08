<template lang="pug">
div(class="flex flex-col gap-y-7.5")
  modal-view-mode(
    v-if="openMagnifierMode"
    :startIndex="previewStartIndex"
    :fileList="attachmentViewModeList"
    :getMenuTree="getAttachmentMenuTree"
    @close="openMagnifierMode = false"
  )
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
      p Remark : The file name of the uploaded supplemental data must not contain any of the following characters \ / ; * ? " |
    div(v-if="attachmentList.length > 0" class="flex flex-wrap gap-5 mt-10")
      draggable(
        class="flex flex-wrap gap-5"
        v-model="attachmentListForDraggable"
        v-bind="cardDragOptions"
        group="attachment"
        @change="handleAttachmentListChange"
      )
        template(#item="{ element: attachment, index }")
          attachment-card(
            :key="attachment.id"
            :thumbnailUrl="attachment.thumbnailUrl"
            :fileName="attachment.displayFileName"
            :menuTree="getAttachmentMenuTree(attachment.fileId)"
            @click="openAttachmentPreview(index)"
          )
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import Draggable from 'vuedraggable'
import { materialAttachmentUpdateServiceKey } from '@/utils/constants'
import AttachmentCard from '@/components/common/material/attachment/AttachmentCard.vue'
import ModalViewMode from '@/components/common/material/file/viewMode/ModalViewMode.vue'
import type {
  MaterialAttachmentUpdateService,
  MaterialViewModeFile,
} from '@/types'
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

const { attachmentViewModeList } = useMaterial(material)

const attachmentListForDraggable = computed({
  get: () => attachmentList.value,
  set: updateAttachmentList,
})

const cardDragOptions = {
  itemKey: 'id',
  forceFallback: true,
  scrollSensitivity: 40,
  scrollSpeed: 7,
  animation: 250,
  disabled: false,
}

const previewStartIndex = ref(0)
const openMagnifierMode = ref(false)

const openAttachmentPreview = (index: number) => {
  openMagnifierMode.value = true
  previewStartIndex.value = index
}

const handleAttachmentListChange = (e: any) => {
  const { element, newIndex } = e.moved
  moveAttachment(element.fileId, newIndex)
}
</script>

<style scoped></style>
