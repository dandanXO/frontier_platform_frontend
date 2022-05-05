<template lang="pug">
div(class="w-101 px-8")
  h6(class="text-h6 font-bold text-primary text-center") {{ mode === MODE.EDIT ? $t('FF0009') : $t('FF0022') }}
  p(class="text-right pt-4 pb-0.5 text-caption text-black-600") *{{ $t('RR0163') }}
  input-text(
    v-model:textValue="formData.collectionName"
    required
    :label="$t('FF0010')"
    class="mb-7.5"
  )
  div(class="mb-9")
    div
      div(class="h-5.5 flex items-center pb-1")
        p(class="text-body2 text-primary font-bold") {{ $t('FF0011') }}
        btn-functional(v-if="uploadTrendBoardName" size="sm" class="ml-1.5" @click="previewPdf") {{ $t('UU0060') }}
      input-text-btn(
        class="w-full"
        disabledInput
        v-model:textValue="uploadTrendBoardName"
        :buttonLabel="$t('UU0025')"
        @click:button="chooseFile"
        @clear="removeTrendBoard"
      )
    p(class='text-primary text-caption leading-1.6') {{ $t('FF0014') }}
    p(class='text-primary text-caption leading-1.6') {{ $t('FF0015') }}
  input-textarea(
    v-model:textValue="formData.description"
    :label="$t('FF0012')"
    height="120"
    :customErrorMsg="formData.description.length > DESCRIPTION_LIMIT ? $t('WW0073') : ''"
  )
  btn-group(
    class="h-25"
    :primaryText="mode === MODE.EDIT ? $t('UU0018') : $t('UU0020')"
    :primaryButtonDisabled="actionBtnDisabled"
    @click:primary="actionHandler"
    :secondaryButton="false"
  )
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { FileOperator } from '@/utils/fileOperator'
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
    const fileOperator = new FileOperator(['pdf'], 20)

    const uploadTrendBoardName = ref('')
    const collectionId = ref(null) // only use when MODE is equal to EDIT
    const formData = reactive({
      collectionName: '',
      trendBoard: null,
      description: ''
    })
    const DESCRIPTION_LIMIT = 1000

    const actionBtnDisabled = computed(() => !formData.collectionName || formData.description.length > DESCRIPTION_LIMIT)

    fileOperator.on('finish', (file) => {
      formData.trendBoard = file
      uploadTrendBoardName.value = file.name
    })

    const chooseFile = () => {
      fileOperator.upload()
    }

    const previewPdf = () => {
      const a = document.createElement('A')
      a.hidden = true
      a.target = '_blank'
      // A File object is a Blob object with a name attribute, which is a string
      a.href = typeof formData.trendBoard.name === 'string' ? URL.createObjectURL(formData.trendBoard) : formData.trendBoard
      a.click()
      a.remove()
    }

    const actionHandler = async () => {
      if (uploadTrendBoardName.value === '') {
        formData.trendBoard = null
      }
      store.dispatch('helper/pushModalLoading')
      if (props.mode === MODE.EDIT) {
        await store.dispatch('workspace/updateCollection', {
          collectionId: collectionId.value,
          ...formData
        })
        store.commit('helper/PUSH_message', t('FF0035'))
      } else {
        await store.dispatch('workspace/createCollection', {
          workspaceNodeId: props.workspaceNodeId,
          ...formData
        })
        store.commit('helper/PUSH_message', t('FF0027'))
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
        trendBoard: trendBoardUrl
      })
      collectionId.value = cId
      uploadTrendBoardName.value = trendBoardDisplayFileName
    }

    return {
      formData,
      actionHandler,
      chooseFile,
      uploadTrendBoardName,
      previewPdf,
      actionBtnDisabled,
      MODE,
      removeTrendBoard,
      DESCRIPTION_LIMIT
    }
  }
}
</script>
