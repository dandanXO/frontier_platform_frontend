<template lang="pug">
div(class="w-101 px-8")
  h6(class="text-h6 font-bold text-primary text-center mb-7.5") {{$t('FF0022')}}
  input-text(
    v-model:textValue="formData.collectionName"
    required
    :label="$t('FF0010')"
    class="mb-7.5"
    :customErrorMsg="errorMsg"
  )
  div(class="mb-9")
    div
      div(class="h-5.5 flex items-center pb-1")
        p(class="text-body2 text-primary font-bold") {{$t('FF0011')}}
        btn-functional(v-if="uploadTrendBoardName" size="sm" class="ml-1.5" @click="previewPdf") {{$t('UU0060')}}
      input-text-btn(
        class="w-full"
        disabledInput
        v-model:textValue="uploadTrendBoardName"
        :buttonLabel="$t('UU0025')"
        @click:button="chooseFile"
      )
    p(class='text-primary text-caption line-height-1.6') {{$t('FF0014')}}
    p(class='text-primary text-caption line-height-1.6') {{$t('FF0015')}}
  input-textarea(
    v-model:textValue="formData.description"
    :label="$t('FF0012')"
    height="120"
  )
  btn-group(
    class="h-25"
    :primaryText="$t('UU0020')"
    :primaryButtonDisabled="actionBtnDisabled"
    @click:primary="createCollection"
    :secondaryButton="false"
  )
</template>

<script>
import { ref, reactive, computed, watch, inject } from 'vue'
import { useStore } from 'vuex'
import { FileOperator } from '@/utils/fileOperator'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalCreateCollection',
  props: {
    workspaceNodeId: {
      type: [Number, String],
      required: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const reloadRootRoute = inject('reloadRootRoute')
    const fileOperator = new FileOperator(['pdf'], 20)

    const uploadTrendBoardName = ref('')
    const errorMsg = ref('')
    const formData = reactive({
      workspaceNodeId: props.workspaceNodeId,
      collectionName: '',
      trendBoard: null,
      description: ''
    })

    const actionBtnDisabled = computed(() => !!errorMsg.value || !formData.collectionName)

    fileOperator.on('finish', (file) => {
      formData.trendBoard = file
      uploadTrendBoardName.value = file.name
    })

    fileOperator.on('error', (errorCode) => {
      const ERROR_CODE = fileOperator.errorCode
      switch (errorCode) {
        case ERROR_CODE.INVALID_TYPE:
          store.dispatch('helper/pushModalConfirm', {
            title: t('FF0024'),
            content: t('FF0025'),
            primaryText: t('UU0031')
          })
          break
        case ERROR_CODE.EXCEED_LIMIT:
          store.dispatch('helper/pushModalConfirm', {
            title: t('FF0024'),
            content: t('FF0026'),
            primaryText: t('UU0031')
          })
          break
      }
    })

    const chooseFile = () => {
      fileOperator.upload()
    }

    const previewPdf = () => {
      const a = document.createElement('A')
      a.hidden = true
      a.target = '_blank'
      a.href = URL.createObjectURL(formData.trendBoard)
      a.click()
      a.remove()
    }

    const createCollection = async () => {
      if (uploadTrendBoardName.value === '') {
        formData.trendBoard = null
      }
      try {
        store.dispatch('helper/pushModalLoading')
        await store.dispatch('workspace/createCollection', formData)
        store.dispatch('helper/clearModalPipeline')
        reloadRootRoute()
      } catch (error) {
        store.dispatch('helper/closeModalLoading')
        errorMsg.value = error
      }
    }

    watch(
      () => formData.collectionName,
      () => (errorMsg.value = '')
    )

    return {
      formData,
      createCollection,
      chooseFile,
      uploadTrendBoardName,
      previewPdf,
      actionBtnDisabled,
      errorMsg
    }
  }
}
</script>
