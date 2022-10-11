<template lang="pug">
modal-behavior(
  :header="isUploading ? $t('DD0112') : isFinish ? $t('DD0113') : $t('DD0094')"
  :primaryBtnText="isUploading ? '' : isFinish ? $t('UU0087') : $t('UU0022')"
  :secondaryBtnText="isFinish ? $t('UU0026') : $t('UU0002')"
  :primaryBtnDisabled="disabledUpload"
  @click:primary="isFinish ? confirmAndViewProgress() : startUpload()"
  @click:secondary="isFinish ? closeModalBehavior() : cancelUpload()"
)
  template(#note)
    file-upload-error-note(v-if="errorCode" :errorCode="errorCode" :fileSizeMaxLimit="fileSizeMaxLimit" data-cy="modal-smart-upload_error")
    div(v-else-if="isUploading" class="flex items-center text-grey-600 leading-1.6")
      f-svg-icon(iconName="info_outline" size="14" class="mr-1.5")
      div(class="w-62.5") {{ $t("DD0106") }}
  div(class="w-94")
    template(v-if="readyToUploadFile.length === 0")
      div(class="text-caption leading-1.6 grid grid-cols-2 grid-rows-3 pr-3 mb-3")
        div(class="text-grey-600") {{ $t("RR0243") }}
        div(class="text-grey-900 font-bold") {{ acceptType.join(', ').toUpperCase() }}
        div(class="text-grey-600") {{ $t("RR0145") }}
        div(class="text-grey-900 font-bold") {{ $t("DD0101") }}
        div(class="text-grey-600") {{ $t("DD0102") }}
        div(class="text-grey-900 font-bold") {{ $t("DD0103") }}
      div(
        class="rounded border-grey-200 bg-grey-50 border border-dashed h-57 flex justify-center items-center"
        data-cy="modal-smart-upload_dropzone"
        @drop.stop.prevent="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      )
        div(class="w-44 flex flex-col items-center")
          f-svg-icon(iconName="cloud_upload" size="68" class="text-primary-400")
          i18n-t(keypath="DD0104" tag="div" class="text-center text-grey-600 text-body2 font-bold leading-1.6" scope="global")
            template(#DD0108)
              span(class="text-primary-400 inline-block") {{ $t("DD0108") }}
          div(class="text-caption text-grey-600 leading-1.6 pt-2.5 pb-2") {{ $t("DD0105") }}
          f-button(size="md" data-cy="modal-smart-upload_browse" @click="chooseFile") {{ $t("UU0025") }}
    template(v-else)
      template(v-if="isFinish")
        div(class="flex items-center bg-grey-50 py-2.5 px-4 mb-1 h-14.5")
          f-svg-icon(iconName="loading" size="20" class="text-primary-400 mr-3")
          p(class="text-caption text-grey-600 leading-1.6") {{ $t("DD0114") }}
        f-scrollbar-container(class="h-59.5")
          div(class="grid divide-y divide-grey-100")
            div(v-for="image in readyToUploadFile" class="py-1 h-11 flex items-center")
              div(class="group py-1 h-9 rounded flex items-center px-5 hover:bg-grey-100")
                div(class="w-34 text-body2 font-bold text-grey-900 line-clamp-1 mr-2.5 flex-shrink-0") {{ image.file.name }}
                div(class="w-40 mr-2.5 flex-shrink-0")
                  div(class="w-full h-2 bg-grey-200 rounded-lg")
                    div(class="h-2 bg-primary-400 rounded-lg w-full")
                div(class="w-5 flex-shrink-0")
      f-scrollbar-container(v-else class="h-75")
        div(class="grid divide-y divide-grey-100")
          div(v-for="image in readyToUploadFile" class="py-1 h-11 flex items-center" data-cy="modal-smart-upload_item")
            div(class="group py-1 h-9 rounded flex items-center px-5 hover:bg-grey-100")
              div(class="w-34 text-body2 font-bold text-grey-900 line-clamp-1 mr-2.5 flex-shrink-0") {{ image.file.name }}
              div(class="w-40 mr-2.5 flex-shrink-0")
                div(v-if="isUploading || isFinish" class="w-full h-2 bg-grey-200 rounded-lg")
                  div(class="h-2 bg-primary-400 rounded-lg" :style="{ width: `${image.processing * 100}%` }")
              div(class="w-5 flex-shrink-0")
                f-svg-icon(v-if="image.processing !== 1" iconName="clear" size="20" class="cursor-pointer text-grey-600 invisible group-hover:visible" data-cy="modal-smart-upload_remove" @click="image.isRemoved = true")
                f-svg-icon(v-else iconName="done" size="20" class="text-primary-400" data-cy="modal-smart-upload_done")
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { FileOperator } from '@/utils/fileOperator'
import useNavigation from '@/composables/useNavigation'

const store = useStore()
const errorCode = ref('')
const { goToProgress } = useNavigation()
const isUploading = ref(false)
const isFinish = ref(false)

const materialImageList = reactive([])
const uploadedFiles = reactive([])
const readyToUploadFile = computed(() => materialImageList.filter(image => !image.isRemoved))
const disabledUpload = computed(() => readyToUploadFile.value.length === 0)

const fileSizeMaxLimit = 20
const acceptType = ['jpg', 'jpeg', 'png']
const fileOperator = new FileOperator(acceptType, fileSizeMaxLimit)

const chooseFile = () => {
  fileOperator.upload(true)
}

const onDrop = (evt) => {
  fileOperator.onDrop(evt)
}

fileOperator.on('finish', (file) => {
  errorCode.value = ''
  materialImageList.push({ file, isRemoved: false, processing: 0 })
})

fileOperator.on('error', (code) => {
  errorCode.value = code
})

const startUpload = () => {
  isUploading.value = true

  const uploadToAws = (image) => {
    return new Promise(async (resolve, reject) => {
      const { tempUploadId, fileUploadUrl } = await store.dispatch('getUploadUrl', { fileName: image.file.name })

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        image.isRemoved && xhr.abort()

        if (event.lengthComputable) {
          image.processing = event.loaded / event.total
        }
      })

      xhr.addEventListener('loadend', () => {
        if (!image.isRemoved) {
          console.log(new Date().getTime(), `${image.file.name} was upload to S3 successfully!`)
          uploadedFiles.push({ tempUploadId, fileName: image.file.name })
        }
        resolve()
      })

      xhr.open('PUT', fileUploadUrl, true)
      xhr.send(image.file)
    })
  }

  Promise.all(readyToUploadFile.value.map(uploadToAws))
    .then(() => {
      if (readyToUploadFile.value.length !== 0) {
        store.dispatch('assets/smartUpload', { fileList: uploadedFiles })
      }
    })
    .then(() => {
      isFinish.value = true
      isUploading.value = false
    })
}

const confirmAndViewProgress = () => {
  closeModalBehavior()
  goToProgress()
}

const cancelUpload = () => {
  if (isUploading.value) {
    console.log(new Date().getTime(), 'Cancel upload!')
    materialImageList.forEach(image => image.isRemoved = true)
  }

  closeModalBehavior()
}

const closeModalBehavior = () => {
  store.dispatch('helper/closeModalBehavior')
}
</script>
