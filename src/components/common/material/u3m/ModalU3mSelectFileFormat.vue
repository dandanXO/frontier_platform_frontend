<template lang="pug">
div(class="w-68.5")
  div(class="mb-7.5 text-center text-primary text-h6 font-bold") {{ $t("EE0080") }}
  input-radio-group(
    v-model:inputValue="selectedFormat"
    :optionList="formatOptions"
    class="flex justify-center items-center"
    required
  )
  btn-group(
    class="h-25"
    :secondaryButton="true"
    :primaryText="$t('UU0059')"
    @click:primary="downloadU3m"
    @click:secondary="closeModal"
  )
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { downloadDataURLFile } from '@/utils/fileOperator'
import { ref } from '@vue/reactivity'
import { U3M_STATUS } from '@/utils/constants'

export default {
  name: 'ModalU3mSelectFileFormat',
  props: {
    materialList: {
      type: Array
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const formatOptions = [
      {
        name: t('EE0081'),
        value: 'zipUrl'
      },
      {
        name: t('EE0082'),
        value: 'u3maUrl'
      }
    ]
    const selectedFormat = ref(formatOptions[0].value)

    const downloadU3m = () => {
      store.dispatch('helper/openModalLoading')
      const allowedList = props.materialList.filter(material => material.u3m.status === U3M_STATUS.COMPLETED)
      const failedList = props.materialList.filter(material => material.u3m.status !== U3M_STATUS.COMPLETED)

      if (failedList.length > 0) {
        store.dispatch('helper/openModal', {
          component: 'modal-u3m-download-confirm',
          properties: {
            allowedList,
            failedList,
            selectedFormat: selectedFormat.value
          }
        })
      } else {
        props.materialList.forEach(material => {
          setTimeout(() => {
            const url = material.u3m[selectedFormat.value]
            const fileName = url.split('/')[url.split('/').length - 1]
            downloadDataURLFile(url, fileName)
          }, 0)
        })
        closeModal()
      }
    }

    const closeModal = () => {
      store.dispatch('helper/closeModal')
    }

    return {
      downloadU3m,
      selectedFormat,
      formatOptions,
      closeModal
    }
  }
}
</script>
