<template lang="pug">
div(class="flex flex-col gap-2")
  div(class="h-5.5 flex items-center pb-1 gap-1.5")
    p(class="text-body2 text-grey-900 font-bold") {{ $t('RR0382') }}
    f-button-label(
      v-if="coverImage"
      size="sm"
      @click="previewFile(coverImage)"
    ) {{ $t('UU0060') }}
  input-file(
    class="w-full pb-9"
    v-model:fileName="fileName"
    :acceptType="acceptType"
    :maximumSize="fileSizeMaxLimit"
    :chooseFileTxt="$t('UU0156')"
    data-cy="add-cover-image"
    @finish="uploadedFromLocale"
    @clear="removeCoverImage"
    @error="errorCode = $event"
  )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { previewFile } from '@frontier/lib'
import type { UPLOAD_ERROR_CODE } from '@frontier/constants'
import { defineExpose } from 'vue'
import { uploadFileToS3 } from '@/utils/fileUpload'
import { Extension, type CollectionCoverImg } from '@frontier/platform-web-sdk'
import InputFile from './InputFile.vue'
const props = defineProps<{
  defaultCoverImage?: CollectionCoverImg | null
}>()

const isDeleteCoverImage = ref(false)

const acceptType = [Extension.JPG, Extension.JPEG, Extension.PNG]
const errorCode = ref<UPLOAD_ERROR_CODE | null>(null)
const fileSizeMaxLimit = 20 * Math.pow(1024, 2)

const fileName = ref(props.defaultCoverImage?.displayName)
const coverImage = ref<File | string | null>(
  props.defaultCoverImage?.originalUrl
    ? props.defaultCoverImage.originalUrl
    : null
)

const uploadedFromLocale = (file: File) => {
  errorCode.value = null
  coverImage.value = file
  isDeleteCoverImage.value = false
}
const removeCoverImage = () => {
  isDeleteCoverImage.value = true
  coverImage.value = null
}

const getCoverImageS3Object = async () => {
  if (typeof coverImage.value === 'object' && coverImage.value !== null) {
    const { s3UploadId, fileName } = await uploadFileToS3(
      coverImage.value,
      coverImage.value.name
    )
    return {
      s3UploadId,
      fileName,
    }
  }

  return {
    s3UploadId: '',
    fileName: '',
  }
}

defineExpose({
  fileSizeMaxLimit,
  acceptType,
  errorCode,
  isDeleteCoverImage,
  getCoverImageS3Object,
})
</script>
