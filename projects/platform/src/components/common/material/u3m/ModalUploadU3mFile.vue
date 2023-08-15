<template lang="pug">
modal-behavior(
  :header="'Upload 3D Material'"
  :secondaryBtnText="$t('UU0002')"
  @click:secondary="closeModalBehavior"
)
  template(#note)
    file-upload-error-note(
      v-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
    )
    div(
      v-if="customizedErrorMsg !== ''"
      class="flex items-center text-red-400 leading-1.6"
    )
      f-svg-icon(iconName="info_outline" size="14" class="mr-1.5")
      div
        p {{ customizedErrorMsg }}
        p {{ $t('WW0139') }}
  div(class="w-94 flex flex-col gap-y-2")
    div(class="text-caption leading-1.6 grid grid-cols-2 grid-rows-2")
      div(class="text-grey-600") {{ $t('RR0243') }}
      div(class="text-grey-900 font-bold") {{ acceptType.join(', ').toUpperCase() }}
      div(class="text-grey-600") {{ $t('RR0145') }}
      div(class="text-grey-900 font-bold") {{ bytesToSize(fileSizeMaxLimit) }}
    div(
      class="rounded border-grey-250 bg-grey-50 border border-dashed pt-6 pb-7 flex justify-center items-center"
      data-cy="modal-smart-upload_dropzone"
      @drop.stop.prevent="onDrop($event)"
      @dragover.prevent
      @dragenter.prevent
    )
      div(class="w-44 flex flex-col items-center")
        f-svg-icon(iconName="cloud_upload" size="60" class="text-primary-400")
        p(class="font-bold text-grey-600 text-body2/1.6") {{ $t('EE0167') }}
        p(class="text-caption/1.6 text-grey-600 py-1") {{ $t('DD0105') }}
        f-button(
          size="sm"
          data-cy="modal-smart-upload_browse"
          @click="chooseFile"
        ) {{ $t('UU0025') }}
    f-infobar(:notifyType="NOTIFY_TYPE.TIPS")
      i18n-t(keypath="EE0168" class="text-caption text-grey-600/1.6" scope="global")
        template(#UU0078)
          span(class="text-cyan-400 cursor-pointer" @click="openModalSendFeedback") {{ $t('UU0078') }}
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { FileOperator, unzip } from '@/utils/fileOperator'
import { UPLOAD_ERROR_CODE, EXTENSION, NOTIFY_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { bytesToSize } from '@/utils/fileOperator'

const props = defineProps<{
  uploadedHandler: (payload: {
    u3mFile: File
    hasPhysicalData: boolean
  }) => void
}>()

const { t } = useI18n()
const store = useStore()

const errorCode = ref<UPLOAD_ERROR_CODE | string>('')
const fileSizeMaxLimit = 5 * Math.pow(1024, 3)
const acceptType = [EXTENSION.ZIP]
const fileOperator = new FileOperator(acceptType, fileSizeMaxLimit)
const customizedErrorMsg = ref('')
const chooseFile = () => {
  fileOperator.upload()
}

const onDrop = (evt: DragEvent) => {
  fileOperator.onDrop(evt)
}

fileOperator.on('finish', async (file: File) => {
  errorCode.value = ''
  customizedErrorMsg.value = ''
  let hasPhysicalData = false
  const unzippedU3mFileList = await unzip(file, [EXTENSION.U3M])

  try {
    const u3m = unzippedU3mFileList.find(
      (item) => item.extension === EXTENSION.U3M
    )

    // 1. check if it's valid JSON format
    if (!u3m) {
      throw t('WW0135')
    }

    let u3mJSON
    try {
      u3mJSON = JSON.parse(u3m.content)
    } catch (e) {
      throw t('WW0135')
    }

    const loopObject = (obj: any) => {
      Object.keys(obj).forEach((key: string) => {
        const value = obj[key]
        if (
          typeof value === 'object' &&
          !Array.isArray(value) &&
          value !== null
        ) {
          return loopObject(value)
        }
        // 2. check if basecolor exists
        if (key === 'basecolor' && value === null) {
          throw t('WW0136')
        }

        // 3. check if it can find image file  by corresponding URI path
        if (key === 'path') {
          const isMatched = unzippedU3mFileList.some((item) =>
            item.file.name.includes(value)
          )
          if (!isMatched) {
            throw t('WW0137')
          }
        }

        // 4. check if fab has value and can find the JSON file by corresponding URI path
        if (key === 'fab' && value !== null) {
          const isMatched = unzippedU3mFileList.some((item) =>
            item.file.name.includes(value)
          )
          hasPhysicalData = true
          if (!isMatched) {
            throw t('WW0138')
          }
        }
      })
    }
    loopObject(u3mJSON.material)

    props.uploadedHandler({ u3mFile: file, hasPhysicalData })
    closeModalBehavior()
  } catch (e) {
    customizedErrorMsg.value = e as string
  }
})

fileOperator.on('error', (code: UPLOAD_ERROR_CODE) => {
  errorCode.value = code
})

const openModalSendFeedback = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-send-feedback',
  })
}

const closeModalBehavior = () => {
  store.dispatch('helper/closeModalBehavior')
}
</script>
