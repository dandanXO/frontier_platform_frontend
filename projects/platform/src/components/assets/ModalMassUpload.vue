<template lang="pug">
modal-behavior(
  :header="$t('DD0035')"
  :primaryBtnText="$t('UU0022')"
  :primaryBtnDisabled="disabledUpload"
  @click:primary="handleUpload"
)
  template(#note)
    div(
      v-if="showErrorList"
      class="text-caption text-red-400 flex items-center"
      data-cy="modal-mass-upload_failed"
    )
      f-svg-icon(iconName="warning_amber_round" size="14" class="mr-1.5")
      span(class="pr-0.5") {{ $t('WW0037') }}
    file-upload-error-note(
      v-else-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
      data-cy="modal-mass-upload_error"
    )
  div(class="w-94")
    f-input-file(
      class="w-full mb-12"
      :label="$t('DD0038')"
      :acceptType="[Extension.XLSX]"
      :maximumSize="fileSizeMaxLimit"
      :text="$t('UU0025')"
      :fileName="fileName"
      @finish="onFinish"
      @update:fileName="fileName = $event"
      @error="errorCode = $event"
    )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useNotifyStore } from '@/stores/notify'
import { UPLOAD_ERROR_CODE, useConstants } from '@/utils/constants'
import { Extension } from '@frontier/platform-web-sdk'
import { v4 as uuidv4 } from 'uuid'

const { FEEDBACK_CATEGORY } = useConstants()
const store = useStore()
const notify = useNotifyStore()
const { t } = useI18n()
const errorCode = ref<UPLOAD_ERROR_CODE>()
const showErrorList = ref(false)
const disabledUpload = computed(
  () =>
    !uploadedFile.value || showErrorList.value || errorCode.value !== undefined
)
const uploadedFile = ref<File>()

const fileName = ref('')
const fileSizeMaxLimit = 20 * Math.pow(1024, 2)

const onFinish = (file: File) => {
  uploadedFile.value = file
  errorCode.value = undefined
  showErrorList.value = false
}

const tempFeedbackId = uuidv4()
const feedbackAttachmentList = ref([])

const handleUpload = async () => {
  if (!uploadedFile.value) {
    return
  }

  store.dispatch('helper/pushModalLoading')
  feedbackAttachmentList.value = await store.dispatch(
    'user/sendFeedbackAttachment',
    { tempFeedbackId, file: uploadedFile.value }
  )
  await store.dispatch('user/sendFeedback', {
    tempFeedbackId,
    category: FEEDBACK_CATEGORY.value.OTHER.value,
    comment: 'Textpert Mass Upload',
  })
  store.dispatch('helper/clearModalPipeline')
  notify.showNotifySnackbar({ messageText: t('OO0050') })
}
</script>
