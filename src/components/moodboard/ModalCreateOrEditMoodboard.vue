<template lang="pug">
modal-behavior(
  :header="mode === MODE.CREATE ? $t('QQ0003') : $t('QQ0022')"
  :primaryBtnText="$t('UU0020')"
  :primaryBtnDisabled="primaryBtnDisabled"
  @click:primary="createMoodboard"
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
          btn-functional(v-if="formData.trendBoardFile" size="sm" class="ml-1.5" @click="previewFile(formData.trendBoardFile)") {{ $t('UU0060') }}
        input-text-btn(
          class="w-full"
          disabledInput
          :textValue="formData.trendBoardFile?.name || ''"
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
      overlay-scrollbar-container(v-if="formData.attachmentFileList.length > 0" class="max-h-18 mb-2.5")
        div(class="grid gap-y-2")
          div(v-for="(attachment, index) in formData.attachmentFileList" class="h-8 flex justify-between items-center px-4 bg-black-100")
            div(class="flex items-center gap-x-1")
              p(class="text-body2 font-bold text-primary line-clamp-1") {{ attachment.name }}
              p(class="text-body2 font-normal text-primary flex-shrink-0") ({{ bytesToSize(attachment.size) }})
            svg-icon(iconName="clear" size="14" class="text-primary ml-1 cursor-pointer" @click="removeAttachment(index)")
      btn(size="sm" type="secondary" prependIcon="add" @click="chooseAttachment") {{ $t("UU0063") }}
      div(class="text-caption text-black-600 pt-2")
        p(class="pb-1") {{ $t("QQ0012") }}
        p {{ $t("QQ0011") }}
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { FileOperator, bytesToSize, previewFile } from '@/utils/fileOperator'

const store = useStore()

defineProps({
  mode: {
    type: Number,
    default: 1 // mode create
  }
})

const MODE = {
  CREATE: 1,
  EDIT: 2
}

const formData = reactive({
  moodboardName: '',
  description: '',
  trendBoardFile: null,
  attachmentFileList: []
})

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
  formData.trendBoardFile = file
  fileUploadErrorCode.value = 0
})
trendBoardFileOperator.on('selfDefinedError', (code) => {
  fileUploadErrorCode.value = code
})
const removeTrendBoard = () => {
  formData.trendBoardFile = null
}

const attachmentFileOperator = new FileOperator(['pdf', 'jpg', 'jpeg', 'png', 'zip', 'gif', 'mov', 'mp4'], fileSizeMaxLimit, true)
const chooseAttachment = () => attachmentFileOperator.upload()
attachmentFileOperator.on('finish', (file) => {
  formData.attachmentFileList.push(file)
  fileUploadErrorCode.value = 0
})
attachmentFileOperator.on('selfDefinedError', (code) => {
  fileUploadErrorCode.value = code
})

const removeAttachment = (index) => {
  formData.attachmentFileList.splice(index, 1)
}

const createMoodboard = async () => {
  store.dispatch('helper/openModalLoading')
  await store.dispatch('moodboard/createMoodboard', formData)
  store.dispatch('helper/closeModalLoading')
}

</script>
