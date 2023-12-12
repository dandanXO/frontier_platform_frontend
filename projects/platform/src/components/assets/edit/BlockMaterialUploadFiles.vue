<template lang="pug">
div(class="flex flex-col gap-y-15")
  div(class="flex flex-col gap-y-15")
    div(class="flex flex-col gap-y-5")
      div(class="flex flex-col gap-y-2")
        p(class="text-body2 text-grey-800 font-bold") Multimedia File
        p(class="text-caption text-grey-600") Add pictures, videos, test reports, and other information that can be helpful to the material.
      div
        f-button(
          type="secondary"
          size="md"
          prependIcon="add"
          @click="openModalMultimediaSelect"
        ) {{ $t('UU0022') }}
        div(class="text-caption2 text-grey-600 mt-1")
          p Supported file formats : JPG, JPEG, PNG, GIF, MOV, MP4, PDF, ZIP, SCCH, YDT
          p Maximum file size : 20MB (per file)
          p Remark : The file name of the uploaded supplemental data must not contain any of the following characters \ / ; * ? " |
        div(v-if="multimediaList.length > 0" class="flex flex-wrap gap-5 mt-10")
          draggable(
            class="flex flex-wrap gap-5"
            v-model="multimediaListForDraggable"
            v-bind="fileCardDragOptions"
            group="multimedia"
          )
            template(#item="{ element: multimedia, index }")
              multimedia-card(
                :key="multimedia.id"
                :isCover="multimedia.isCover"
                :thumbnailUrl="multimedia.thumbnailUrl"
                :originalUrl="multimedia.originalUrl"
                :extension="multimedia.extension"
                :displayFileName="multimedia.displayFileName"
                :menuTree="getMultimediaMenuTree(multimedia.id)"
                @setCover="setMultimediaAsCover(multimedia.id)"
                @edit="startCropMultimedia(multimedia.id)"
                @click="openMultimediaPreview(index)"
              )
    div(class="flex flex-col gap-y-5")
      div(class="flex flex-col gap-y-2")
        p(class="text-body2 text-grey-800 font-bold") 3D Material File
        p(class="text-caption text-grey-600") Add pictures, videos, test reports, and other information that can be helpful to the material.
      div(class="flex items-center gap-x-6.5")
        div
          div
            f-button(
              type="secondary"
              size="md"
              prependIcon="add"
              @click="openModalUploadU3mFile"
            ) {{ $t('UU0022') }}
            div(class="text-caption2 text-grey-600 mt-1")
              p Supported file formats : ZIP
              p Maximum file size : 5GB
        f-infobar(
          v-if="!hasU3mQuota"
          :display="DISPLAY.FLEX"
          :notifyType="NOTIFY_TYPE.WARNING"
          :messageText="$t('WW0094')"
          :action="{ text: $t('UU0085'), handler: goToBillings }"
        )
      div(v-if="hasUploadedU3mFile" class="flex flex-col gap-y-2")
        div(class="bg-grey-100 py-3 px-4 flex items-center rounded")
          div(class="bg-grey-150 flex items-center justify-center p-2 rounded")
            f-svg-icon(iconName="file" size="20" class="text-grey-600")
          div(class="flex-grow pl-2 pr-4 flex flex-col gap-y-1")
            p(class="text-body2 font-bold text-grey-800 line-clamp-1") {{ u3mFile.name }}
            p(class="text-caption text-grey-600") {{ hasPhysicalData ? $t('EE0169') : $t('EE0170') }}
          f-svg-icon(
            iconName="delete"
            size="24"
            class="text-grey-600 cursor-pointer"
            @click="removeU3mFile"
          )
        div(v-if="!hasPhysicalData")
          f-input-checkbox(
            v-model:inputValue="needToGeneratePhysical"
            :label="$t('EE0171')"
            binary
            iconSize="20"
          )
        f-infobar(
          class="mt-0.5"
          :notifyType="NOTIFY_TYPE.INFO"
          :title="$t('EE0172')"
          :messageText="$t('EE0173')"
        )
  div(class="flex flex-col gap-y-7.5 bg-grey-50 rounded px-15 py-12.5")
    h6(class="text-h6 text-grey-600 font-bold") {{ $t('DD0019') }}
    div(class="flex flex-col gap-y-5")
      div(class="flex flex-col gap-y-2")
        p(class="text-body2 text-grey-800 font-bold") Attachments
        p(class="text-caption text-grey-600") Add pictures, videos, test reports and other helpful information about the material for internal members only.
      div
        f-button(
          type="secondary"
          size="md"
          prependIcon="add"
          @click="openModalAttachmentSelect"
        ) {{ $t('UU0022') }}
        div(class="text-caption2 text-grey-600 mt-1")
          p Supported file formats : JPG, JPEG, PNG, GIF, MOV, MP4, PDF, ZIP, SCCH, YDT
          p Maximum file size : 20MB (per file)
          p Remark : The file name of the uploaded supplemental data must not contain any of the following characters \ / ; * ? " |
        div(v-if="attachmentList.length > 0" class="flex flex-wrap gap-5 mt-10")
          draggable(
            class="flex flex-wrap gap-5"
            v-model="attachmentListForDraggable"
            v-bind="fileCardDragOptions"
            group="attachment"
          )
            template(#item="{ element: attachment, index }")
              attachment-card(
                :key="attachment.id"
                :thumbnailUrl="attachment.thumbnailUrl"
                :originalUrl="attachment.originalUrl"
                :displayFileName="attachment.displayFileName"
                :extension="attachment.extension"
                :menuTree="getAttachmentMenuTree(attachment.id)"
                @click="openAttachmentPreview(index)"
              )
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import Draggable from 'vuedraggable'
import useNavigation from '@/composables/useNavigation'
import {
  NOTIFY_TYPE,
  DISPLAY,
  materialU3mSelectServiceKey,
  materialMultimediaCreateServiceKey,
  materialAttachmentCreateServiceKey,
  fileCardDragOptions,
} from '@/utils/constants'
import AttachmentCard from '@/components/common/material/attachment/AttachmentCard.vue'
import MultimediaCard from '@/components/common/material/multimedia/MultimediaCard.vue'
import type {
  MaterialU3mSelectService,
  MaterialMultimediaCreateService,
  MaterialAttachmentCreateService,
  MaterialViewModeFile,
} from '@/types'

const u3mSelectService = inject<MaterialU3mSelectService>(
  materialU3mSelectServiceKey
)
const multimediaCreateService = inject<MaterialMultimediaCreateService>(
  materialMultimediaCreateServiceKey
)
const attachmentCreateService = inject<MaterialAttachmentCreateService>(
  materialAttachmentCreateServiceKey
)

if (!u3mSelectService) {
  throw new Error('MaterialU3mCreateService is not provided')
}
if (!multimediaCreateService) {
  throw new Error('MaterialMultimediaCreateService is not provided')
}
if (!attachmentCreateService) {
  throw new Error('MaterialAttachmentCreateService is not provided')
}

const {
  multimediaList,
  openModalMultimediaSelect,
  setMultimediaAsCover,
  getMultimediaMenuTree,
  updateMultimediaList,
  startCropMultimedia,
} = multimediaCreateService
const {
  attachmentList,
  getAttachmentMenuTree,
  openModalAttachmentSelect,
  updateAttachmentList,
} = attachmentCreateService
const {
  u3mFile,
  hasU3mQuota,
  hasPhysicalData,
  hasUploadedU3mFile,
  needToGeneratePhysical,
  openModalUploadU3mFile,
  removeU3mFile,
} = u3mSelectService

const store = useStore()
const { goToBillings } = useNavigation()

const multimediaListForDraggable = computed({
  get: () => multimediaList,
  set: updateMultimediaList,
})

const attachmentListForDraggable = computed({
  get: () => attachmentList,
  set: updateAttachmentList,
})

const multimediaViewModeFileList = computed<MaterialViewModeFile[]>(() =>
  multimediaList.map((m) => ({
    id: m.id,
    originalUrl: m.originalUrl,
    thumbnailUrl: m.thumbnailUrl,
    displayName: m.displayFileName,
    extension: m.extension,
  }))
)

const attachmentViewModeFileList = computed<MaterialViewModeFile[]>(() =>
  attachmentList.map((a) => ({
    id: a.id,
    originalUrl: a.originalUrl,
    thumbnailUrl: a.thumbnailUrl,
    displayName: a.displayFileName,
    extension: a.extension,
  }))
)

const openMultimediaPreview = (index: number) => {
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

const openAttachmentPreview = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList: attachmentViewModeFileList,
        getMenuTree: getAttachmentMenuTree,
      },
    },
  })
}
</script>

<style scoped></style>
