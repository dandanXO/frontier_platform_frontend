<template lang="pug">
div
  div(class="flex items-center gap-x-2 pb-2")
    f-svg-icon(iconName="3D_material" size="20" class="text-grey-900")
    p(class="text-body2 font-bold text-grey-900") {{ $t('RR0132') }}
    f-tooltip-media(
      :tooltipTitle="$t('UU0029')"
      :tooltipMessage="$t('EE0066')"
      :imageUrl="u3mInstructionImage"
    )
      template(#slot:tooltip-trigger)
        f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
  f-tabs(
    ref="refTab"
    :tabList="tabList"
    :initValue="defaultTab(material)"
    keyField="id"
  )
    div(class="flex items-center gap-x-2 py-2.5")
      material-u3m-viewer-react-button(
        :key="currentTab"
        :material="material"
        :materialId="material.materialId"
        :u3m="selectedU3m"
      )
      material-u3m-download-button(
        :isMultiple="false"
        :status="selectedU3m.status"
        :hasPhysicalData="selectedU3m?.hasPhysicalData ?? false"
        @download="downloadHandler"
      )
    material-u3m-status-block(v-if="showStatusBlock" :u3m="selectedU3m")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  Material,
  MaterialCustomU3m,
  MaterialU3m,
} from '@frontier/platform-web-sdk'
import { FTabs } from '@frontier/ui-component'
import MaterialU3mStatusBlock from '@/components/common/material/u3m/MaterialU3mStatusBlock.vue'
import MaterialU3mDownloadButton from '@/components/common/material/u3m/MaterialU3mDownloadButton.vue'
import MaterialU3mViewerReactButton from '@/components/common/material/u3m/MaterialU3mViewerReactButton.vue'
import u3mInstructionImage from '@/assets/images/u3m.png'
import { U3M_PROVIDER, U3M_DOWNLOAD_PROP } from '@/utils/constants'
import useLogSender from '@/composables/useLogSender'
import { downloadDataURLFile } from '@frontier/lib'
import useU3mDownloadTabs from '@/composables/material/useU3mDownloadTabs'

const logSender = useLogSender()

const props = withDefaults(
  defineProps<{
    material: Material
    showStatusBlock?: boolean
  }>(),
  {
    showStatusBlock: true,
  }
)

const { refTab, tabList, currentTab, defaultTab } = useU3mDownloadTabs()

const selectedU3m = computed<MaterialU3m | MaterialCustomU3m>(() =>
  currentTab.value === U3M_PROVIDER.FRONTIER
    ? props.material.u3m
    : props.material.customU3m
)

const downloadHandler = (format: U3M_DOWNLOAD_PROP) => {
  const url = selectedU3m.value[format]!
  const fileName = url.split('/')[url.split('/').length - 1]
  downloadDataURLFile(url, fileName)
  logSender.createDownloadLog(props.material.materialId, format)
}
</script>
