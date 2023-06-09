<template lang="pug">
div(
  v-if="material.u3m.status === U3M_STATUS.COMPLETED"
  class="flex text-body2 text-cyan-400 gap-4 ml-4"
)
  span(
    v-for="item in items"
    :key="item.name"
    class="inline-flex items-center underline cursor-pointer"
    @click="downloadU3m(item)"
  ) {{ item.name }}
    f-svg-icon(iconName="download" size="20")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { U3M_STATUS } from '@/utils/constants'
import { downloadDataURLFile } from '@/utils/fileOperator'
import { useDashboardStore } from '@/stores/dashboard'
import type { Material } from '@/types'

interface FileItem {
  name: string
  url: string
  format: 'zipUrl' | 'u3maUrl' | 'gltfUrl'
}

const props = defineProps<{
  material: Material
  downloadU3m?: (item: FileItem) => void
}>()

const { t } = useI18n()
const dashboard = useDashboardStore()

const items = computed<FileItem[]>(() => [
  { name: t('UU0005'), url: props.material.u3m.zipUrl, format: 'zipUrl' },
  { name: t('UU0058'), url: props.material.u3m.u3maUrl, format: 'u3maUrl' },
  { name: t('UU0129'), url: props.material.u3m.gltfUrl, format: 'gltfUrl' },
])

const defaultDownloadU3m = async (item: FileItem) => {
  const fileName = item.url.split('/')[item.url.split('/').length - 1]
  downloadDataURLFile(item.url, fileName)
  dashboard.createDownloadLog(props.material.materialId, item.format)
}

const downloadU3m = props.downloadU3m || defaultDownloadU3m
</script>
