<template lang="pug">
modal-behavior(
  :header="$t('RR0297')"
  :primaryBtnText="$t('UU0022')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="disabledUpload"
  @click:primary="handleConfirm"
  @click:secondary="closeModalBehavior"
)
  template(#note)
    file-upload-error-note(
      v-if="errorCode"
      :errorCode="errorCode"
      :fileSizeMaxLimit="fileSizeMaxLimit"
      data-cy="modal-attachment-upload_error"
    )
    div(v-else-if="isUploading" class="flex items-center text-grey-600 leading-1.6")
      f-svg-icon(iconName="info_outline" size="14" class="mr-1.5")
      div(class="w-62.5") {{ $t('DD0106') }}
  div(class="w-94")
    template(v-if="attachmentList.length === 0")
      div(class="text-caption leading-1.6 grid grid-cols-2 grid-rows-4 pr-3 mb-3")
        div(class="text-grey-600") {{ $t('RR0243') }}
        div(class="text-grey-900 font-bold") {{ acceptType.join(', ').toUpperCase() }}
        div(class="text-grey-600") {{ $t('RR0145') }}
        div(class="text-grey-900 font-bold") {{ fileSizeMaxLimit / Math.pow(1024, 3) }} GB
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
    template(v-else)
      f-scrollbar-container(class="h-75")
        div(class="grid divide-y divide-grey-100")
          div(
            v-for="(attachment, index) in attachmentList"
            :key="index"
            class="py-1 h-11 flex items-center"
            data-cy="modal-smart-upload_item"
          )
            div(
              class="flex-1 group py-1 h-9 rounded flex items-center px-5 hover:bg-grey-100"
            )
              div(
                class="text-body2 font-bold text-grey-900 line-clamp-1 mr-2.5 flex-shrink-0"
              ) {{ attachment.name }}
              f-svg-icon(
                iconName="clear"
                iconSize="20"
                class="cursor-pointer text-grey-600 invisible group-hover:visible"
                @click="handleRemoveFile(index)"
              )
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { FileOperator } from '@frontier/lib'
import { MATERIAL_FILE_ACCEPT_TYPE } from '@/utils/constants'

const props = defineProps<{
  uploadHandler: (fileList: File[]) => Promise<void>
}>()

const store = useStore()
const errorCode = ref('')
const isUploading = ref(false)

const attachmentList = reactive<File[]>([])
const disabledUpload = computed(() => attachmentList.length === 0)

const fileSizeMaxLimit = 5 * Math.pow(1024, 3)
const acceptType = MATERIAL_FILE_ACCEPT_TYPE
const fileOperator = new FileOperator(acceptType, fileSizeMaxLimit)

const chooseFile = () => {
  fileOperator.upload(true)
}

const onDrop = (evt: DragEvent) => {
  fileOperator.onDrop(evt)
}

fileOperator.on('finish', (file: File) => {
  errorCode.value = ''
  attachmentList.push(file)
})

fileOperator.on('error', (code: string) => {
  errorCode.value = code
})

const handleConfirm = async () => {
  await props.uploadHandler(attachmentList)
  closeModalBehavior()
}

const handleRemoveFile = (index: number) => {
  attachmentList.splice(index, 1)
}

const closeModalBehavior = () => {
  store.dispatch('helper/closeModalBehavior')
}
</script>
