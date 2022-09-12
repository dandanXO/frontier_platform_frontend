<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.EDIT ? $t('FF0009') : $t('QQ0056')"
  :primaryBtnText="mode === CREATE_EDIT.CREATE ? $t('UU0020') : $t('UU0018')"
  :primaryBtnDisabled="primaryBtnDisabled"
  @click:primary="primaryHandler"
)
  template(#note v-if="mode === CREATE_EDIT.CREATE")
    div(class="flex items-center text-black-600")
      f-svg-icon(iconName="info_outline" size="20")
      p(class="text-caption leading-1.6 pl-1.5") {{ $t('QQ0060') }}
  div(class="w-95")
    f-input-text(
      v-model:textValue="formData.name"
      required
      :rules="[$inputRules.required()]"
      :label="$t('FF0010')"
      :placeholder="$t('QQ0058')"
      class="pb-6"
    )
    div(class="h-35")
      div
        div(class="h-5.5 flex items-center pb-1")
          p(class="text-body2 text-primary font-bold") {{ $t('RR0249') }}
          f-button-label(v-if="uploadTrendBoardName" size="sm" class="ml-1.5" @click="previewFile(formData.trendBoardFile)") {{ $t('UU0060') }}
        f-input-text-button(
          class="w-full"
          disabledInput
          :textValue="uploadTrendBoardName"
          :buttonLabel="$t('UU0025')"
          :placeholder="$t('QQ0009')"
          @click:button="trendBoardFileOperator.upload()"
          @clear="removeTrendBoard"
        )
      p(v-if="!!customErrorMsg" class="text-warn text-caption leading-1.6") {{ customErrorMsg }}
      p(class="text-black-600 text-caption leading-1.6") {{ $t("RR0243") }} {{ trendBoardFileAcceptType.join(', ').toUpperCase() }}
      p(class="text-black-600 text-caption leading-1.6") {{ $t("RR0145") }} {{ fileSizeMaxLimit }} MB
    f-input-textarea(
      v-model:textValue="formData.description"
      :label="$t('RR0014')"
      :placeholder="$t('QQ0059')"
      height="120"
    )
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { FileOperator, previewFile } from '@/utils/fileOperator'
import { CREATE_EDIT, UPLOAD_ERROR_CODE } from '@/utils/constants.js'

const props = defineProps({
  mode: {
    type: Number,
    default: CREATE_EDIT.CREATE
  },
  nodeId: { // if is create mode then nodeId is refer to parent nodeId, otherwise is refer to that node collection
    type: Number,
    required: true
  }
})

const { t } = useI18n()
const store = useStore()

const formData = reactive({
  nodeId: props.nodeId,
  name: '',
  description: '',
  trendBoardFile: null,
  // the below variables only use for edit mode
  isDeleteTrendBoard: false
})
const isUploadNewTrendBoard = ref(false)
const uploadTrendBoardName = ref('')
const customErrorMsg = ref('')

const fileSizeMaxLimit = 20
const trendBoardFileAcceptType = ['pdf']
const trendBoardFileOperator = new FileOperator(trendBoardFileAcceptType, fileSizeMaxLimit)

trendBoardFileOperator.on('error', (code) => {
  const { INVALID_TYPE, EXCEED_LIMIT } = UPLOAD_ERROR_CODE

  if (code === INVALID_TYPE) {
    customErrorMsg.value = t('RR0144')
  } else if (code === EXCEED_LIMIT) {
    customErrorMsg.value = t('RR0145') + fileSizeMaxLimit + 'MB'
  }
})

trendBoardFileOperator.on('finish', (file) => {
  customErrorMsg.value = ''
  store.dispatch('helper/pushModalLoading')
  formData.trendBoardFile = file
  uploadTrendBoardName.value = file.name
  isUploadNewTrendBoard.value = true
  store.dispatch('helper/closeModalLoading')
})
const removeTrendBoard = () => {
  formData.trendBoardFile = null
  uploadTrendBoardName.value = ''
  if (props.mode === CREATE_EDIT.EDIT) {
    formData.isDeleteTrendBoard = true
  }
}

const primaryBtnDisabled = computed(() => !formData.name)

const primaryHandler = async () => {
  store.dispatch('helper/pushModalLoading')
  if (props.mode === CREATE_EDIT.EDIT) {
    if (!isUploadNewTrendBoard.value) {
      formData.trendBoardFile = null
    }
    await store.dispatch('moodboard/updateMoodboardNodeCollection', formData)
    store.dispatch('helper/pushFlashMessage', t('QQ0064'))
    store.dispatch('helper/reloadInnerApp')
  } else {
    await store.dispatch('moodboard/createMoodboardNodeCollection', formData)
    store.dispatch('helper/pushFlashMessage', t('QQ0063'))
  }
  store.dispatch('helper/clearModalPipeline')
}

if (props.mode === CREATE_EDIT.EDIT) {
  const { nodeId, name, description, trendBoardUrl, trendBoardFileName } = await store.dispatch('moodboard/getMoodboardNodeCollectionForModal', { nodeId: props.nodeId })
  Object.assign(formData, { nodeId, name, description, trendBoardFile: trendBoardUrl })
  uploadTrendBoardName.value = trendBoardFileName
}
</script>
