<template lang="pug">
modal-behavior(
  :header="mode === MODE.EDIT ? $t('FF0009') : $t('FF0022')"
  :primaryBtnText="mode === MODE.EDIT ? $t('UU0018') : $t('UU0020')"
  :primaryBtnDisabled="actionBtnDisabled"
  @click:primary="actionHandler"
)
  div(class="w-101")
    p(class="text-right pb-0.5 text-caption text-black-600") *{{ $t('RR0163') }}
    f-input-text(
      v-model:textValue="formData.collectionName"
      required
      :label="$t('FF0010')"
      class="mb-7.5"
      :rules="[$inputRules.required()]"
    )
    div(class="mb-9")
      div
        div(class="h-5.5 flex items-center pb-1")
          p(class="text-body2 text-primary font-bold") {{ $t('RR0249') }}
          f-button-label(v-if="uploadTrendBoardName" size="sm" class="ml-1.5" @click="previewFile(formData.trendBoardFile)") {{ $t('UU0060') }}
        f-input-text-button(
          class="w-full"
          disabledInput
          v-model:textValue="uploadTrendBoardName"
          :buttonLabel="$t('UU0025')"
          @click:button="chooseFile"
          @clear="removeTrendBoard"
        )
      p(class='text-primary text-caption leading-1.6') {{ $t("RR0243") }} {{ acceptType.join(', ').toUpperCase() }}
      p(class='text-primary text-caption leading-1.6') {{ $t("RR0145") }} {{ fileSizeMaxLimit }} MB
    f-input-textarea(
      v-model:textValue="formData.description"
      :label="$t('RR0014')"
      height="120"
      :customErrorMsg="formData.description.length > DESCRIPTION_LIMIT ? $t('WW0073') : ''"
    )
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { FileOperator, previewFile } from '@/utils/fileOperator'
import { useI18n } from 'vue-i18n'

const MODE = {
  CREATE: 1,
  EDIT: 2
}

export default {
  name: 'ModalCreateOrEditCollection',
  props: {
    mode: {
      type: Number,
      default: MODE.CREATE
    },
    workspaceNodeId: {
      type: [Number, String],
      required: true
    }
  },
  async setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const fileSizeMaxLimit = 20
    const acceptType = ['pdf']
    const fileOperator = new FileOperator(acceptType, fileSizeMaxLimit)

    const uploadTrendBoardName = ref('')
    const collectionId = ref(null) // only use when MODE is equal to EDIT
    const formData = reactive({
      collectionName: '',
      trendBoardFile: null,
      description: ''
    })
    const DESCRIPTION_LIMIT = 1000

    const actionBtnDisabled = computed(() => !formData.collectionName || formData.description.length > DESCRIPTION_LIMIT)

    fileOperator.on('finish', (file) => {
      formData.trendBoardFile = file
      uploadTrendBoardName.value = file.name
    })

    const chooseFile = () => {
      fileOperator.upload()
    }

    const actionHandler = async () => {
      if (uploadTrendBoardName.value === '') {
        formData.trendBoardFile = null
      }
      store.dispatch('helper/pushModalLoading')
      if (props.mode === MODE.EDIT) {
        await store.dispatch('workspace/updateCollection', {
          collectionId: collectionId.value,
          ...formData
        })
        store.dispatch('helper/pushFlashMessage', t('FF0035'))
      } else {
        await store.dispatch('workspace/createCollection', {
          workspaceNodeId: props.workspaceNodeId,
          ...formData
        })
        store.dispatch('helper/pushFlashMessage', t('FF0027'))
      }
      store.dispatch('helper/clearModalPipeline')
      store.dispatch('helper/reloadInnerApp')
    }

    const removeTrendBoard = () => {
      props.mode === MODE.EDIT && store.dispatch('workspace/removeTrendBoard', { collectionId: collectionId.value })
    }

    if (props.mode === MODE.EDIT) {
      const { collectionId: cId, name, description, trendBoardUrl, trendBoardDisplayFileName } = await store.dispatch('workspace/getCollection', { workspaceNodeId: props.workspaceNodeId })
      Object.assign(formData, {
        collectionName: name,
        description: description || '',
        trendBoardFile: trendBoardUrl
      })
      collectionId.value = cId
      uploadTrendBoardName.value = trendBoardDisplayFileName
    }

    return {
      formData,
      actionHandler,
      acceptType,
      fileSizeMaxLimit,
      chooseFile,
      uploadTrendBoardName,
      previewFile,
      actionBtnDisabled,
      MODE,
      removeTrendBoard,
      DESCRIPTION_LIMIT
    }
  }
}
</script>
