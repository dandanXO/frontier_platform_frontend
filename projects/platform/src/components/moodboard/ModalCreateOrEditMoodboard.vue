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
      v-if="fileUploadErrorCode"
      :errorCode="fileUploadErrorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
    )
  div(class="w-121.5 flex flex-col gap-y-6")
    f-input-text(
      ref="refInputName"
      v-model:textValue="formData.moodboardName"
      required
      :label="$t('QQ0006')"
      :placeholder="$t('QQ0006')"
      :rules="[$inputRules.required(), (v) => v.length > 60 && $t('WW0108')]"
    )
    f-input-container(:label="$t('QQ0007')")
      div(class="flex items-center")
        img(class="w-5 h-5 rounded-full" :src="orgLogo")
        p(class="pl-2 text-body2 text-grey-900") {{ creator }}
    div
      div(class="h-5.5 flex items-center pb-1")
        p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0249') }}
        f-button-label(
          v-if="uploadTrendBoardName"
          size="sm"
          class="ml-1.5"
          @click="previewFile(formData.trendBoardFile)"
        ) {{ $t('UU0060') }}
      f-input-file(
        class="w-full mb-9"
        v-model:fileName="uploadTrendBoardName"
        :text="$t('UU0025')"
        :placeholder="$t('QQ0009')"
        :acceptType="trendBoardFileAcceptType"
        :maximumSize="fileSizeMaxLimit"
        @finish="trendBoardUploadFinish"
        @clear="removeTrendBoard"
        @error="fileUploadErrorCode = $event"
      )
    f-input-textarea(
      ref="refInputDescription"
      v-model:textValue="formData.description"
      :label="$t('RR0014')"
      :placeholder="$t('QQ0013')"
      required
      minHeight="min-h-44.5"
      :rules="[$inputRules.required(), (v) => v.length > 1000 && $t('WW0073')]"
    )
    f-input-container(:label="$t('QQ0015')")
      f-scrollbar-container(class="max-h-18 mb-2.5")
        div(class="grid gap-y-2 max-w-121.5")
          div(
            v-for="(attachment, index) in formData.attachmentFileList"
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

<script setup>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { FileOperator, bytesToSize, previewFile } from '@/utils/fileOperator'
import { CREATE_EDIT } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation.js'

const store = useStore()
const { goToMoodboardDetail } = useNavigation()

const props = defineProps({
  mode: {
    type: Number,
    default: CREATE_EDIT.CREATE,
  },
})

const formData = reactive({
  moodboardName: '',
  description: '',
  trendBoardFile: null,
  attachmentFileList: [],
  // the below variables only use for edit mode
  moodboardId: 0,
  deleteAttachmentIdList: [],
  isDeleteTrendBoard: false,
})
const isUploadNewTrendBoard = ref(false)
const uploadTrendBoardName = ref('')

// Use to EDIT mode
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
const fileSizeMaxLimit = 20 * Math.pow(1024, 2)
const trendBoardFileAcceptType = ['pdf']

const trendBoardUploadFinish = (file) => {
  store.dispatch('helper/pushModalLoading')
  formData.trendBoardFile = file
  isUploadNewTrendBoard.value = true
  fileUploadErrorCode.value = 0
  store.dispatch('helper/closeModalLoading')
}

const removeTrendBoard = () => {
  formData.trendBoardFile = null
  if (props.mode === CREATE_EDIT.EDIT) {
    formData.isDeleteTrendBoard = true
  }
}

const attachmentFileAcceptType = [
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'zip',
  'gif',
  'mov',
  'mp4',
]
const attachmentFileOperator = new FileOperator(
  attachmentFileAcceptType,
  fileSizeMaxLimit,
  true
)
const chooseAttachment = () => attachmentFileOperator.upload()
attachmentFileOperator.on('finish', (file) => {
  store.dispatch('helper/pushModalLoading')
  formData.attachmentFileList.unshift(file)
  fileUploadErrorCode.value = 0
  store.dispatch('helper/closeModalLoading')
})
attachmentFileOperator.on('error', (code) => {
  fileUploadErrorCode.value = code
})

const removeAttachment = (index) => formData.attachmentFileList.splice(index, 1)

const removeOriginalAttachment = (index, attachmentId) => {
  originalAttachmentList.value.splice(index, 1)
  formData.deleteAttachmentIdList.push(attachmentId)
}

const primaryBtnDisabled = computed(
  () =>
    !formData.moodboardName ||
    refInputName.value?.isError ||
    !formData.description ||
    refInputDescription.value?.isError
)
const primaryHandler = async () => {
  store.dispatch('helper/openModalLoading')
  if (props.mode === CREATE_EDIT.CREATE) {
    const { moodboardName, description, trendBoardFile, attachmentFileList } =
      formData
    const { moodboard } = await store.dispatch('moodboard/createMoodboard', {
      moodboardName,
      description,
      trendBoardFile,
      attachmentFileList,
    })
    goToMoodboardDetail(moodboard.moodboardId)
  } else {
    if (!isUploadNewTrendBoard.value) {
      formData.trendBoardFile = null
    }
    await store.dispatch('moodboard/updateMoodboard', formData)
  }
  store.dispatch('helper/closeModalLoading')
}

const closeModal = () => {
  store.dispatch('helper/closeModalBehavior')
}

if (props.mode === CREATE_EDIT.EDIT) {
  const {
    moodboardId,
    moodboardName,
    description,
    attachmentList,
    trendBoardUrl,
    trendBoardFileName,
  } = JSON.parse(JSON.stringify(store.getters['moodboard/moodboard']))
  Object.assign(formData, {
    moodboardId,
    moodboardName,
    description,
    trendBoardFile: trendBoardUrl,
  })
  originalAttachmentList.value = attachmentList
  uploadTrendBoardName.value = trendBoardFileName
}
</script>
