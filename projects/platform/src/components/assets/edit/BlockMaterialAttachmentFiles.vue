<template lang="pug">
div(class="flex flex-col gap-y-7.5")
  div(class="flex flex-col gap-y-4")
    h6(class="text-h6 text-grey-600 font-bold") {{ $t('RR0298') }}
    div(class="flex flex-col gap-y-5")
      p(class="text-caption text-grey-600") {{ $t('DD0027') }}
  div
    f-button(
      type="secondary"
      size="md"
      prependIcon="add"
      @click="openModalMultimediaSelect"
    ) {{ $t('UU0022') }}
    div(class="text-caption2 text-grey-600 mt-1")
      p {{ $t('RR0243') }} {{ acceptType.join(', ').toUpperCase() }}
      p {{ $t('RR0145') }}
        i18n-t(keypath="DD0101" tag="p" class="inline-block") 
          template(#number) &nbsp; {{ bytesToSize(fileSizeMaxLimit) }}
  div(v-if="multimediaList && multimediaList.length > 0" class="flex flex-wrap gap-5")
    f-infobar(
      class="w-full"
      :notifyType="NOTIFY_TYPE.TIPS"
      :display="DISPLAY.BLOCK"
      :messageText="$t('MI0006')"
    )
    draggable(
      class="flex flex-wrap gap-5"
      v-model="multimediaListForDraggable"
      v-bind="fileCardDragOptions"
      group="multimedia"
      @change="handleMultimediaListChange"
    )
      template(#item="{ element: multimedia, index }")
        multimedia-card(
          :key="multimedia.fileId"
          :isCover="selectedCoverId != null ? selectedCoverId === multimedia.fileId : multimedia.isCover"
          :thumbnailUrl="multimedia.thumbnailUrl"
          :originalUrl="multimedia.originalUrl"
          :extension="multimedia.extension"
          :displayFileName="multimedia.displayFileName"
          :menuTree="getMultimediaMenuTree(multimedia.fileId)"
          @setCover="emits('selectCover', multimedia.fileId)"
          @edit="startCropMultimedia(multimedia.fileId)"
          @click="openMultimediaViewMode(index)"
        )
  div(class="flex flex-col gap-y-4 rounded-md bg-grey-50 p-7.5")
    h6(class="text-h6 text-grey-600 font-bold") {{ $t('RR0289') }}
    div
      h3(class="text-h12 text-grey-600 font-bold") {{ $t('RR0298') }}
      div(class="flex flex-col gap-y-5 mb-4")
        p(class="text-caption text-grey-600") {{ $t('MI0066') }}
    div
      f-button(
        type="secondary"
        size="md"
        prependIcon="add"
        @click="openModalAttachmentSelect"
      ) {{ $t('UU0022') }}
      div(class="text-caption2 text-grey-600 mt-1")
        p {{ $t('RR0243') }} {{ acceptType.join(', ').toUpperCase() }}
        p {{ $t('RR0145') }}
          i18n-t(keypath="DD0101" tag="p" class="inline-block") 
            template(#number) &nbsp; {{ bytesToSize(fileSizeMaxLimit) }}
    f-infobar(
      class="w-full mt-4"
      :notifyType="NOTIFY_TYPE.TIPS"
      :display="DISPLAY.BLOCK"
      :messageText="$t('MI0006')"
    )
    div(v-if="attachmentList.length > 0" class="flex flex-wrap gap-5 mt-8")
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
import MultimediaCard from '@/components/common/material/multimedia/MultimediaCard.vue'
import {
  materialAttachmentUpdateServiceKey,
  fileCardDragOptions,
  materialMultimediaUpdateServiceKey,
  NOTIFY_TYPE,
  DISPLAY,
} from '@/utils/constants'
import { bytesToSize } from '@frontier/lib'
import AttachmentCard from '@/components/common/material/attachment/AttachmentCard.vue'
import type {
  MaterialAttachmentUpdateService,
  MaterialMultimediaUpdateService,
} from '@/types'
import type { MultimediaFile } from '@frontier/platform-web-sdk'
import useMaterial from '@/composables/material/useMaterial'
import { MATERIAL_FILE_ACCEPT_TYPE } from '@/utils/constants'

const acceptType = MATERIAL_FILE_ACCEPT_TYPE

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

const multimediaUpdateService = inject<MaterialMultimediaUpdateService>(
  materialMultimediaUpdateServiceKey
)

if (!multimediaUpdateService) {
  throw new Error('MaterialMultimediaUpdateService is not provided')
}

const {
  material: externalMaterial,
  selectedCoverId,
  multimediaList,
  openModalMultimediaSelect,
  getMultimediaMenuTree,
  updateMultimediaList,
  moveMultimedia,
  startCropMultimedia,
} = multimediaUpdateService

const store = useStore()

const { attachmentViewModeList } = useMaterial(material)

const attachmentListForDraggable = computed({
  get: () => attachmentList.value,
  set: updateAttachmentList,
})

const fileSizeMaxLimit = computed(
  () => store.getters['organization/materialAttachmentUploadSizeLimit']
)

const emits = defineEmits<{
  (e: 'selectCover', coverId: number): void
}>()

const multimediaListForDraggable = computed({
  get: () => multimediaList.value,
  set: updateMultimediaList,
})

interface MultimediaDraggableElement {
  moved: {
    element: MultimediaFile
    newIndex: number
  }
}

const handleMultimediaListChange = (e: MultimediaDraggableElement) => {
  const { element, newIndex } = e.moved
  moveMultimedia(element.fileId, newIndex)
}

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

const multimediaViewModeFileList = computed(() =>
  multimediaList.value.map((m) => ({
    id: m.fileId,
    originalUrl: m.originalUrl,
    displayUrl: m.originalUrl,
    thumbnailUrl: m.thumbnailUrl,
    displayName: m.displayFileName,
    extension: m.extension,
  }))
)

const openMultimediaViewMode = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList: multimediaViewModeFileList,
        getMenuTree: getMultimediaMenuTree,
      },
    },
  })
}

const handleAttachmentListChange = (e: MultimediaDraggableElement) => {
  const { element, newIndex } = e.moved
  moveAttachment(element.fileId, newIndex)
}
</script>

<style scoped></style>
