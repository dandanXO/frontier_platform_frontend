<template>
  <!-- Material Attachments Form -->
  <f-accordion
    :title="t('RR0136')"
    :desc="t('RR0558')"
    :defaultExpanded="defaultExpanded"
    class="bg-white"
  >
    <div class="flex flex-col gap-y-4 p-3">
      <TCTabs v-model="activeAttachmentTab" :tabs="attachmentTabsDefinition" />

      <div v-if="activeAttachmentTab === 'public'">
        <div class="flex flex-col gap-y-4">
          <div class="text-caption leading-1.6 text-grey-900 mb-3">
            <p>{{ t('RR0594') }}</p>
            <ul class="list-disc list-inside mt-1">
              <li>
                {{ t('RR0595') }}
                <span class="font-bold">{{
                  publicAttachmentAcceptType.join(', ').toUpperCase()
                }}</span>
              </li>
              <li>
                {{ t('RR0596') }}
                <span class="font-bold"
                  >{{ bytesToSize(fileSizeMaxLimit) }} {{ t('RR0597') }}</span
                >
              </li>
            </ul>
          </div>
          <div>
            <!-- File Upload Section -->
            <div class="w-full">
              <template v-if="publicAttachmentUploadList.length === 0">
                <div
                  class="rounded border-green-500-v1 bg-green-50-v1 border border-dashed h-57 flex justify-center items-center"
                  data-cy="modal-smart-upload_dropzone"
                  @drop.stop.prevent="onPublicAttachmentDrop($event)"
                  @dragover.prevent
                  @dragenter.prevent
                >
                  <div class="w-44 flex flex-col items-center">
                    <f-svg-icon
                      iconName="upload"
                      size="48"
                      class="text-green-500-v1 mb-4"
                    />
                    <i18n-t
                      keypath="RR0484"
                      tag="div"
                      class="text-center text-grey-600 text-body2 font-bold leading-1.6 mb-2"
                      scope="global"
                    >
                      <template #DD0108>
                        <span class="text-primary-400 inline-block">
                          {{ t('DD0108') }}</span
                        >
                      </template>
                    </i18n-t>
                    <f-button
                      size="md"
                      type="secondary"
                      data-cy="modal-smart-upload_browse"
                      @click="choosePublicAttachmentFile"
                      class="bg-green-50-v1 border-green-200-v1 border !text-green-500-v1"
                    >
                      {{ $t('DD0038') }}</f-button
                    >
                  </div>
                </div>
              </template>
              <template v-else>
                <f-scrollbar-container class="h-75">
                  <div class="grid divide-y divide-grey-100">
                    <div
                      v-for="(attachment, index) in publicAttachmentUploadList"
                      :key="index"
                      class="py-1 h-11 flex items-center"
                      data-cy="modal-smart-upload_item"
                    >
                      <div
                        class="flex-1 group py-1 h-9 rounded flex items-center px-5 hover:bg-grey-100"
                      >
                        <div
                          class="text-body2 font-bold text-grey-900 line-clamp-1 mr-2.5 flex-shrink-0"
                        >
                          {{ attachment.name }}
                        </div>
                        <f-svg-icon
                          iconName="clear"
                          iconSize="20"
                          class="cursor-pointer text-grey-600 invisible group-hover:visible"
                          @click="handleRemovePublicAttachmentFile(index)"
                        />
                      </div>
                    </div>
                  </div>
                </f-scrollbar-container>
              </template>
            </div>
            <file-upload-error-note
              v-if="publicAttachmentErrorCode"
              :errorCode="publicAttachmentErrorCode"
              :fileSizeMaxLimit="fileSizeMaxLimit"
              data-cy="modal-attachment-upload_error"
              class="mt-2"
            />
            <div
              v-else-if="isUploadingPublicAttachments"
              class="flex items-center text-grey-600 leading-1.6 mt-2"
            >
              <f-svg-icon iconName="info_outline" size="14" class="mr-1.5" />
              <div class="w-62.5">{{ $t('DD0106') }}</div>
            </div>
            <f-button
              v-if="publicAttachmentUploadList.length > 0"
              type="primary"
              size="md"
              class="mt-4"
              :disabled="isUploadingPublicAttachments || !meta.valid"
              @click="handleUploadPublicAttachments"
              >{{ $t('UU0022') }}</f-button
            >
          </div>
          <div
            v-if="multimediaList && multimediaList.length > 0"
            class="flex flex-wrap gap-5"
          >
            <f-infobar
              class="w-full"
              :notifyType="NOTIFY_TYPE.TIPS"
              :display="DISPLAY.BLOCK"
              :messageText="$t('MI0006')"
            />
            <draggable
              class="flex flex-wrap gap-5"
              v-model="multimediaListForDraggable"
              v-bind="fileCardDragOptions"
              group="multimedia"
              @change="handleMultimediaListChange"
            >
              <template #item="{ element: multimedia, index }">
                <multimedia-card
                  :key="multimedia.fileId"
                  :isCover="
                    selectedCoverId != null
                      ? selectedCoverId === multimedia.fileId
                      : multimedia.isCover
                  "
                  :thumbnailUrl="multimedia.thumbnailUrl"
                  :originalUrl="multimedia.originalUrl"
                  :extension="multimedia.extension"
                  :displayFileName="multimedia.displayFileName"
                  :menuTree="getMultimediaMenuTree(multimedia.fileId)"
                  @setCover="$emit('selectCover', multimedia.fileId)"
                  @edit="startCropMultimedia(multimedia.fileId)"
                  @click="openMultimediaViewMode(index)"
                />
              </template>
            </draggable>
          </div>
        </div>
      </div>

      <div v-if="activeAttachmentTab === 'private'">
        <div class="flex flex-col gap-y-4">
          <div class="text-caption leading-1.6 text-grey-900 mb-3">
            <p>{{ t('RR0594') }}</p>
            <ul class="list-disc list-inside mt-1">
              <li>
                {{ t('RR0595') }}
                <span class="font-bold">{{
                  privateAttachmentAcceptType.join(', ').toUpperCase()
                }}</span>
              </li>
              <li>
                {{ t('RR0596') }}
                <span class="font-bold"
                  >{{ bytesToSize(fileSizeMaxLimit) }} {{ t('RR0597') }}</span
                >
              </li>
            </ul>
          </div>
          <div>
            <!-- Private File Upload Section -->
            <div class="w-full">
              <template v-if="privateAttachmentUploadList.length === 0">
                <div
                  class="rounded border-green-500-v1 bg-green-50-v1 border border-dashed h-57 flex justify-center items-center"
                  data-cy="private-modal-smart-upload_dropzone"
                  @drop.stop.prevent="onPrivateAttachmentDrop($event)"
                  @dragover.prevent
                  @dragenter.prevent
                >
                  <div class="w-44 flex flex-col items-center">
                    <f-svg-icon
                      iconName="upload"
                      size="48"
                      class="text-green-500-v1 mb-4"
                    />
                    <i18n-t
                      keypath="RR0484"
                      tag="div"
                      class="text-center text-grey-600 text-body2 font-bold leading-1.6 mb-2"
                      scope="global"
                    >
                      <template #DD0108>
                        <span class="text-primary-400 inline-block">
                          {{ $t('DD0108') }}</span
                        >
                      </template>
                    </i18n-t>
                    <f-button
                      size="md"
                      type="secondary"
                      data-cy="private-modal-smart-upload_browse"
                      @click="choosePrivateAttachmentFile"
                      class="bg-green-50-v1 border-green-200-v1 border !text-green-500-v1"
                    >
                      {{ $t('DD0038') }}</f-button
                    >
                  </div>
                </div>
              </template>
              <template v-else>
                <f-scrollbar-container class="h-75">
                  <div class="grid divide-y divide-grey-100">
                    <div
                      v-for="(attachment, index) in privateAttachmentUploadList"
                      :key="index"
                      class="py-1 h-11 flex items-center"
                      data-cy="private-modal-smart-upload_item"
                    >
                      <div
                        class="flex-1 group py-1 h-9 rounded flex items-center px-5 hover:bg-grey-100"
                      >
                        <div
                          class="text-body2 font-bold text-grey-900 line-clamp-1 mr-2.5 flex-shrink-0"
                        >
                          {{ attachment.name }}
                        </div>
                        <f-svg-icon
                          iconName="clear"
                          iconSize="20"
                          class="cursor-pointer text-grey-600 invisible group-hover:visible"
                          @click="handleRemovePrivateAttachmentFile(index)"
                        />
                      </div>
                    </div>
                  </div>
                </f-scrollbar-container>
              </template>
            </div>
            <file-upload-error-note
              v-if="privateAttachmentErrorCode"
              :errorCode="privateAttachmentErrorCode"
              :fileSizeMaxLimit="fileSizeMaxLimit"
              data-cy="private-modal-attachment-upload_error"
              class="mt-2"
            />
            <div
              v-else-if="isUploadingPrivateAttachments"
              class="flex items-center text-grey-600 leading-1.6 mt-2"
            >
              <f-svg-icon iconName="info_outline" size="14" class="mr-1.5" />
              <div class="w-62.5">{{ $t('DD0106') }}</div>
            </div>
            <f-button
              v-if="privateAttachmentUploadList.length > 0"
              type="primary"
              size="md"
              class="mt-4"
              :disabled="isUploadingPrivateAttachments || !meta.valid"
              @click="handleUploadPrivateAttachments"
              >{{ $t('UU0022') }}</f-button
            >
          </div>
          <div v-if="attachmentList.length > 0" class="flex flex-wrap gap-5">
            <f-infobar
              class="w-full"
              :notifyType="NOTIFY_TYPE.TIPS"
              :display="DISPLAY.BLOCK"
              :messageText="$t('MI0006')"
            />
            <draggable
              class="flex flex-wrap gap-5"
              v-model="attachmentListForDraggable"
              v-bind="fileCardDragOptions"
              group="attachment"
              @change="handleAttachmentListChange"
            >
              <template #item="{ element: attachment, index }">
                <attachment-card
                  :key="attachment.id"
                  :thumbnailUrl="attachment.thumbnailUrl"
                  :originalUrl="attachment.originalUrl"
                  :displayFileName="attachment.displayFileName"
                  :extension="attachment.extension"
                  :menuTree="getAttachmentMenuTree(attachment.fileId)"
                  @click="openAttachmentPreview(index)"
                />
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </f-accordion>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, inject } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import {
  MATERIAL_FILE_ACCEPT_TYPE,
  NOTIFY_TYPE,
  DISPLAY,
  materialAttachmentUpdateServiceKey,
  materialMultimediaUpdateServiceKey,
  materialFormServiceKey,
} from '@/utils/constants'
import { useNotifyStore } from '@/stores/notify'
import { useAssetsStore } from '@/stores/assets'
import {
  type MultimediaFile,
  type AttachmentFile,
  type Material,
} from '@frontier/platform-web-sdk'
import MultimediaCard from '@/components/common/material/multimedia/MultimediaCard.vue'
import AttachmentCard from '@/components/common/material/attachment/AttachmentCard.vue'
import Draggable from 'vuedraggable'
import TCTabs from '@/components/TCTabs.vue'
import { bytesToSize, FileOperator } from '@frontier/lib'
import { uploadFileToS3 } from '@/utils/fileUpload'
import type {
  MaterialFormService,
  MaterialAttachmentUpdateService,
  MaterialMultimediaUpdateService,
  CoverId,
} from '@/types'

