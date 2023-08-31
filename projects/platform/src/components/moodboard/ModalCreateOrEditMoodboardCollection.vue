<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.EDIT ? $t('FF0009') : $t('QQ0056')"
  :primaryBtnText="mode === CREATE_EDIT.CREATE ? $t('UU0020') : $t('UU0018')"
  :primaryBtnDisabled="!isFormValid"
  @click:primary="primaryHandler"
)
  template(#note)
    file-upload-error-note(
      v-if="fileUploadErrorCode"
      :errorCode="fileUploadErrorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
    ) 
    div(v-else-if="mode === CREATE_EDIT.CREATE" class="flex items-center text-grey-600")
      f-svg-icon(iconName="info_outline" size="20")
      p(class="text-caption leading-1.6 pl-1.5") {{ $t('QQ0060') }}
  div(class="w-95")
    f-input-text(
      ref="refInputCollectionName"
      v-model:textValue="formData.name"
      required
      :rules="[$inputRules.required(), $inputRules.maxLength(COLLECTION_NAME_MAX_LENGTH)]"
      :label="$t('FF0010')"
      :placeholder="$t('QQ0058')"
      class="pb-6"
    )
    div(class="h-5.5 flex items-center pb-1")
      p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0249') }}
      f-button-label(
        v-if="uploadTrendBoardName"
        size="sm"
        class="ml-1.5"
        @click="previewFile(formData.trendBoardFile)"
      ) {{ $t('UU0060') }}
    f-input-file(
      class="w-full mb-15"
      v-model:fileName="uploadTrendBoardName"
      :acceptType="trendBoardFileAcceptType"
      :maximumSize="fileSizeMaxLimit"
      :text="$t('UU0025')"
      :placeholder="$t('QQ0009')"
      @finish="onFinish"
      @clear="removeTrendBoard"
      @error="fileUploadErrorCode = $event"
    )
    f-input-textarea(
      ref="refInputDescription"
      v-model:textValue="formData.description"
      :label="$t('RR0014')"
      :placeholder="$t('QQ0059')"
      minHeight="min-h-30"
      :rules="[$inputRules.maxLength(COLLECTION_DESCRIPTION_MAX_LENGTH, $t('WW0073'))]"
    )
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import { previewFile } from '@frontier/lib'
import {
  CREATE_EDIT,
  COLLECTION_NAME_MAX_LENGTH,
  COLLECTION_DESCRIPTION_MAX_LENGTH,
} from '@/utils/constants'

const props = defineProps({
  mode: {
    type: Number,
    default: CREATE_EDIT.CREATE,
  },
  nodeId: {
    // if is create mode then nodeId is refer to parent nodeId, otherwise is refer to that node collection
    type: Number,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const formData = reactive({
  nodeId: props.nodeId,
  name: '',
  description: '',
  trendBoardFile: null,
  // the below variables only use for edit mode
  isDeleteTrendBoard: false,
})

const refInputCollectionName = ref(null)
const refInputDescription = ref(null)

const isUploadNewTrendBoard = ref(false)
const uploadTrendBoardName = ref('')

const fileSizeMaxLimit = 20 * Math.pow(1024, 2)
const trendBoardFileAcceptType = ['pdf']
const fileUploadErrorCode = ref(0)

const onFinish = (file) => {
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

const isFormValid = computed(
  () =>
    formData.name?.length > 0 &&
    !refInputCollectionName.value?.isError &&
    !refInputDescription.value?.isError
)

const primaryHandler = async () => {
  store.dispatch('helper/pushModalLoading')
  if (props.mode === CREATE_EDIT.EDIT) {
    if (!isUploadNewTrendBoard.value) {
      formData.trendBoardFile = null
    }
    await store.dispatch('moodboard/updateMoodboardNodeCollection', formData)
    notify.showNotifySnackbar({ messageText: t('QQ0064') })
    store.dispatch('helper/reloadInnerApp')
  } else {
    await store.dispatch('moodboard/createMoodboardNodeCollection', formData)
    notify.showNotifySnackbar({ messageText: t('QQ0063') })
  }
  store.dispatch('helper/clearModalPipeline')
}

if (props.mode === CREATE_EDIT.EDIT) {
  const { nodeId, name, description, trendBoardUrl, trendBoardFileName } =
    await store.dispatch('moodboard/getMoodboardNodeCollectionForModal', {
      nodeId: props.nodeId,
    })
  Object.assign(formData, {
    nodeId,
    name,
    description,
    trendBoardFile: trendBoardUrl,
  })
  uploadTrendBoardName.value = trendBoardFileName
}
</script>
