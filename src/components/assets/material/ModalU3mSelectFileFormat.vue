<template lang="pug">
div(class="w-68.5")
  div(class="mb-7.5 text-center text-primary text-h6 font-bold") {{$t('EE0080')}}
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

export default {
  name: 'ModalU3mSelectFileFormat',
  props: {
    material: {
      type: Object
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const formatOptions = [
      {
        name: t('EE0081'),
        value: props.material.u3m.zipUrl
      },
      {
        name: t('EE0082'),
        value: props.material.u3m.u3maUrl
      }
    ]
    const selectedFormat = ref(formatOptions[0].value)

    const downloadU3m = () => {
      downloadDataURLFile(selectedFormat.value, props.material.materialId)
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
