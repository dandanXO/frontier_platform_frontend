<template lang="pug">
f-input-text(
  v-model:textValue="innerFileName"
  disabled
  :placeholder="placeholder"
  :size="size"
  :label="label"
  :required="required"
  :button="buttonOption"
  @click:button="chooseFile"
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

<script>
export default {
  name: 'FInputFile',
}
</script>

<script setup>
import { computed, ref } from 'vue'
import {
  EXTENSION,
  FileOperator,
  UPLOAD_ERROR_CODE,
  bytesToSize,
  getFileExtension,
} from '@frontier/lib'

const props = defineProps({
  /**
   * inherit from `FInputText.vue`
   */
  placeholder: {
    type: String,
    default: '',
  },
  /**
   * inherit from `FInputText.vue`
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * inherit from `FInputText.vue`
   *
   * only work when `label` has been set
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * inherit from `FInputText.vue`
   */
  size: {
    type: String,
    default: 'lg',
  },
  fileName: {
    type: String,
  },
  text: {
    type: String,
  },
  icon: {
    type: String,
  },
  type: {
    type: String,
    default: 'primary', // or secondary
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
})
const emit = defineEmits(['update:fileName', 'error', 'finish', 'clear'])
const invalidFileType = ref(false)
const invalidFileSize = ref(false)

const buttonOption = computed(() => ({
  type: props.type,
  icon: props.icon,
  text: props.text,
  isFile: true,
}))

const innerFileName = computed({
  get: () => props.fileName,
  set: (v) => emit('update:fileName', v),
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
