<template lang="pug">
div(
  v-if="u3m.status === U3M_STATUS.COMPLETED"
  class="flex text-body2 text-cyan-400 gap-4 ml-4"
)
  span(
    v-for="item in items"
    :key="item.name"
    class="inline-flex items-center underline cursor-pointer"
    @click="downloadU3m(item.url)"
  ) {{ item.name }}
    f-svg-icon(iconName="u3m_download" size="20")
</template>

<script setup>
import { U3M_STATUS } from '@/utils/constants'
import { downloadDataURLFile } from '@/utils/fileOperator'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  u3m: {
    type: Object,
    required: true,
  },
  downloadU3m: {
    type: Function,
  },
})

const { t } = useI18n()

const defaultDownloadU3m = async (url) => {
  const fileName = url.split('/')[url.split('/').length - 1]
  downloadDataURLFile(url, fileName)
}

const downloadU3m = props.downloadU3m || defaultDownloadU3m

const items = [
  { name: t('UU0005'), url: props.u3m.zipUrl },
  { name: t('UU0058'), url: props.u3m.zipUrl },
  { name: t('UU0129'), url: props.u3m.gltfUrl },
]
</script>
