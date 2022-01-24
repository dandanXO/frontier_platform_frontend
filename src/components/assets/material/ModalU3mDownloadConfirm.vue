<template lang="pug">
div(class="text-primary w-112")
  div(class="text-h6 font-bold max-w-84 mx-auto text-center mb-4") {{$t("EE0107")}}
  div(class="text-body2 max-w-84 mx-auto text-center mb-2.5") {{$t("EE0108")}}
  overlay-scrollbar-container(class="max-h-70 px-14")
    div(v-for="(material, index) in failedList" class="text-body2")
      div(class="flex py-2.5")
        div(class="font-bold w-29 text-center") {{index+1}}
        div {{material.frontierNo}}
      div(v-if="index !== failedList.length-1" class="w-full border-b text-black-400")
  btn-group(
    class="h-25"
    :secondaryButton="true"
    :primaryText="$t('UU0059')"
    @click:primary="downloadU3m"
    @click:secondary="clearModalPipeline"
  )
</template>

<script>
import { useStore } from 'vuex'
import { downloadDataURLFile } from '@/utils/fileOperator'

export default {
  name: 'ModalU3mDownloadConfirm',
  props: {
    allowedList: {
      type: Array
    },
    failedList: {
      type: Array
    },
    selectedFormat: {
      type: String
    }
  },
  setup (props) {
    const store = useStore()
    const downloadU3m = () => {
      props.allowedList.forEach(material => {
        setTimeout(() => {
          const url = material.u3m[props.selectedFormat]
          const fileName = url.split('/')[url.split('/').length - 1]
          downloadDataURLFile(url, fileName)
        }, 0)
      })
    }

    const clearModalPipeline = () => {
      store.dispatch('helper/clearModalPipeline')
    }

    return {
      downloadU3m,
      clearModalPipeline
    }
  }
}
</script>
