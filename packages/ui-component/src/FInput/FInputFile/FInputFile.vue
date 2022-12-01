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
  @clear="$emit('clear')"
)
  template(#slot:hint-supporting)
    p(class="text-caption text-grey-600 leading-1.3 whitespace-nowrap") {{ $t('RR0243') }} {{ acceptType.join(', ').toUpperCase() }}
    p(class="text-caption text-grey-600 leading-1.3 whitespace-nowrap") {{ $t('RR0145') }} {{ maximumSize }} MB
</template>

<script>
export default {
  name: 'FInputFile',
}
</script>

<script setup>
import { computed } from 'vue'
import { FileOperator } from './fileOperator.js'
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
    default: 5,
  },
  multipleFile: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:fileName', 'error', 'finish', 'clear'])

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

fileOperator.on('error', (code) => emit('error', code))
fileOperator.on('finish', (file) => {
  innerFileName.value = file.name
  emit('finish', file)
})
</script>
