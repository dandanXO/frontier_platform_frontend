<template lang="pug">
modal-behavior(
  :header="$t('MM0006')"
  :primaryBtnText="$t('UU0049')"
  :primaryBtnDisabled="actionBtnDisabled"
  @click:primary="actionHandler"
  :textBtnText="$t('UU0026')"
  @click:text="$store.dispatch('helper/closeModalBehavior')"
)
  template(#note)
    file-upload-error-note(v-if="errorCode" :errorCode="errorCode" :fileSizeMaxLimit="fileSizeMaxLimit")
  div(class="w-94")
    f-input-select(
      v-model:selectValue="formData.category"
      :optionList="feedbackOptionList"
      keyOptionDisplay="text"
      keyOptionValue="value"
      :label="$t('MM0007')"
      :placeholder="$t('MM0008')"
      class="pb-5"
      required
    )
    f-input-textarea(
      v-model:textValue="formData.comment"
      :label="$t('MM0009')"
      required
      height="120"
      class="pb-2"
      :rules="[$inputRules.required()]"
    )
    f-scrollbar-container(v-if="feedbackAttachmentList.length > 0" class="max-h-18 mb-2.5")
      div(class="grid gap-y-2")
        div(v-for="attachment in feedbackAttachmentList" class="h-8 flex justify-between items-center px-4 bg-black-100")
          div(class="flex items-center gap-x-1")
            p(class="text-body2 font-bold text-primary line-clamp-1") {{ attachment.fileName }}
            p(class="text-body2 font-normal text-primary flex-shrink-0") ({{ bytesToSize(attachment.fileSize) }})
          f-svg-icon(iconName="clear" size="14" class="text-primary ml-1 cursor-pointer" @click="removeAttachment(attachment.tempFeedbackAttachmentId)")
    f-button(size="sm" type="secondary" prependIcon="add" @click="chooseFile") {{ $t("UU0063") }}
    div(class="text-caption text-primary pt-1")
      p(class="pb-2") {{ $t("RR0243") }} {{ acceptType.join(', ').toUpperCase() }}
      p {{ $t("RR0145") }} {{ fileSizeMaxLimit }} MB
</template>

<script setup>
import { FEEDBACK_CATEGORY } from '@/utils/constants.js'
import { ref, reactive, computed } from 'vue'
import { FileOperator, bytesToSize } from '@/utils/fileOperator'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

const { t } = useI18n()
const store = useStore()
const tempFeedbackId = uuidv4()
const feedbackOptionList = Object.keys(FEEDBACK_CATEGORY).map((category) => ({
  text: FEEDBACK_CATEGORY[category].text,
  value: FEEDBACK_CATEGORY[category].value
}))
const formData = reactive({
  category: null,
  comment: ''
})
const feedbackAttachmentList = ref([])
const errorCode = ref('')

const actionBtnDisabled = computed(() => !formData.category || !formData.comment)

const fileSizeMaxLimit = 20
const acceptType = ['jpg', 'jpeg', 'png', 'mp4']
const fileOperator = new FileOperator(acceptType, fileSizeMaxLimit)

fileOperator.on('error', (code) => {
  errorCode.value = code
})

fileOperator.on('finish', async (file) => {
  errorCode.value = ''
  store.dispatch('helper/pushModalLoading')
  feedbackAttachmentList.value = await store.dispatch('user/sendFeedbackAttachment', { tempFeedbackId, file })
  store.dispatch('helper/closeModalLoading')
})

const chooseFile = () => fileOperator.upload()

const removeAttachment = (tempFeedbackAttachmentId) => {
  feedbackAttachmentList.value = feedbackAttachmentList.value.filter((attachment) => attachment.tempFeedbackAttachmentId !== tempFeedbackAttachmentId)
  store.dispatch('user/removeFeedbackAttachment', { tempFeedbackId, tempFeedbackAttachmentId })
}

const actionHandler = () => {
  store.dispatch('user/sendFeedback', { tempFeedbackId, ...formData })
  store.dispatch('helper/closeModal')
  store.dispatch('helper/pushFlashMessage', t('MM0018'))
}
</script>
