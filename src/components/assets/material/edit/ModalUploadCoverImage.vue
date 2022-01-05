<template lang="pug">
div(class="w-115 px-7.5")
  div(class="text-h6 text-primary text-center font-bold") {{$t("EE0087")}}
  p(class="text-caption text-black-600 text-right mb-1.5") *{{$t("AA0031")}}
  div(class="mb-7.5")
    input-text-btn(
      class="w-full"
      disabledInput
      :label="$t('EE0088')"
      :textValue="originalFileName"
      :clearable="false"
      :buttonLabel="$t('UU0025')"
      @click:button="chooseFile"
      required
    )
    p(class="text-primary text-caption line-height-1.6") {{$t("EE0089")}}
    p(class="text-primary text-caption line-height-1.6") {{$t("EE0090")}}
  div
    input-text(
      v-model:textValue="fileName"
      :label="$t('EE0091')"
      :placeholder="$t('EE0092')"
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
import { FileOperator } from '@/utils/fileOperator'

export default {
  name: 'ModalUploadCoverImage',
  props: {
    uploadHandler: {
      type: Function
    }
  },
  setup (props) {
    const store = useStore()
    const fileName = ref('')
    const originalFileName = ref('')
    const acceptType = ['jpg', 'jpeg', 'png']
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
