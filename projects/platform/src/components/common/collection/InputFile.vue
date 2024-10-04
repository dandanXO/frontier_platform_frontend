<template lang="pug">
input-file-text(
  v-model:textValue="innerFileName"
  disabled
  :chooseFileTxt="chooseFileTxt"
  @choose:file="chooseFile"
  @clear="onClear"
)
  template(#slot:hint-supporting)
    p(
      class="text-caption leading-1.3"
      :class="invalidFileType ? 'text-red-400' : 'text-grey-600'"
    ) {{ $t('RR0243') }} {{ acceptType.join(', ').toUpperCase() }}
    p(
      class="text-caption leading-1.3 whitespace-nowrap"
      :class="invalidFileSize ? 'text-red-400' : 'text-grey-600'"
    ) {{ $t('RR0145') }} {{ bytesToSize(maximumSize) }}
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  FileOperator,
  UPLOAD_ERROR_CODE,
  bytesToSize,
  getFileExtension,
} from '@frontier/lib'
import InputFileText from './InputFileText.vue'

const props = defineProps({
  fileName: {
    type: String,
  },
  btnText: {
    type: String,
  },
  icon: {
    type: String,
  },
  acceptType: {
    type: Array,
    default: () => ['jpg', 'jpeg', 'png'],
  },
  maximumSize: {
    type: Number,
    default: 20971520,
  },
  multipleFile: {
    type: Boolean,
    default: false,
  },
  chooseFileTxt: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:fileName', 'error', 'finish', 'clear'])
const invalidFileType = ref(false)
const invalidFileSize = ref(false)

const innerFileName = computed({
  get: () => props.fileName,
  set: (v) => {
    emit('update:fileName', v)
    return v
  },
})

const fileOperator = new FileOperator(props.acceptType, props.maximumSize)
const chooseFile = () => fileOperator.upload(props.multipleFile)

const onClear = () => {
  emit('error', undefined)
  invalidFileType.value = false
  invalidFileSize.value = false
  emit('clear')
}

const validateTypeFile = (file) => {
  const isValid = props.acceptType.includes(getFileExtension(file.name))

  emit('error', isValid ? undefined : UPLOAD_ERROR_CODE.INVALID_TYPE)
  invalidFileType.value = !isValid
  innerFileName.value = file.name

  return isValid
}

fileOperator.on('error', (code, { file }) => {
  validateTypeFile(file)
  invalidFileSize.value = code === UPLOAD_ERROR_CODE.EXCEED_LIMIT
  emit('error', code)
})
fileOperator.on('finish', (file) => {
  innerFileName.value = file.name
  invalidFileSize.value = false
  const isValid = validateTypeFile(file)
  isValid && emit('finish', file)
})
</script>
