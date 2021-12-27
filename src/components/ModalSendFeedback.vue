<template lang="pug">
div(class="w-101 px-8")
  h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{$t('MM0006')}}
  input-select(
    v-model:selectValue="formData.category"
    :options="feedbackOptionList"
    keyOptionDisplay="text"
    keyOptionValue="value"
    :label="$t('MM0007')"
    :placeholder="$t('MM0008')"
    class="pb-7.5 relative z-10"
    required
  )
  input-textarea(
    v-model:textValue="formData.comment"
    :label="$t('MM0009')"
    required
    height="120"
    class="pb-6"
  )
  overlay-scrollbar-container(v-if="feedbackAttachmentList.length > 0" class="max-h-18 mb-2.5")
    div(class="grid gap-y-2")
      div(v-for="attachment in feedbackAttachmentList" class="h-8 flex justify-between items-center px-4 bg-black-100")
        div(class="flex items-center gap-x-1")
          p(class="text-body2 font-bold text-primary line-clamp-1 max") {{attachment.fileName}}
          p(class="text-body2 font-normal text-primary flex-shrink-0") ({{bytesToSize(attachment.fileSize)}})
        svg-icon(iconName="clear" size="14" class="text-primary ml-1 cursor-pointer" @click="removeAttachment(attachment.tempFeedbackAttachmentId)")
  btn(size="sm" type="secondary" prependIcon="add" @click="chooseFile") {{$t('UU0063')}}
  div(class="text-caption text-primary pt-1")
    p(class="pb-2") {{$t('MM0015')}}
    p {{$t('MM0016')}}
  btn-group(
    class="h-25"
    :primaryText="$t('UU0049')"
    :primaryButtonDisabled="actionBtnDisabled"
    @click:primary="actionHandler"
    :secondaryButton="false"
  )
</template>

<script>
import { FEEDBACK_CATEGORY } from '@/utils/constants.js'
import { ref, reactive, computed } from 'vue'
import { FileOperator } from '@/utils/fileOperator'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'ModalSendFeedback',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const tempFeedbackId = uuidv4()
    const feedbackOptionList = Object.keys(FEEDBACK_CATEGORY).map(category => ({
      text: FEEDBACK_CATEGORY[category].text,
      value: FEEDBACK_CATEGORY[category].value
    }))
    const formData = reactive({
      category: null,
      comment: ''
    })
    const feedbackAttachmentList = ref([])

    const actionBtnDisabled = computed(() => !formData.category || !formData.comment)

    const fileOperator = new FileOperator(['jpg', 'jpeg', 'png', 'mp4'], 6)

    fileOperator.on('finish', async (file) => {
      store.dispatch('helper/pushModalLoading')
      feedbackAttachmentList.value = await store.dispatch('user/sendFeedbackAttachment', { tempFeedbackId, file })
      store.dispatch('helper/closeModalLoading')
    })

    fileOperator.on('error', (errorCode) => {
      const ERROR_CODE = fileOperator.errorCode
      switch (errorCode) {
        case ERROR_CODE.INVALID_TYPE:
          store.dispatch('helper/pushModalConfirm', {
            title: t('MM0017'),
            content: t('MM0031'),
            primaryText: t('UU0031')
          })
          break
        case ERROR_CODE.EXCEED_LIMIT:
          store.dispatch('helper/pushModalConfirm', {
            title: t('MM0017'),
            content: t('MM0031'),
            primaryText: t('UU0031')
          })
          break
      }
    })

    const chooseFile = () => (fileOperator.upload())

    const removeAttachment = (tempFeedbackAttachmentId) => {
      feedbackAttachmentList.value = feedbackAttachmentList.value.filter(attachment => attachment.tempFeedbackAttachmentId !== tempFeedbackAttachmentId)
      store.dispatch('user/removeFeedbackAttachment', { tempFeedbackId, tempFeedbackAttachmentId })
    }

    const actionHandler = () => {
      store.dispatch('user/sendFeedback', { tempFeedbackId, ...formData })
      store.dispatch('helper/closeModal')
      store.commit('helper/PUSH_message', t('MM0018'))
    }

    const bytesToSize = (bytes) => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    }

    return {
      formData,
      feedbackOptionList,
      actionHandler,
      feedbackAttachmentList,
      actionBtnDisabled,
      chooseFile,
      bytesToSize,
      removeAttachment
    }
  }
}
</script>
