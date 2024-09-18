<template lang="pug">
modal-behavior(
  :header="modalHeaderText"
  :primaryBtnText="primaryBtnText"
  :secondaryBtnText="secondaryBtnText"
  :primaryBtnDisabled="disabledUpload"
  @click:primary="isFinish ? confirmAndViewProgress() : startUpload()"
  @click:secondary="isFinish ? closeModalBehavior() : cancelUpload()"
  :usingCustomFooter="isDisplayingCheckResult && !isCheckingFiles"
)
  template(#note)
    file-upload-error-note(
      v-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
      data-cy="modal-smart-upload_error"
    )
    div(v-else-if="isUploading" class="flex items-center text-grey-600 leading-1.6")
      f-svg-icon(iconName="info_outline" size="14" class="mr-1.5")
      div(class="w-62.5") {{ $t('DD0106') }}
  div(:class="`w-${isDisplayingCheckResult ? 160 : 94}`")
    template(v-if="materialImageList.length === 0")
      div(class="text-caption leading-1.6 grid grid-cols-2 grid-rows-4 pr-3 mb-3")
        div(class="text-grey-600") {{ $t('RR0243') }}
        div(class="text-grey-900 font-bold") {{ acceptType.join(', ').toUpperCase() }}
        div(class="text-grey-600") {{ $t('DD0133') }}
        div(class="text-grey-900 font-bold") {{ $t('DD0134') }}
        div(class="text-grey-600") {{ $t('RR0145') }}
        i18n-t(keypath="DD0101" tag="div" class="text-grey-900 font-bold") 
          template(#number) &nbsp; {{ bytesToSize(fileSizeMaxLimit) }}
        div(class="text-grey-600") {{ $t('DD0102') }}
        div(class="text-grey-900 font-bold") {{ $t('DD0103') }}
        div(class="text-grey-600") {{ $t('DD0118') }}
        div(class="text-grey-900 font-bold") {{ $t('DD0119') }}
      div(
        class="rounded border-grey-250 bg-grey-50 border border-dashed h-57 flex justify-center items-center"
        data-cy="modal-smart-upload_dropzone"
        @drop.stop.prevent="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      )
        div(class="w-44 flex flex-col items-center")
          f-svg-icon(iconName="cloud_upload" size="68" class="text-primary-400")
          i18n-t(
            keypath="DD0104"
            tag="div"
            class="text-center text-grey-600 text-body2 font-bold leading-1.6"
            scope="global"
          )
            template(#DD0108)
              span(class="text-primary-400 inline-block") {{ $t('DD0108') }}
          div(class="text-caption text-grey-600 leading-1.6 pt-2.5 pb-2") {{ $t('DD0105') }}
          f-button(
            size="md"
            data-cy="modal-smart-upload_browse"
            @click="chooseFile"
          ) {{ $t('UU0025') }}
    template(v-else-if="isCheckingFiles")
      div(class="flex items-center flex-col")
        div(class="text-grey-850 text-center mb-4") {{ $t('DD0127') }}
        f-circle-progress-bar(
          class="mb-2"
          :size="80"
          :current="materialImageList.length"
          :max="totalFiles"
        )
        div(class="text-grey-800 text-center font-bold") {{ materialImageList.length }} {{  " " + $t('DD0128') + " "  }} {{ totalFiles }}
    template(v-else-if="isDisplayingCheckResult")
      div(class="flex items-center flex-col")
        accordion(
          :title="$t('DD0153', { total: validImages.length })"
          titleClass="text-primary-400"
          :items="validImages"
        )
        accordion(
          :title="$t('DD0154', { total: invalidImages.length })"
          titleClass="text-red-600"
          :items="invalidImages"
          isExpanded
        )
    template(v-else)
      template(v-if="isFinish")
        div(class="flex items-center bg-grey-50 py-2.5 px-4 mb-1 h-14.5")
          f-svg-icon(iconName="loading" size="20" class="text-primary-400 mr-3")
          p(class="text-caption text-grey-600 leading-1.6") {{ $t('DD0114') }}
        f-scrollbar-container(class="h-59.5")
          div(class="grid divide-y divide-grey-100")
            div(
              v-for="image in validImages"
              :key="image.file.name"
              class="py-1 h-11 flex items-center"
            )
              div(class="group py-1 h-9 rounded flex items-center px-5 hover:bg-grey-100")
                div(
                  class="w-34 text-body2 font-bold text-grey-900 line-clamp-1 mr-2.5 flex-shrink-0"
                ) {{ image.file.name }}
                div(class="w-40 mr-2.5 flex-shrink-0")
                  div(class="w-full h-2 bg-grey-250 rounded-lg")
                    div(class="h-2 bg-primary-400 rounded-lg w-full")
                div(class="w-5 flex-shrink-0")
      f-scrollbar-container(v-else class="h-75")
        div(class="grid divide-y divide-grey-100")
          div(
            v-for="(image, index) in validImages"
            :key="image.file.name"
            class="py-1 h-11 flex items-center"
            data-cy="modal-smart-upload_item"
          )
            div(class="group py-1 h-9 rounded flex items-center px-5 hover:bg-grey-100")
              div(
                class="w-34 text-body2 font-bold text-grey-900 line-clamp-1 mr-2.5 flex-shrink-0"
              ) {{ image.file.name }}
              div(class="w-40 mr-2.5 flex-shrink-0")
                div(
                  v-if="isUploading || isFinish"
                  class="w-full h-2 bg-grey-250 rounded-lg"
                )
                  div(
                    class="h-2 bg-primary-400 rounded-lg"
                    :style="{ width: `${image.processing * 100}%` }"
                  )
              div(class="w-5 flex-shrink-0")
                f-svg-icon(
                  v-if="image.processing !== 1"
                  iconName="clear"
                  size="20"
                  class="cursor-pointer text-grey-600 invisible group-hover:visible"
                  data-cy="modal-smart-upload_remove"
                  @click="removeImage(image, index)"
                )
                f-svg-icon(
                  v-else
                  iconName="done"
                  size="20"
                  class="text-primary-400"
                  data-cy="modal-smart-upload_done"
                )
  template(#custom-footer)
    div(class="p-5 flex flex-col gap-5 shadow-[0_-8px_16px_0px_rgba(0,0,0,0.08)] z-popper")
      div(v-if="invalidImages.length > 0" class="w-full bg-red-0 rounded-md p-3 flex") 
        f-svg-icon(iconName="cancel_outline" size="20" class="text-red-600 mr-2")
        div(class="text-grey-700 text-sm") {{ $t('WW0174') }}

      f-button(
        size="md"
        @click="!!validImages.length ? startUpload() : onReuploadModal()"
      ) {{ primaryBtnTextCustomFooter }}
</template>

<script lang="ts">
export const MIN_DIMENSION = 800
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  FileOperator,
  TRACKER_PREFIX,
  TRACKER_POSTFIX,
  track,
  bytesToSize,
  TRACKER_ADDITIONAL_PROPERTIES,
} from '@frontier/lib'
import useNavigation from '@/composables/useNavigation'
import { uploadFileToS3 } from '@/utils/fileUpload'
import { useAssetsStore } from '@/stores/assets'
import { type S3UploadedObject, Extension } from '@frontier/platform-web-sdk'
import Accordion, {
  type ImageItem,
} from '@/components/assets/modalSmartUpload/Accordion.vue'
import { INVALID_IMAGE_CODE } from '@/utils/constants'
import { readImageFile } from '@/utils/readImageFile'
const TRACKER_ID = 'Upload an Existing Image'

const store = useStore()
const { t } = useI18n()

const { ogBaseAssetsApi, viewMode } = useAssetsStore()
const errorCode = ref<UPLOAD_ERROR_CODE | null>(null)
const { goToProgress } = useNavigation()
const isUploading = ref(false)
const isFinish = ref(false)

const materialImageList = ref<ImageItem[]>([])
const removeImage = (imageItem: ImageItem, index: number) => {
  imageItem.isRemoved = true
  materialImageList.value.splice(index, 1)
}
const validImages = computed(() =>
  materialImageList.value.filter(
    (image) => !image.isRemoved && !image.invalidCode.length
  )
)
const invalidImages = computed(() =>
  materialImageList.value.filter(
    (image) => image.isRemoved || image.invalidCode.length
  )
)

const modalHeaderText = computed(() => {
  if (isUploading.value) {
    return t('DD0112')
  }

  if (isFinish.value) {
    return t('DD0113')
  }

  if (isCheckingFiles.value) {
    return t('DD0126')
  }

  if (isDisplayingCheckResult.value) {
    return t('WW0177', { total: materialImageList.value.length })
  }

  return t('DD0094')
})

const primaryBtnText = computed(() => {
  if (isDisplayingCheckResult.value) {
    return undefined
  }

  if (isUploading.value) {
    return ''
  }

  return isFinish.value ? t('UU0087') : t('UU0022')
})

const onReuploadModal = () => {
  isCheckingFiles.value = false
  isDisplayingCheckResult.value = false
  materialImageList.value = []
}

const primaryBtnTextCustomFooter = computed(() => {
  return validImages.value.length ? t('WW0176') : t('WW0175')
})

const secondaryBtnText = computed(() => {
  if (isDisplayingCheckResult.value) {
    return undefined
  }

  return isFinish.value ? t('UU0026') : t('UU0002')
})

const isCheckingFiles = ref(false)
const isDisplayingCheckResult = ref(false)
const totalFiles = ref(0)

const disabledUpload = computed(
  () => validImages.value.length === 0 || isCheckingFiles.value
)

const fileSizeMaxLimit = computed(
  () => store.getters['organization/materialAttachmentUploadSizeLimit']
)
const acceptType = [Extension.JPG, Extension.JPEG, Extension.PNG]
const fileOperator = new FileOperator(acceptType, fileSizeMaxLimit.value)

const chooseFile = () => {
  fileOperator.upload(true)
}

const onDrop = (evt: DragEvent) => {
  fileOperator.onDrop(evt)
}

const onReadImageAsset = async (file: File, item: ImageItem) => {
  try {
    const imageInfo = await readImageFile(file)

    const newItem: ImageItem = {
      ...item,
      ...imageInfo,
    }

    validateImage(newItem, imageInfo)

    errorCode.value = null
    materialImageList.value.push(newItem)
  } catch (error) {
    console.error('Error reading image file:', error)
    item.invalidCode.push(INVALID_IMAGE_CODE.INVALID_FILE_TYPE)
    item.isRemoved = true

    materialImageList.value.push(item)
  }
}

fileOperator.on('finish', async (file: File) => {
  isCheckingFiles.value = true
  const item: ImageItem = {
    file,
    processing: 0,
    isRemoved: false,
    invalidCode: [],
    height: 0,
    size: file.size,
    type: file.type,
    width: 0,
  }
  if (file.size > fileSizeMaxLimit.value) {
    item.invalidCode.push(INVALID_IMAGE_CODE.INVALID_FILE_SIZE)
    item.isRemoved = true
  }

  await onReadImageAsset(file, item)

  const invalidDataExists = !!materialImageList.value.find(
    (image) => !!image.invalidCode.length
  )

  if (materialImageList.value.length === totalFiles.value) {
    isCheckingFiles.value = false
    !invalidDataExists && startUpload()
  }

  isDisplayingCheckResult.value = invalidDataExists
})

function validateImage(item: ImageItem, imageInfo: any) {
  if (imageInfo.width < MIN_DIMENSION || imageInfo.height < MIN_DIMENSION) {
    item.invalidCode.push(INVALID_IMAGE_CODE.INVALID_DIMENSION)
    item.isRemoved = true
  }

  if (
    !acceptType.some((type) =>
      imageInfo.type.toLowerCase().includes(type.toLowerCase())
    )
  ) {
    item.invalidCode.push(INVALID_IMAGE_CODE.INVALID_FILE_TYPE)
    item.isRemoved = true
  }
}

fileOperator.on('error', (code: UPLOAD_ERROR_CODE) => {
  errorCode.value = code
})

fileOperator.on('filesValidated', (files: File[]) => {
  totalFiles.value = files.length
})

const startUpload = () => {
  isDisplayingCheckResult.value = false
  isUploading.value = true

  const uploadToAws = async (image: ImageItem) => {
    const { s3UploadId, fileUploadUrl, fileName } = await uploadFileToS3(
      image.file,
      image.file.name
    )
    return new Promise((resolve: (value?: S3UploadedObject) => void) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        image.isRemoved && xhr.abort()

        if (event.lengthComputable) {
          image.processing = event.loaded / event.total
        }
      })

      xhr.addEventListener('loadend', () => {
        if (image.isRemoved) {
          resolve()
        } else {
          resolve({ s3UploadId, fileName })
        }
      })

      xhr.open('PUT', fileUploadUrl, true)
      xhr.send(image.file)
    })
  }

  Promise.all(validImages.value.map(uploadToAws))
    .then((fileList) =>
      ogBaseAssetsApi('smartUploadAssetsMaterialV2', {
        fileList: fileList.filter((file) => file) as S3UploadedObject[],
      })
    )
    .then(() => {
      track({
        eventName: [
          TRACKER_PREFIX.SUBMIT_DATA,
          TRACKER_ID,
          TRACKER_POSTFIX.SUCCESS,
        ].join(' '),
        properties: {
          totalImages: materialImageList.value.length,
          totalValidImages: validImages.value.length,
          totalInvalidImages: invalidImages.value.length,
          [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]: viewMode,
        },
      })
      isFinish.value = true
      isUploading.value = false
    })
    .catch((error) => {
      console.error(error || 'Error uploading images')
      track({
        eventName: [
          TRACKER_PREFIX.SUBMIT_DATA,
          TRACKER_ID,
          TRACKER_POSTFIX.ERROR,
        ].join(' '),
        properties: {
          error,
          totalImages: materialImageList.value.length,
          totalValidImages: validImages.value.length,
          totalInvalidImages: invalidImages.value.length,
          [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]: viewMode,
        },
      })
    })
}

const confirmAndViewProgress = () => {
  closeModalBehavior()
  goToProgress()
}

const cancelUpload = () => {
  if (isUploading.value) {
    materialImageList.value.forEach((image) => (image.isRemoved = true))
  }

  closeModalBehavior()
}

const closeModalBehavior = () => {
  store.dispatch('helper/closeModalBehavior')
}
</script>
