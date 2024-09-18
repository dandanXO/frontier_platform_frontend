<template lang="pug">
modal-behavior(
  :header="isUploading ? $t('DD0112') : isFinish ? $t('DD0113') : isCheckingFiles || isDisplayingCheckResult ? $t('DD0126') : $t('DD0094')"
  :primaryBtnText="isUploading ? '' : isFinish ? $t('UU0087') : $t('UU0022')"
  :secondaryBtnText="isFinish ? $t('UU0026') : $t('UU0002')"
  :primaryBtnDisabled="disabledUpload"
  @click:primary="isFinish ? confirmAndViewProgress() : startUpload()"
  @click:secondary="isFinish ? closeModalBehavior() : cancelUpload()"
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
  div(class="w-94")
    template(v-if="isCheckingFiles")
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
      div(class="flex items-center flex-col overflow-auto")
        accordion(
          :title="$t('DD0131')"
          titleClass="text-primary-600"
          :items="validImages"
        )
        accordion(
          :title="$t('DD0132')"
          titleClass="text-red-600"
          :items="invalidImages"
          isExpanded
        )
        div(v-if="invalidImages.length > 0" class="w-full bg-red-100 rounded-md p-3 flex") 
          f-svg-icon(iconName="error_outline" size="20" class="text-red-600 mr-2")
          div(class="text-grey-700 text-sm") {{ $t('WW0172') }}
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRef } from 'vue'
import { useStore } from 'vuex'
import { TRACKER_PREFIX, TRACKER_POSTFIX, track } from '@frontier/lib'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import {
  TRACKER_ADDITIONAL_PROPERTIES,
  type UPLOAD_ERROR_CODE,
} from '@frontier/constants'
import { uploadFileToS3 } from '@/utils/fileUpload'
import { useAssetsStore } from '@/stores/assets'
import { type S3UploadedObject, Extension } from '@frontier/platform-web-sdk'
import Accordion from '@/components/assets/modalSmartUpload/Accordion.vue'
import { INVALID_IMAGE_CODE } from '@/utils/constants'
import { readImageFile } from '@/utils/readImageFile'

interface ImageItem {
  file: File
  processing: number
  isRemoved: boolean
  type: string
  size: number
  width: number
  height: number
  invalidCode: number | null
}
const props = defineProps<{
  materialImageListNew: any[]
}>()

const TRACKER_ID = 'Advanced View Upload 2D Material'

const store = useStore()
const { ogBaseAssetsApi, viewMode } = useAssetsStore()
const errorCode = ref<UPLOAD_ERROR_CODE | null>(null)
const { goToProgress, goToAssetMaterialEdit, ogType } = useNavigation()
const isUploading = ref(false)
const isFinish = ref(false)
const { t } = useI18n()

const materialImageList = ref<ImageItem[]>([])
const materialImageListNew = toRef(props.materialImageListNew)
const removeImage = (imageItem: ImageItem, index: number) => {
  imageItem.isRemoved = true
  materialImageList.value.splice(index, 1)
}
const validImages = computed(() =>
  materialImageList.value.filter(
    (image) => !image.isRemoved && !image.invalidCode
  )
)
const invalidImages = computed(() =>
  materialImageList.value.filter(
    (image) => image.isRemoved || image.invalidCode
  )
)

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
const minimumDimensions = 800
const minimumResolution = 300

function validateImage(item: ImageItem, imageInfo: any) {
  if (
    !acceptType.some((type) =>
      imageInfo.type.toLowerCase().includes(type.toLowerCase())
    )
  ) {
    item.invalidCode = INVALID_IMAGE_CODE.INVALID_FILE_TYPE
    item.isRemoved = true
  }

  // F22-3547 disable image upload resolution validation
  // if (
  //   imageInfo.xResolution < minimumResolution ||
  //   imageInfo.yResolution < minimumResolution
  // ) {
  //   item.invalidCode = INVALID_IMAGE_CODE.INVALID_RESOLUTION
  //   item.isRemoved = true
  // }
}

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
    .then((res) => {
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
      if (res.data && res.data?.result?.length === 1) {
        goToAssetMaterialEdit(res.data.result[0].materialId!, ogType.value)
        closeModalBehavior()
      }
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

onMounted(() => {
  totalFiles.value = materialImageListNew.value.length
  materialImageListNew.value.forEach(async (file) => {
    isCheckingFiles.value = true
    try {
      const imageInfo = await readImageFile(file)

      const item: ImageItem = {
        file,
        processing: 0,
        isRemoved: false,
        invalidCode: null,
        ...imageInfo,
      }

      validateImage(item, imageInfo)

      errorCode.value = null
      materialImageList.value.push(item)
    } catch (error) {
      console.error('Error reading image file:', error)
      store.dispatch('helper/openModalConfirm', {
        type: 3,
        header: t('WW0122'),
        contentText: t('WW0173'),
        primaryBtnText: t('UU0031'),
        primaryBtnHandler: closeModalBehavior,
        testId: 'modal-confirm-crash',
      })
    }

    isCheckingFiles.value = false
    isDisplayingCheckResult.value = false
    if (totalFiles.value === materialImageList.value.length) {
      // auto upload
      startUpload()
    }
  })
})
</script>