interface Props {
  material: Material
  defaultExpanded?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectCover: [coverId: number]
}>()

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { ogBaseAssetsApi } = useAssetsStore()

// Inject services
const materialFormService = inject<MaterialFormService>(materialFormServiceKey)!
const attachmentUpdateService = inject<MaterialAttachmentUpdateService>(
  materialAttachmentUpdateServiceKey
)!
const multimediaUpdateService = inject<MaterialMultimediaUpdateService>(
  materialMultimediaUpdateServiceKey
)!

// Tab state
const activeAttachmentTab = ref('public')
const attachmentTabsDefinition = computed(() => [
  { id: 'public', name: t('FF0030') },
  { id: 'private', name: t('FF0031') },
])

// File size limit
const fileSizeMaxLimit = computed(
  () => store.getters['organization/materialAttachmentUploadSizeLimit']
)

// Form meta from service
const { meta } = materialFormService

// Draggable lists
const multimediaListForDraggable = computed({
  get: () => multimediaUpdateService.multimediaList.value,
  set: multimediaUpdateService.updateMultimediaList,
})

const attachmentListForDraggable = computed({
  get: () => attachmentUpdateService.attachmentList.value,
  set: attachmentUpdateService.updateAttachmentList,
})

// Drag options
const fileCardDragOptions = {
  animation: 150,
  ghostClass: 'ghost',
  dragClass: 'drag',
}

