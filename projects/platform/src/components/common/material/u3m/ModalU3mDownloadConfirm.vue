<template lang="pug">
modal-behavior(
  :header="$t('EE0107')"
  :primaryBtnText="$t('UU0059')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="downloadU3m"
  @click:secondary="clearModalPipeline"
)
  div(class="w-94")
    div(class="text-grey-900 text-caption mb-2.5 leading-1.6") {{ $t('EE0108') }}
    f-scrollbar-container(class="max-h-89.5 -mx-5 px-5")
      div(
        v-for="(material, index) in failedList"
        :key="material.materialId"
        class="flex gap-3 border-grey-250 py-2.5 text-body2 text-grey-900 leading-1.6"
        :class="{ 'border-b': index !== failedList.length - 1 }"
      )
        div(class="w-31 pl-15 font-bold flex-shrink-0") {{ index + 1 }}
        div {{ material.materialNo }}
</template>

<script>
import { useStore } from 'vuex'
import { downloadDataURLFile } from '@/utils/fileOperator'
import useLogSender from '@/composables/useLogSender'

export default {
  name: 'ModalU3mDownloadConfirm',
  props: {
    allowedList: {
      type: Array,
    },
    failedList: {
      type: Array,
    },
    selectedFormat: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore()
    const logSender = useLogSender()
    const downloadU3m = () => {
      props.allowedList.forEach((material) => {
        setTimeout(() => {
          const url = material.u3m[props.selectedFormat]
          const fileName = url.split('/')[url.split('/').length - 1]
          downloadDataURLFile(url, fileName)
          logSender.createDownloadLog(material.materialId, props.selectedFormat)
        }, 0)
      })
    }

    const clearModalPipeline = () => {
      store.dispatch('helper/clearModalPipeline')
    }

    return {
      downloadU3m,
      clearModalPipeline,
    }
  },
}
</script>
