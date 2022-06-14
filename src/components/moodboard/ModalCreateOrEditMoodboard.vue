<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.CREATE ? $t('QQ0003') : $t('QQ0022')"
  :primaryBtnText="mode === CREATE_EDIT.CREATE ? $t('UU0020') : $t('UU0018')"
  :primaryBtnDisabled="primaryBtnDisabled"
  @click:primary="primaryHandler"
  :secondaryBtnText="$t('UU0026')"
)
  template(#note)
    file-upload-error-note(v-if="fileUploadErrorCode" :errorCode="fileUploadErrorCode" :fileSizeMaxLimit="fileSizeMaxLimit")
  div(class="w-121.5 grid gap-y-6")
    input-text(
      ref="refInputName"
      v-model:textValue="formData.moodboardName"
      required
      :label="$t('QQ0006')"
      :placeholder="$t('QQ0006')"
      :rules="[(v) => v.length > 60 && $t('WW0108')]"
    )
    input-container(:label="$t('QQ0007')")
      div(class="flex items-center")
        img(class="w-5 h-5 rounded-full" :src="orgLogo")
        p(class="pl-2 text-body2 text-primary") {{ creator }}
    div
      div
        div(class="h-5.5 flex items-center pb-1")
          p(class="text-body2 text-primary font-bold") {{ $t('FF0011') }}
          btn-functional(v-if="uploadTrendBoardName" size="sm" class="ml-1.5" @click="previewTrendBoard") {{ $t('UU0060') }}
        input-text-btn(
          class="w-full"
          disabledInput
          :textValue="uploadTrendBoardName"
          :buttonLabel="$t('UU0025')"
          :placeholder="$t('QQ0009')"
          @click:button="chooseTrendBoard"
          @clear="removeTrendBoard"
        )
      div(class="grid gap-y-2 pt-1.5")
        p(class='text-black-600 text-caption') {{ $t('FF0014') }}
        p(class='text-black-600 text-caption') {{ $t('FF0015') }}
    div
      input-textarea(
        ref="refInputDescription"
        v-model:textValue="formData.description"
        :label="$t('RR0014')"
        :placeholder="$t('QQ0013')"
        required
        height="178"
        :rules="[(v) => v.length > 1000 && $t('WW0073')]"
      )
    input-container(:label="$t('QQ0015')")
      overlay-scrollbar-container(class="max-h-18 mb-2.5")
        div(class="grid gap-y-2")
          div(v-for="(attachment, index) in formData.attachmentFileList" class="h-8 flex justify-between items-center px-4 bg-black-100")
            div(class="flex items-center gap-x-1")
              p(class="text-body2 font-bold text-primary line-clamp-1") {{ attachment.name }}
              p(class="text-body2 font-normal text-primary flex-shrink-0") ({{ bytesToSize(attachment.size) }})
            svg-icon(iconName="clear" size="14" class="text-primary ml-1 cursor-pointer" @click="removeAttachment(index)")
          div(v-for="attachment in originalAttachmentList" class="h-8 flex justify-between items-center px-4 bg-black-100")
            div(class="flex items-center gap-x-1")
              p(class="text-body2 font-bold text-primary line-clamp-1") {{ attachment.displayFileName }}
              p(class="text-body2 font-normal text-primary flex-shrink-0") ({{ bytesToSize(attachment.fileSize) }})
            svg-icon(iconName="clear" size="14" class="text-primary ml-1 cursor-pointer" @click="removeOriginalAttachment(index,attachment.attachmentId)")
      btn(size="sm" type="secondary" prependIcon="add" @click="chooseAttachment") {{ $t("UU0063") }}
      div(class="text-caption text-black-600 pt-2")
        p(class="pb-1") {{ $t("QQ0012") }}
        p {{ $t("QQ0011") }}
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { FileOperator, bytesToSize, previewFile } from '@/utils/fileOperator'
import { CREATE_EDIT } from '@/utils/constants.js'
import useNavigation from '@/composables/useNavigation.js'

const store = useStore()
const { goToMoodboardDetail } = useNavigation()

const props = defineProps({
  mode: {
    type: Number,
    default: CREATE_EDIT.CREATE
  }
})

const formData = reactive({
  moodboardName: '',
  description: '',
  trendBoardFile: null,
  attachmentFileList: [],
  // the below variables only use for edit mode
  moodboardId: 0,
  deleteAttachmentIdList: [],
  isDeleteTrendBoard: false
})
const uploadTrendBoardName = ref('')

// Use to EDIT mode
const originalTrendBoard = ref(null)
const originalAttachmentList = ref([])

const orgLogo = computed(() => store.getters['organization/orgLogo'])
const creator = computed(() => {
  return store.getters['helper/routeLocation'] === 'org'
    ? store.getters['organization/organization'].orgName
    : store.getters['group/group'].groupName
})

const refInputName = ref(null)
const refInputDescription = ref(null)
const fileUploadErrorCode = ref(0)
const fileSizeMaxLimit = 20
const primaryBtnDisabled = computed(() => !formData.moodboardName || refInputName.value?.isError || !formData.description || refInputDescription.value?.isError)

const trendBoardFileOperator = new FileOperator(['pdf'], fileSizeMaxLimit, true)
const chooseTrendBoard = () => trendBoardFileOperator.upload()
trendBoardFileOperator.on('finish', (file) => {
  store.dispatch('helper/pushModalLoading')
  formData.trendBoardFile = file
  uploadTrendBoardName.value = file.name
  fileUploadErrorCode.value = 0
  store.dispatch('helper/closeModalLoading')
})
trendBoardFileOperator.on('selfDefinedError', (code) => {
  fileUploadErrorCode.value = code
})
const previewTrendBoard = () => {
  if (props.mode === CREATE_EDIT.CREATE) {
    previewFile(formData.trendBoardFile)
  } else {
    formData.isDeleteTrendBoard
      ? previewFile(formData.trendBoardFile)
      : previewFile(originalTrendBoard.value)
  }
}
const removeTrendBoard = () => {
  formData.trendBoardFile = null
  uploadTrendBoardName.value = ''
  if (props.mode === CREATE_EDIT.EDIT) {
    formData.isDeleteTrendBoard = true
  }
}

const attachmentFileOperator = new FileOperator(['pdf', 'jpg', 'jpeg', 'png', 'zip', 'gif', 'mov', 'mp4'], fileSizeMaxLimit, true)
const chooseAttachment = () => attachmentFileOperator.upload()
attachmentFileOperator.on('finish', (file) => {
  store.dispatch('helper/pushModalLoading')
  formData.attachmentFileList.unshift(file)
  fileUploadErrorCode.value = 0
  store.dispatch('helper/closeModalLoading')
})
attachmentFileOperator.on('selfDefinedError', (code) => {
  fileUploadErrorCode.value = code
})

const removeAttachment = (index) => formData.attachmentFileList.splice(index, 1)

const removeOriginalAttachment = (index, attachmentId) => {
  originalAttachmentList.value.splice(index, 1)
  formData.deleteAttachmentIdList.push(attachmentId)
}

const primaryHandler = async () => {
  store.dispatch('helper/openModalLoading')
  if (props.mode === CREATE_EDIT.CREATE) {
    const { moodboardName, description, trendBoardFile, attachmentFileList } = formData
    const { moodboard } = await store.dispatch('moodboard/createMoodboard', { moodboardName, description, trendBoardFile, attachmentFileList })
    goToMoodboardDetail(moodboard.moodboardId)
  } else {
    await store.dispatch('moodboard/updateMoodboard', formData)
  }
  store.dispatch('helper/closeModalLoading')
}

if (props.mode === CREATE_EDIT.EDIT) {
  const { moodboardId, moodboardName, description, attachmentList, trendBoardUrl, trendBoardFileName } = JSON.parse(JSON.stringify(store.getters['moodboard/moodboard']))
  Object.assign(formData, { moodboardId, moodboardName, description })
  originalTrendBoard.value = trendBoardUrl
  originalAttachmentList.value = attachmentList
  uploadTrendBoardName.value = trendBoardFileName
}

</script>