// Computed properties
const multimediaList = computed<MultimediaFile[]>(
  () => multimediaUpdateService.multimediaList.value
)
const selectedCoverId = computed<CoverId | null>(
  () => multimediaUpdateService.selectedCoverId.value
)
const attachmentList = computed<AttachmentFile[]>(
  () => attachmentUpdateService.attachmentList.value
)

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

const attachmentViewModeFileList = computed(() =>
  attachmentList.value.map((a) => ({
    id: a.fileId,
    originalUrl: a.originalUrl,
    displayUrl: a.originalUrl,
    thumbnailUrl: a.thumbnailUrl,
    displayName: a.displayFileName,
    extension: a.extension,
  }))
)

// Handler functions
const handleMultimediaListChange = (e: {
  moved: { element: MultimediaFile; newIndex: number }
}) => {
  const { element, newIndex } = e.moved
  multimediaUpdateService.moveMultimedia(element.fileId, newIndex)
}

const handleAttachmentListChange = (e: {
  moved: { element: AttachmentFile; newIndex: number }
}) => {
  const { element, newIndex } = e.moved
  attachmentUpdateService.moveAttachment(element.fileId, newIndex)
}

const getMultimediaMenuTree = (fileId: number) => {
  return multimediaUpdateService.getMultimediaMenuTree(fileId)
}

