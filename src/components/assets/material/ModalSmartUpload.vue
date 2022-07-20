<template lang="pug">
modal-behavior(
  :header="isUploading ? $t('RR0162') : isFinish ? $t('DD0107') : $t('DD0094')"
  :primaryBtnText="isUploading ? '' : isFinish ? $t('UU0087') : $t('UU0022')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="disabledUpload || isLoading"
  @click:primary="isFinish ? confirmAndViewProgress() : startUpload()"
  @click:secondary="cancelUpload()"
)
  template(#note)
    file-upload-error-note(v-if="errorCode" :errorCode="errorCode" :fileSizeMaxLimit="fileSizeMaxLimit")
    div(v-else-if="isUploading" class="flex items-center text-black-600 leading-1.6")
      svg-icon(iconName="info_outline" size="14" class="mr-1.5")
      div(class="w-62.5") {{ $t("DD0106") }}
  div(class="w-94")
    template(v-if="readyToUploadFile.length === 0")
      div(class="text-caption leading-1.6 grid grid-cols-2 grid-rows-3 pr-3 mb-3")
        div(class="text-black-800") {{ $t("DD0098") }}
        div(class="text-primary font-bold") {{ $t("DD0099") }}
        div(class="text-black-800") {{ $t("DD0100") }}
        div(class="text-primary font-bold") {{ $t("DD0101") }}
        div(class="text-black-800") {{ $t("DD0102") }}
        div(class="text-primary font-bold") {{ $t("DD0103") }}
      div(
        class="rounded border-black-500 bg-black-100 border border-dashed h-57 flex justify-center items-center"
        @drop.stop.prevent="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      )
        div(class="w-44 flex flex-col items-center")
          svg-icon(iconName="cloud_upload" size="68" class="text-brand")
          i18n-t(keypath="DD0104" tag="div" class="text-center text-black-800 text-body2 font-bold leading-1.6")
            template(#DD0108)
              span(class="text-brand inline-block") {{ $t("DD0108") }}
          div(class="text-caption text-black-600 leading-1.6 pt-2.5 pb-2") {{ $t("DD0105") }}
          btn(size="md" @click="chooseFile") {{ $t("UU0025") }}
    template(v-else)
      overlay-scrollbar-container(class="h-75")
        div(class="grid divide-y divide-black-200")
          div(v-for="image in readyToUploadFile" class="py-1 h-11 flex items-center")
            div(class="group py-1 h-9 rounded flex items-center px-5 hover:bg-black-200")
              div(class="w-34 text-body2 font-bold text-primary line-clamp-1 mr-2.5 flex-shrink-0") {{ image.file.name }}
              div(class="w-40 mr-2.5 flex-shrink-0")
                div(v-if="isUploading || isFinish" class="w-full h-2 bg-black-400 rounded-lg")
                  div(class="h-2 bg-brand rounded-lg" :style="{ width: `${image.processing * 100}%` }")
              div(class="w-5 flex-shrink-0")
                svg-icon(v-if="image.processing !== 1" iconName="clear" size="20" class="cursor-pointer text-black-600 invisible group-hover:visible" @click="image.isRemoved = true")
                svg-icon(v-else iconName="done" size="20" class="text-brand")
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
const isLoading = ref(false)

const materialImageList = reactive([])
const uploadedFiles = reactive([])
const readyToUploadFile = computed(() => materialImageList.filter(image => !image.isRemoved))
const disabledUpload = computed(() => readyToUploadFile.value.length === 0)

const fileSizeMaxLimit = 20
const fileOperator = new FileOperator(['jpg', 'jpeg', 'png'], fileSizeMaxLimit, true)

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

fileOperator.on('selfDefinedError', (code) => {
  errorCode.value = code
})

const startUpload = () => {
  isUploading.value = true

  const uploadToAws = (image) => {
    return new Promise(async (resolve, reject) => {
      const { result: { tempUploadId, fileUploadUrl } } = await store.dispatch('assets/getSmartUploadUrl', { fileName: image.file.name })

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        image.isRemoved && xhr.abort()

        if (event.lengthComputable) {
          image.processing = event.loaded / event.total
        }
      })

      xhr.addEventListener('loadend', () => {
        if (!image.isRemoved) {
          console.log(new Date().getTime(),`${image.file.name} was upload to S3 successfully!`)
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
      isFinish.value = true
      isUploading.value = false
    })
}

const confirmAndViewProgress = async () => {
  isLoading.value = true
  await store.dispatch('assets/smartUpload', { fileList: uploadedFiles })
  store.dispatch('helper/closeModalBehavior')
  goToProgress()
}

const cancelUpload = () => {
  console.log(new Date().getTime() ,'Cancel upload!')
  materialImageList.forEach(image => image.isRemoved = true)
  store.dispatch('helper/closeModalBehavior')
}
</script>
