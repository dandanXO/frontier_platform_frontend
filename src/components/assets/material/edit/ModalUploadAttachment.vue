<template lang="pug">
div(class='w-115 px-7.5')
  div(class='text-h6 text-primary text-center font-bold') {{$t('DD0054')}}
  p(class="text-caption text-black-600 text-right mb-1.5") *{{$t('AA0031')}}
  div(class='mb-7.5')
    input-text-btn(
      class="w-full"
      disabledInput
      :label="$t('DD0038')"
      :textValue="originalFileName"
      :clearable="false"
      :buttonLabel="$t('UU0025')"
      @click:button="chooseFile"
      required
    )
    p(class='text-primary text-caption line-height-1.6') {{$t('DD0055')}}
    p(class='text-primary text-caption line-height-1.6') {{$t('DD0056')}}
  div
    input-text(
      v-model:textValue="fileName"
      :label="$t('DD0057')"
      :placeholder="$t('DD0058')"
      required
    )
  div(class="h-25 flex justify-center items-center")
    div(class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="closeModal") {{$t('UU0002') }}
      btn(size="md" :disabled='disabled' @click="upload") {{$t('UU0022')}}
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { FileOperator } from '@/utils/fileOperator'

export default {
  name: 'ModalUploadAttachment',
  props: {
    uploadHandler: {
      type: Function
    }
  },
  setup (props) {
    const store = useStore()
    const { t } = useI18n()
    const fileName = ref('')
    const originalFileName = ref('')
    const acceptType = ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'gif', 'mov', 'mp4']
    const fileOperator = new FileOperator(acceptType, 6)
    let binaryFile

    const chooseFile = () => {
      fileOperator.upload()
    }

    fileOperator.on('finish', (file) => {
      binaryFile = file
      fileName.value = file.name
      originalFileName.value = file.name
    })

    fileOperator.on('error', (errorCode) => {
      const ERROR_CODE = fileOperator.errorCode
      switch (errorCode) {
        case ERROR_CODE.INVALID_TYPE:
          store.dispatch('helper/pushModalConfirm', {
            title: t('BB0063'),
            content: t('DD0065'),
            primaryText: t('UU0031')
          })
          break
        case ERROR_CODE.EXCEED_LIMIT:
          store.dispatch('helper/pushModalConfirm', {
            title: t('BB0063'),
            content: t('DD0066'),
            primaryText: t('UU0031')
          })
          break
      }
    })

    const upload = async () => {
      if (typeof props.uploadHandler === 'function') {
        store.dispatch('helper/pushModalLoading')
        await props.uploadHandler(binaryFile, fileName.value)
        store.dispatch('helper/closeModalLoading')
        closeModal()
      }
    }

    const disabled = computed(() => !fileName.value || !originalFileName.value)

    const closeModal = () => { store.dispatch('helper/closeModal') }

    return {
      originalFileName,
      fileName,
      chooseFile,
      upload,
      disabled,
      closeModal
    }
  }
}
</script>
