<template lang="pug">
div(class="rounded border-grey-250 bg-grey-50 border border-dashed")
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
  div
    template(
      v-if="currentOption === fileOptionId['2d_file'] || currentOption === fileOptionId['3d_file']"
    )
      div(
        class="rounded bg-primary-50 hover:bg-primary-100 h-156 flex justify-center items-center"
        data-cy="modal-smart-upload_dropzone"
        @click="chooseFile"
        @drop.stop.prevent="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      )
        div(class="flex flex-col items-center")
          div(class="bg-primary-400 hover:bg-primary-600 rounded-full mb-4")
            f-svg-icon(iconName="upload" size="24" class="text-grey-0 m-5")
          span(class="flex items-center") {{ textMap[currentOption] }}&nbsp;{{ $t('DD0105') }} &nbsp;
            f-button(size="sm" type="secondary" @click.stop="chooseFile") {{ $t('DD0145') }}
    template(v-if="currentOption === fileOptionId.Spreadsheet") 
      div(
        class="rounded bg-primary-50 hover:bg-primary-100 h-156 flex justify-center items-center"
        data-cy="modal-smart-upload_dropzone"
        @click="handleExcelButtonClick"
        @drop.stop.prevent="handleExcelButtonDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      )
        div(class="flex flex-col items-center")
          div(class="bg-primary-400 hover:bg-primary-600 rounded-full mb-4")
            f-svg-icon(iconName="upload" size="24" class="text-grey-0 m-5")
          span(class="flex items-center") {{ textMap[currentOption] }}&nbsp;{{ $t('DD0105') }} &nbsp;
            f-button(
              size="sm"
              type="secondary"
              @click.stop="handleExcelButtonClick"
            ) {{ $t('DD0145') }}
        input(
          ref="fileInput"
          type="file"
          class="hidden"
          accept=".xlsx, .xls, .csv"
          @change="handleExcelSelect"
        )
f-button(
  type="primary"
  size="md"
  class="mt-2"
  prependIcon="edit_pencil"
  v-if="currentOption === fileOptionId.Spreadsheet"
  @click="goToAssetMaterialSpreadSheet()"
) {{ $t('DD0149') }}
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { FileOperator, getFileExtension } from '@frontier/lib'
import type { UPLOAD_ERROR_CODE } from '@frontier/constants'
import { useAssetsStore } from '@/stores/assets'
import useNavigation from '@/composables/useNavigation'
import { Extension } from '@frontier/platform-web-sdk'
import { fileOptionId } from '@frontier/constants'
import { useI18n } from 'vue-i18n'
type option = '2d_file' | '3d_file' | 'Spreadsheet'

const assetsStore = useAssetsStore()
const props = defineProps<{
  currentOption: option
}>()
const { t } = useI18n()
const textMap = reactive({
  '2d_file': ` ${t('DD0142')} `,
  '3d_file': ` ${t('DD0143')} `,
  Spreadsheet: ` ${t('DD0144')} `,
})

const store = useStore()
const { goToAssetMaterialSpreadSheet } = useNavigation()
const fileInput = ref(null)
const errorCode = ref<UPLOAD_ERROR_CODE | null>(null)

const isUploading = ref(false)

const materialImageListNew = ref<File[]>([])

const isDisplayingCheckResult = ref(false)
const totalFiles = ref(0)

const fileSizeMaxLimit = computed(
  () => store.getters['organization/materialAttachmentUploadSizeLimit']
)
const acceptType = computed(() => {
  return props.currentOption === fileOptionId['2d_file']
    ? [Extension.JPG, Extension.JPEG, Extension.PNG]
    : [Extension.ZIP]
})

const fileOperator = new FileOperator(acceptType.value, fileSizeMaxLimit.value)
const chooseFile = () => {
  if (props.currentOption === fileOptionId['2d_file']) {
    fileOperator.upload(true)
  } else {
    fileOperator.upload()
  }
}

const onDrop = (evt: DragEvent) => {
  fileOperator.onDrop(evt)
}

fileOperator.on('error', (code: UPLOAD_ERROR_CODE) => {
  errorCode.value = code
})

fileOperator.on('filesValidated', (files: File[]) => {
  if (props.currentOption === fileOptionId['2d_file']) {
    totalFiles.value = files.length
    materialImageListNew.value = Array.from(files)
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-picture-check-upload',
      properties: {
        materialImageListNew: materialImageListNew,
        isDisplayingCheckResult: isDisplayingCheckResult,
      },
    })
  } else if (props.currentOption === fileOptionId['3d_file']) {
    totalFiles.value = files.length
    store.dispatch('helper/openModalBehavior', {
      component: 'modal3D-file-upload',
      properties: {
        u3mFile: Array.from(files),
        isShimaseiki: false,
      },
    })
  }
})

const onShowSpreadsheetEditor = (file: File) => {
  try {
    if (getFileExtension(file.name) !== Extension.XLSX) {
      throw Error(t('WW0173'))
    }
    file && assetsStore.addSpreadsheetInputFile(file)
    goToAssetMaterialSpreadSheet()
  } catch (error) {
    const errorMessage = error?.message?.content || (error as string)

    store.dispatch('helper/openModalConfirm', {
      type: 3,
      header: t('WW0122'),
      contentText: errorMessage,
      primaryBtnText: t('UU0031'),
      primaryBtnHandler: () => {
        store.dispatch('helper/closeModalConfirm')
      },
      testId: 'modal-confirm-crash',
    })
  }
}
const handleExcelButtonDrop = (evt: DragEvent) => {
  if (!evt.dataTransfer?.files) {
    return
  }

  const excelFile = Array.from(evt.dataTransfer.files).find((file) => file)

  excelFile && onShowSpreadsheetEditor(excelFile)
}
const handleExcelButtonClick = () => {
  if (fileInput.value) {
    ;(fileInput.value as HTMLElement).click()
  }
}
const handleExcelSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) {
    return
  }
  const file = target.files[0]

  file && onShowSpreadsheetEditor(file)
}
</script>
