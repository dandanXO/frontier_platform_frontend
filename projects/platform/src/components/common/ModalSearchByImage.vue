<template lang="pug">
div(
  class="flex flex-col items-center justify-center gap-4 bg-brand px-10 py-11 rounded-lg border-dashed border border-brand-solid"
)
  f-svg-icon(iconName="upload" size="42" class="text-brand-solid")
  p(class="text-base text-primary-inverse") {{ $t('RR0484') }}
  f-button(size="md" type="secondary" @click="chooseFile") {{ $t('DD0038') }}
ul(class="list-disc pl-5")
  li {{ $t('RR0145') }} {{ bytesToSize(fileSizeMaxLimit) }}
  li {{ $t('RR0485') }} {{ acceptTypes.join(', ') }}
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { bytesToSize, FileOperator } from '@frontier/lib'
import { Extension } from '@frontier/platform-web-sdk'

interface Props {
  title: string
  description: string
  primaryBtnText: string
  secondaryBtnText: string
  primaryBtnHandler: VoidFunction
  secondaryBtnHandler: VoidFunction
}
defineProps<Props>()

const acceptTypes: Extension[] = [Extension.JPG, Extension.PNG, Extension.JPEG]
const fileName = ref('')
const binaryFile = ref<File>()
const fileSizeMaxLimit = 10 * 1024 * 1024 // 10MB
const fileOperator = new FileOperator(acceptTypes, fileSizeMaxLimit)

const chooseFile = () => fileOperator.upload(false)

fileOperator.on('finish', (file: File) => {
  binaryFile.value = file
  fileName.value = file.name
})
</script>