const getAttachmentMenuTree = (fileId: number) => {
  return attachmentUpdateService.getAttachmentMenuTree(fileId)
}

const startCropMultimedia = (fileId: number) => {
  multimediaUpdateService.startCropMultimedia(fileId)
}

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

// Public attachment upload logic
const publicAttachmentUploadList = reactive<File[]>([])
const publicAttachmentErrorCode = ref('')
const isUploadingPublicAttachments = ref(false)
const publicAttachmentAcceptType = MATERIAL_FILE_ACCEPT_TYPE

const publicAttachmentFileOperator = new FileOperator(
  publicAttachmentAcceptType,
  fileSizeMaxLimit.value
)

const choosePublicAttachmentFile = () => {
  publicAttachmentFileOperator.upload(true)
}

const onPublicAttachmentDrop = (evt: DragEvent) => {
  publicAttachmentFileOperator.onDrop(evt)
}

publicAttachmentFileOperator.on('finish', (file: File) => {
  publicAttachmentErrorCode.value = ''
  // Check for duplicates by name before adding
  if (
    !publicAttachmentUploadList.some(
      (existingFile) => existingFile.name === file.name
    )
  ) {
    publicAttachmentUploadList.push(file)
  } else {
    // Optionally, notify the user about the duplicate file
    publicAttachmentErrorCode.value = 'DUPLICATE_FILE' // Example custom error code
    notify.showNotifySnackbar({
      messageText: 'This file already exists',
      notifyType: NOTIFY_TYPE.WARNING,
    }) // Replace WW000X with actual i18n key for duplicate file
  }
})

publicAttachmentFileOperator.on('error', (code: string) => {
  publicAttachmentErrorCode.value = code
})

const handleRemovePublicAttachmentFile = (index: number) => {
  publicAttachmentUploadList.splice(index, 1)
}

const handleUploadPublicAttachments = async () => {
  if (publicAttachmentUploadList.length === 0) {
    return
  }
  isUploadingPublicAttachments.value = true
  publicAttachmentErrorCode.value = ''
  store.dispatch('helper/pushModalLoading') // Show global loading indicator

  try {
    const s3FileList = await Promise.all(
      publicAttachmentUploadList.map((file) => uploadFileToS3(file, file.name))
    )

    const res = await ogBaseAssetsApi('uploadAssetsMaterialMultimedia', {
      materialId: props.material.materialId,
      multimediaList: s3FileList.map((file, index) => {
        return {
          s3UploadId: file.s3UploadId,
          fileName: file.fileName,
          displayFileName: file.fileName, // Or derive a display name if needed
          isCover: multimediaList.value.length === 0 && index === 0,
        }
      }),
    })

    // Assuming the response structure is { data: { result: { multimediaList: MultimediaFile[] } } }
    // And that material.value.multimediaList is the reactive source for the draggable list
    if (res.data.result.multimediaList) {
      multimediaUpdateService.updateMultimediaList(
        res.data.result.multimediaList
      )
    }

    notify.showNotifySnackbar({ messageText: t('EE0069') }) // Success message
    publicAttachmentUploadList.splice(0, publicAttachmentUploadList.length) // Clear the staged list
  } catch (error: any) {
    console.error('Upload error:', error)
    let errorCode = 'DD0020' // Default generic upload error
    if (error?.response?.data?.code) {
      errorCode = error.response.data.code
    } else if (error?.code) {
      errorCode = error.code
    } else if (error?.message?.includes('Network Error')) {
      errorCode = 'NETWORK_ERROR'
    }
    publicAttachmentErrorCode.value = errorCode
    notify.showNotifySnackbar({
      messageText: t(errorCode, errorCode), // Fallback to errorCode itself if t(errorCode) is not found
      notifyType: NOTIFY_TYPE.WARNING,
    })
  } finally {
    isUploadingPublicAttachments.value = false
    store.dispatch('helper/closeModalLoading') // Hide global loading indicator
  }
}

