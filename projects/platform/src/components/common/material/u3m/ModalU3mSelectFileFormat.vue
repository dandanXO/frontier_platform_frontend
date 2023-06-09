<template lang="pug">
modal-behavior(
  :header="$t('EE0080')"
  :primaryBtnText="$t('UU0059')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="downloadU3m"
  @click:secondary="closeModal"
)
  div(class="w-58.5")
    f-input-radio-group(
      v-model:inputValue="selectedFormat"
      :optionList="formatOptions"
      required
    )
</template>

<script setup>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { downloadDataURLFile } from '@/utils/fileOperator'
import { U3M_STATUS } from '@/utils/constants'

const props = defineProps({
  materialList: {
    type: Array,
  },
})

const { t } = useI18n()
const store = useStore()
const dashboard = useDashboardStore()

const formatOptions = [
  {
    name: t('UU0005'),
    value: 'zipUrl',
  },
  {
    name: t('UU0058'),
    value: 'u3maUrl',
  },
  {
    name: t('UU0129'),
    value: 'gltfUrl',
  },
]
const selectedFormat = ref(formatOptions[0].value)

const downloadU3m = () => {
  store.dispatch('helper/openModalLoading')
  const allowedList = props.materialList.filter(
    (material) => material.u3m.status === U3M_STATUS.COMPLETED
  )
  const failedList = props.materialList.filter(
    (material) => material.u3m.status !== U3M_STATUS.COMPLETED
  )

  if (failedList.length > 0) {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-u3m-download-confirm',
      properties: {
        allowedList,
        failedList,
        selectedFormat: selectedFormat.value,
      },
    })
  } else {
    props.materialList.forEach((material) => {
      setTimeout(() => {
        const url = material.u3m[selectedFormat.value]
        const fileName = url.split('/')[url.split('/').length - 1]
        downloadDataURLFile(url, fileName)
        dashboard.createDownloadLog(material.materialId, selectedFormat.value)
      }, 0)
    })
    closeModal()
  }
}

const closeModal = () => {
  store.dispatch('helper/closeModal')
}
</script>
