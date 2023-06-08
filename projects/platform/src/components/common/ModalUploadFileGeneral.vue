<template lang="pug">
modal-behavior(
  :header="$t('EE0087')"
  :primaryBtnText="$t('UU0022')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="disabled"
  @click:primary="upload"
  @click:secondary="closeModal"
)
  template(#note)
    file-upload-error-note(
      v-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
      data-cy="modal-mass-upload_error"
    )
  div(class="w-94")
    f-input-file(
      class="w-full mb-12"
      v-model:fileName="originalFileName"
      :acceptType="acceptType"
      :maximumSize="fileSizeMaxLimit"
      :label="$t('EE0088')"
      :text="$t('UU0025')"
      required
      @finish="onFinish"
      @clear="fileName = ''"
      @error="errorCode = $event"
    )
    f-input-text(
      v-model:textValue="fileName"
      :label="$t('EE0091')"
      :placeholder="$t('EE0092')"
      required
    )
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  uploadHandler: {
    type: Function,
  },
  acceptType: {
    type: Array,
  },
})

const store = useStore()
const fileName = ref('')
const originalFileName = ref('')
const errorCode = ref('')
const disabled = computed(() => !fileName.value || !originalFileName.value)
const fileSizeMaxLimit = computed(
  () =>
    store.getters['organization/organization'].materialAttachmentUploadSizeLimit
)
let binaryFile

const onFinish = (file) => {
  errorCode.value = ''
  binaryFile = file
  fileName.value = file.name
  originalFileName.value = file.name
}

const upload = async () => {
  if (typeof props.uploadHandler === 'function') {
    store.dispatch('helper/pushModalLoading')
    await props.uploadHandler(binaryFile, fileName.value)
    store.dispatch('helper/closeModalLoading')
    closeModal()
  }
}

const closeModal = () => {
  store.dispatch('helper/closeModal')
}
</script>
