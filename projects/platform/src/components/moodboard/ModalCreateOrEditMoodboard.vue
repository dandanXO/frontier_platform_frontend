<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.CREATE ? $t('QQ0003') : $t('QQ0022')"
  :primaryBtnText="mode === CREATE_EDIT.CREATE ? $t('UU0020') : $t('UU0018')"
  :primaryBtnDisabled="primaryBtnDisabled"
  :secondaryBtnText="$t('UU0026')"
  @click:primary="primaryHandler"
  @click:secondary="closeModal"
)
  template(#note)
    file-upload-error-note(
      v-if="(refInputTrendBoardUpload && refInputTrendBoardUpload.errorCode) || fileUploadErrorCode"
      :errorCode="(refInputTrendBoardUpload && refInputTrendBoardUpload.errorCode) || fileUploadErrorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
    )
  div(class="w-121.5 flex flex-col gap-y-6")
    f-input-text(
      ref="refInputName"
      v-model:textValue="moodboardName"
      required
      :label="$t('QQ0006')"
      :placeholder="$t('QQ0006')"
      :rules="[inputRules.required(), inputRules.maxLength(60, $t('WW0108'))]"
    )
    f-input-container(:label="$t('QQ0007')")
      div(class="flex items-center")
        img(class="w-5 h-5 rounded-full" :src="orgLogo")
        p(class="pl-2 text-body2 text-grey-900") {{ ogName }}
    input-trend-board-upload(
      ref="refInputTrendBoardUpload"
      :defaultTrendBoard="defaultTrendBoard"
    )
    f-input-textarea(
      ref="refInputDescription"
      v-model:textValue="description"
      :label="$t('RR0014')"
      :placeholder="$t('QQ0013')"
      required
      minHeight="min-h-44.5"
      :rules="[inputRules.required(), inputRules.maxLength(1000, $t('WW0073'))]"
    )
    f-input-container(:label="$t('RR0298')")
      f-scrollbar-container(class="max-h-18 mb-2.5")
        div(class="grid gap-y-2 max-w-121.5")
          div(
            v-for="(attachment, index) in attachmentFileList"
            :key="attachment.name"
            class="h-8 flex justify-between items-center px-4 bg-grey-50"
          )
            div(class="flex items-center gap-x-1")
              p(class="text-body2 font-bold text-grey-900 line-clamp-1") {{ attachment.name }}
              p(class="text-body2 font-normal text-grey-900 flex-shrink-0") ({{ bytesToSize(attachment.size) }})
            f-svg-icon(
              iconName="clear"
              size="14"
              class="text-grey-900 ml-1 cursor-pointer"
              @click="removeAttachment(index)"
            )
          div(
            v-for="(attachment, index) in originalAttachmentList"
            :key="attachment.displayFileName"
            class="h-8 flex justify-between items-center px-4 bg-grey-50"
          )
            div(class="flex items-center gap-x-1")
              p(class="text-body2 font-bold text-grey-900 line-clamp-1") {{ attachment.displayFileName }}
              p(class="text-body2 font-normal text-grey-900 flex-shrink-0") ({{ bytesToSize(attachment.fileSize) }})
            f-svg-icon(
              iconName="clear"
              size="14"
              class="text-grey-900 ml-1 cursor-pointer"
              @click="removeOriginalAttachment(index, attachment.attachmentId)"
            )
      f-button(
        size="sm"
        type="secondary"
        prependIcon="add"
        @click="chooseAttachment"
      ) {{ $t('UU0063') }}
      div(class="text-caption text-grey-600 pt-2")
        p(class="pb-1") {{ $t('RR0243') }} {{ attachmentFileAcceptType.join(', ').toUpperCase() }}
        p {{ $t('RR0145') }} {{ bytesToSize(fileSizeMaxLimit) }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { FileOperator, bytesToSize, inputRules } from '@frontier/lib'
import { CREATE_EDIT } from '@/utils/constants'
import { type UPLOAD_ERROR_CODE, EXTENSION } from '@frontier/constants'
import useNavigation from '@/composables/useNavigation'
import useCurrentUnit from '@/composables/useCurrentUnit'
import { FInputText } from '@frontier/ui-component'
import { uploadFileToS3 } from '@/utils/fileUpload'
import { useMoodboardStore } from '@/stores/moodboard'
import type {
  Moodboard,
  MoodboardAllOfAttachmentList,
  TrendBoard,
} from '@frontier/platform-web-sdk'
import InputTrendBoardUpload from '@/components/common/collection/InputTrendBoardUpload.vue'

const props = defineProps<{
  moodboard?: Moodboard
}>()

const moodboard = ref(props.moodboard)
const mode = computed(() =>
  moodboard.value ? CREATE_EDIT.EDIT : CREATE_EDIT.CREATE
)
const store = useStore()
const { ogBaseMoodboardApi } = useMoodboardStore()
const { ogName } = useCurrentUnit()
const { goToMoodboardDetail } = useNavigation()
const orgLogo = computed(() => store.getters['organization/orgLogo'])

const moodboardName = ref<string | null>(null)
const description = ref<string | null>(null)
const refInputTrendBoardUpload =
  ref<InstanceType<typeof InputTrendBoardUpload>>()
const defaultTrendBoard = ref<TrendBoard | null>(null)
const attachmentFileList = ref<File[]>([])
const originalAttachmentList = ref<MoodboardAllOfAttachmentList[]>([]) // Use to EDIT mode
const deleteAttachmentIdList = ref<number[]>([]) // Use to EDIT mode

if (mode.value === CREATE_EDIT.EDIT && moodboard.value) {
  moodboardName.value = moodboard.value.moodboardName
  description.value = moodboard.value.description
  defaultTrendBoard.value = moodboard.value.trendBoard
  originalAttachmentList.value = moodboard.value.attachmentList
}

const fileUploadErrorCode = ref<UPLOAD_ERROR_CODE | null>(null)
const fileSizeMaxLimit = 20 * Math.pow(1024, 2)
const attachmentFileAcceptType = [
  EXTENSION.PDF,
  EXTENSION.JPG,
  EXTENSION.JPEG,
  EXTENSION.PNG,
  EXTENSION.ZIP,
  EXTENSION.GIF,
  EXTENSION.MOV,
  EXTENSION.MP4,
]
const attachmentFileOperator = new FileOperator(
  attachmentFileAcceptType,
  fileSizeMaxLimit
)
const chooseAttachment = () => attachmentFileOperator.upload()
attachmentFileOperator.on('finish', (file: File) => {
  attachmentFileList.value.unshift(file)
  fileUploadErrorCode.value = null
})
attachmentFileOperator.on('error', (code: UPLOAD_ERROR_CODE) => {
  fileUploadErrorCode.value = code
})
const removeAttachment = (index: number) =>
  attachmentFileList.value.splice(index, 1)
const removeOriginalAttachment = (index: number, attachmentId: number) => {
  originalAttachmentList.value.splice(index, 1)
  deleteAttachmentIdList.value.push(attachmentId)
}

const refInputName = ref<InstanceType<typeof FInputText>>()
const refInputDescription = ref<InstanceType<typeof FInputText>>()
const primaryBtnDisabled = computed(
  () =>
    !moodboardName.value ||
    refInputName.value?.isError ||
    !description.value ||
    refInputDescription.value?.isError
)
const primaryHandler = async () => {
  if (!moodboardName.value || !description.value) {
    return
  }

  store.dispatch('helper/pushModalLoading')

  const attachmentList = await Promise.all(
    attachmentFileList.value.map(async (file) => {
      const { s3UploadId, fileName } = await uploadFileToS3(file, file.name)
      return {
        s3UploadId,
        fileName,
      }
    })
  )

  const uploadedTrendBoard = refInputTrendBoardUpload.value
    ? await refInputTrendBoardUpload.value.getTrendBoardS3Object()
    : null

  if (mode.value === CREATE_EDIT.CREATE) {
    const { data } = await ogBaseMoodboardApi('createMoodboard', {
      moodboardName: moodboardName.value,
      description: description.value,
      trendBoard: uploadedTrendBoard,
      attachmentList,
    })
    goToMoodboardDetail({}, data.result.moodboard.moodboardId)
  } else {
    await ogBaseMoodboardApi('updateMoodboard', {
      moodboardId: moodboard.value!.moodboardId,
      moodboardName: moodboardName.value,
      description: description.value,
      newTrendBoard: uploadedTrendBoard,
      newAttachmentList: attachmentList,
      deleteAttachmentIdList: deleteAttachmentIdList.value,
      isDeleteTrendBoard:
        refInputTrendBoardUpload.value?.isDeleteTrendBoard ?? false,
    })
  }

  store.dispatch('helper/reloadInnerApp')
  store.dispatch('helper/clearModalPipeline')
}

const closeModal = () => {
  store.dispatch('helper/closeModalBehavior')
}
</script>
