<template lang="pug">
div(
  class="flex flex-col items-center justify-center gap-4 px-10 py-11 rounded-lg border-dashed border border-brand-solid bg-brand hover:bg-brand-hover cursor-pointer"
  @click="chooseFile"
  @drop.stop.prevent="onDrop($event)"
  @dragover.prevent
  @dragenter.prevent
)
  f-svg-icon(iconName="upload" size="42" class="text-brand-solid")
  p(class="text-base text-primary-inverse") {{ $t('RR0484') }}
  f-button(size="md" type="secondary") {{ $t('DD0038') }}
ul(class="list-disc pl-5 text-sm font-normal")
  li {{ $t('RR0145') }} {{ bytesToSize(fileSizeMaxLimit) }}
  li {{ $t('WW0144') }} {{ MIN_DIMENSION_IMAGE }} x {{ MIN_DIMENSION_IMAGE }} px
  li {{ $t('RR0488') }}
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { bytesToSize, FileOperator } from '@frontier/lib'
import { Extension } from '@frontier/platform-web-sdk'
import { TYPE as ALERT_TYPE } from '@frontier/ui-component/src/FNotify/FAlert/FAlert.vue'
import useModalCommon from '@/composables/useModalCommon'
import { readImageFile } from '@/utils/readImageFile'

interface Props {
  onFinish: (file: File) => void
}
const props = defineProps<Props>()

const ACCEPT_TYPES: Extension[] = [Extension.JPG, Extension.PNG, Extension.JPEG]
const MIN_DIMENSION_IMAGE = 400
const { t } = useI18n()
const fileName = ref('')
const binaryFile = ref<File>()
const fileSizeMaxLimit = 10 * 1024 * 1024 // 10MB

const fileOperator = new FileOperator(ACCEPT_TYPES, fileSizeMaxLimit)

const chooseFile = () => fileOperator.upload(false)
const { showAlert } = useModalCommon()

async function validateImage(file: File) {
  const imageInfo = await readImageFile(file)

  if (
    imageInfo.width < MIN_DIMENSION_IMAGE ||
    imageInfo.height < MIN_DIMENSION_IMAGE
  ) {
    throw new Error('Invalid image dimension')
  }

  if (
    !ACCEPT_TYPES.some((type) =>
      imageInfo.type.toLowerCase().includes(type.toLowerCase())
    )
  ) {
    throw new Error('Invalid image type')
  }
}

fileOperator.on('error', () => {
  showAlert({
    title: t('WW0209'),
    type: ALERT_TYPE.ERROR,
  })
})

fileOperator.on('finish', async (file: File) => {
  try {
    binaryFile.value = file
    fileName.value = file.name
    await validateImage(file)
    props.onFinish(file)
  } catch (error) {
    console.error(error)
    showAlert({
      title: t('WW0209'),
      type: ALERT_TYPE.ERROR,
    })
  }
})

const onDrop = (evt: DragEvent) => {
  fileOperator.onDrop(evt)
}
</script>
