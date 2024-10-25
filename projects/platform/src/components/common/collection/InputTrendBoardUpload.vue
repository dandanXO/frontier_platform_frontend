<template lang="pug">
div
  div(class="h-5.5 flex items-center pb-1")
    p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0249') }}
    f-button-label(
      v-if="trendBoard"
      size="sm"
      class="ml-1.5"
      @click="previewFile(trendBoard)"
    ) {{ $t('UU0060') }}
  input-file(
    class="w-full pb-9"
    v-model:fileName="fileName"
    :acceptType="acceptType"
    :maximumSize="fileSizeMaxLimit"
    data-cy="add-banner-image"
    :chooseFileTxt="$t('QQ0091')"
    @finish="uploadedFromLocale"
    @clear="removeTrendBoard"
    @error="errorCode = $event"
  )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { previewFile } from '@frontier/lib'
import type { UPLOAD_ERROR_CODE } from '@frontier/constants'
import { defineExpose } from 'vue'
import { uploadFileToS3 } from '@/utils/fileUpload'
import { type TrendBoard, Extension } from '@frontier/platform-web-sdk'
import InputFile from './InputFile.vue'

const props = defineProps<{
  defaultTrendBoard?: TrendBoard | null
}>()

const isDeleteTrendBoard = ref(false)

const acceptType = [Extension.PDF]
const errorCode = ref<UPLOAD_ERROR_CODE | null>(null)
const fileSizeMaxLimit = 20 * Math.pow(1024, 2)

const fileName = ref(props.defaultTrendBoard?.displayName)
const trendBoard = ref<File | string | null>(
  props.defaultTrendBoard ? props.defaultTrendBoard.originalUrl : null
)

const uploadedFromLocale = (file: File) => {
  errorCode.value = null
  trendBoard.value = file
  isDeleteTrendBoard.value = false
}
const removeTrendBoard = () => {
  isDeleteTrendBoard.value = true
  trendBoard.value = null
}

const getTrendBoardS3Object = async () => {
  if (typeof trendBoard.value === 'object' && trendBoard.value !== null) {
    const { s3UploadId, fileName } = await uploadFileToS3(
      trendBoard.value,
      trendBoard.value.name
    )
    return {
      s3UploadId,
      fileName,
    }
  } else {
    return null
  }
}

defineExpose({
  fileSizeMaxLimit,
  acceptType,
  errorCode,
  isDeleteTrendBoard,
  getTrendBoardS3Object,
})
</script>
