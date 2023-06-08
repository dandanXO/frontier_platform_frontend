<template lang="pug">
modal-behavior(
  :header="mode === CREATE_EDIT.EDIT ? $t('FF0009') : $t('FF0022')"
  :primaryBtnText="mode === CREATE_EDIT.EDIT ? $t('UU0018') : $t('UU0020')"
  :primaryBtnDisabled="actionBtnDisabled"
  @click:primary="actionHandler"
)
  template(#note)
    file-upload-error-note(
      v-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
      data-cy="modal-mass-upload_error"
    )
  div(class="w-101")
    p(class="text-right pb-0.5 text-caption text-grey-600") *{{ $t('RR0163') }}
    f-input-text(
      v-model:textValue="formData.collectionName"
      required
      :label="$t('FF0010')"
      class="mb-7.5"
      :rules="[$inputRules.required()]"
      :hintError="isCollectionNameExist ? $t('WW0001') : ''"
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
      :text="$t('UU0025')"
      :acceptType="acceptType"
      :maximumSize="fileSizeMaxLimit"
      @finish="finishUpload"
      @clear="removeTrendBoard"
      @error="errorCode = $event"
    )
    f-input-textarea(
      v-model:textValue="formData.description"
      :label="$t('RR0014')"
      :rules="[(v) => v.length > DESCRIPTION_LIMIT && $t('WW0073')]"
      minHeight="min-h-30"
    )
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { previewFile } from '@/utils/fileOperator'
import { useI18n } from 'vue-i18n'
import { CREATE_EDIT } from '@/utils/constants'

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()

const props = defineProps({
  mode: {
    type: Number,
    default: CREATE_EDIT.CREATE,
  },
  workspaceNodeId: {
    type: [Number, String],
    required: true,
  },
})

const fileSizeMaxLimit = 20 * Math.pow(1024, 2)
const acceptType = ['pdf']
const errorCode = ref('')
const finishUpload = (file) => {
  errorCode.value = ''
  formData.trendBoardFile = file
}

const removeTrendBoard = () => {
  props.mode === CREATE_EDIT.EDIT &&
    store.dispatch('workspace/removeTrendBoard', {
      collectionId: collectionId.value,
    })
}

const uploadTrendBoardName = ref('')
const collectionId = ref(null) // only use when CREATE_EDIT is equal to EDIT
const formData = reactive({
  collectionName: '',
  trendBoardFile: null,
  description: '',
})
const DESCRIPTION_LIMIT = 1000
const isCollectionNameExist = ref(false)
const actionBtnDisabled = computed(
  () =>
    !formData.collectionName || formData.description.length > DESCRIPTION_LIMIT
)

watch(
  () => formData.collectionName,
  () => (isCollectionNameExist.value = false)
)

const actionHandler = async () => {
  if (uploadTrendBoardName.value === '') {
    formData.trendBoardFile = null
  }
  try {
    store.dispatch('helper/pushModalLoading')
    if (props.mode === CREATE_EDIT.EDIT) {
      await store.dispatch('workspace/updateCollection', {
        ...formData,
        collectionId: collectionId.value,
      })
      notify.showNotifySnackbar({ messageText: t('FF0035') })
    } else {
      await store.dispatch('workspace/createCollection', {
        ...formData,
        workspaceNodeId: props.workspaceNodeId,
      })
      notify.showNotifySnackbar({ messageText: t('FF0027') })
    }
    store.dispatch('helper/reloadInnerApp')
    store.dispatch('helper/clearModalPipeline')
  } catch (error) {
    store.dispatch('helper/closeModalLoading')
    const { code } = error
    switch (code) {
      case 'ERR0035':
        isCollectionNameExist.value = true
        break
      default:
        throw error
    }
  }
}

if (props.mode === CREATE_EDIT.EDIT) {
  const {
    collectionId: cId,
    name,
    description,
    trendBoardUrl,
    trendBoardDisplayFileName,
  } = await store.dispatch('workspace/getCollection', {
    workspaceNodeId: props.workspaceNodeId,
  })
  Object.assign(formData, {
    collectionName: name,
    description: description || '',
    trendBoardFile: trendBoardUrl,
  })
  collectionId.value = cId
  uploadTrendBoardName.value = trendBoardDisplayFileName
}
</script>
