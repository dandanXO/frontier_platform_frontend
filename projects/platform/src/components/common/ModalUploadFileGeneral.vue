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
    file-upload-error-note(v-if="errorCode" :errorCode="errorCode" :fileSizeMaxLimit="fileSizeMaxLimit" data-cy="modal-mass-upload_error")
  div(class="w-94")
    p(class="text-caption text-black-600 text-right mb-1.5") 
      span(class="text-warn") *
      span {{ $t("RR0163") }}
    div(class="mb-7.5")
      f-input-text-button(
        class="w-full"
        :label="$t('EE0088')"
        :textValue="originalFileName"
        :clearable="false"
        :buttonLabel="$t('UU0025')"
        @click:button="chooseFile"
        disabledInput
        required
      )
      p(class="text-primary text-caption leading-1.6") {{ $t("RR0243") }} {{ acceptType.join(', ').toUpperCase() }}
      p(class="text-primary text-caption leading-1.6") {{ $t("RR0145") }} {{ fileSizeMaxLimit }} MB
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
import { FileOperator } from '@/utils/fileOperator'

const props = defineProps({
  uploadHandler: {
    type: Function
  },
  acceptType: {
    type: Array
  }
})

const store = useStore()
const fileName = ref('')
const originalFileName = ref('')
const errorCode = ref('')
const disabled = computed(() => !fileName.value || !originalFileName.value)
const fileSizeMaxLimit = 20
const fileOperator = new FileOperator(props.acceptType, fileSizeMaxLimit)
let binaryFile

const chooseFile = () => {
  fileOperator.upload()
}

fileOperator.on('error', (code) => {
  errorCode.value = code
})

fileOperator.on('finish', (file) => {
  errorCode.value = ''
  binaryFile = file
  fileName.value = file.name
  originalFileName.value = file.name
})

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