// Private attachment upload logic
const privateAttachmentUploadList = reactive<File[]>([])
const privateAttachmentErrorCode = ref('')
const isUploadingPrivateAttachments = ref(false)
const privateAttachmentAcceptType = MATERIAL_FILE_ACCEPT_TYPE // Same accept type as public for now, adjust if different

const privateAttachmentFileOperator = new FileOperator(
  privateAttachmentAcceptType,
  fileSizeMaxLimit.value
)

// Private Attachment Handlers
const choosePrivateAttachmentFile = () => {
  privateAttachmentFileOperator.upload(true)
}

const onPrivateAttachmentDrop = (evt: DragEvent) => {
  privateAttachmentFileOperator.onDrop(evt)
}

privateAttachmentFileOperator.on('error', (code: string) => {
  // Same potential issue as 'finish'
  privateAttachmentErrorCode.value = code
})

const handleRemovePrivateAttachmentFile = (index: number) => {
  privateAttachmentUploadList.splice(index, 1)
}

// New function for handling private attachment uploads
const handleUploadPrivateAttachments = async () => {
  if (privateAttachmentUploadList.length === 0) {
    return
  }
  isUploadingPrivateAttachments.value = true
  privateAttachmentErrorCode.value = ''
  store.dispatch('helper/pushModalLoading')

  try {
    const s3FileList = await Promise.all(
      privateAttachmentUploadList.map((file) => uploadFileToS3(file, file.name))
    )

    const res = await ogBaseAssetsApi('uploadAssetsMaterialAttachment', {
      materialId: props.material.materialId,
      attachmentList: s3FileList.map((file) => ({
        s3UploadId: file.s3UploadId,
        fileName: file.fileName,
        displayFileName: file.fileName,
      })),
    })

    if (res.data.result.attachmentList) {
      attachmentUpdateService.updateAttachmentList(
        res.data.result.attachmentList
      )
    }

    notify.showNotifySnackbar({ messageText: t('EE0069') }) // Generic success
    privateAttachmentUploadList.splice(0, privateAttachmentUploadList.length)
  } catch (error: any) {
    console.error('Private attachment upload error:', error)
    let errorCode = 'DD0020' // Default generic upload error
    if (error?.response?.data?.code) {
      errorCode = error.response.data.code
    } else if (error?.code) {
      errorCode = error.code
    } else if (error?.message?.includes('Network Error')) {
      errorCode = 'NETWORK_ERROR'
    }
    privateAttachmentErrorCode.value = errorCode
    notify.showNotifySnackbar({
      messageText: t(errorCode, errorCode),
      notifyType: NOTIFY_TYPE.WARNING, // As per user change
    })
  } finally {
    isUploadingPrivateAttachments.value = false
    store.dispatch('helper/closeModalLoading')
  }
}

onMounted(() => {
  // Setup listeners for privateAttachmentFileOperator
  privateAttachmentFileOperator.on('finish', (file: File) => {
    privateAttachmentErrorCode.value = ''
    if (
      !privateAttachmentUploadList.some(
        (existingFile) => existingFile.name === file.name
      )
    ) {
      privateAttachmentUploadList.push(file)
    } else {
      privateAttachmentErrorCode.value = 'DUPLICATE_FILE' // Or a more specific code for private
      notify.showNotifySnackbar({
        messageText: 'This file already exists',
        notifyType: NOTIFY_TYPE.WARNING,
      })
    }
  })

  privateAttachmentFileOperator.on('error', (code: string) => {
    privateAttachmentErrorCode.value = code
    // Optionally, display a notification for this error as well
    notify.showNotifySnackbar({
      messageText: t(code, code),
      notifyType: NOTIFY_TYPE.WARNING,
    })
  })
})
</script>
