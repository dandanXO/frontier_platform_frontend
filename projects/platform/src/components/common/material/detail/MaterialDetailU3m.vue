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
      f-tooltip-standard(
        :tooltipMessage="U3M_PROVIDER.FRONTIER === currentTab ? $t('EE0213') : $t('EE0212')"
        class=""
        :disabledTooltip="disabledTooltipErrorMessage()"
      )
        template(#slot:tooltip-trigger)
          material-u3m-viewer-react-button(
            v-if="store.getters['permission/isShowNew3DViewer']"
            :key="currentTab"
            :material="material"
            :materialId="material.materialId"
            :u3m="selectedU3m"
            :disabled="threeDViewerDisabledMap[U3M_PROVIDER.FRONTIER === currentTab ? U3M_PROVIDER.FRONTIER : U3M_PROVIDER.CUSTOMER]"
          )
          material-u3m-viewer-button(
            v-else
            :key="currentTab"
            :material="material"
            :materialId="material.materialId"
            :u3m="selectedU3m"
            :disabled="threeDViewerDisabledMap[U3M_PROVIDER.FRONTIER === currentTab ? U3M_PROVIDER.FRONTIER : U3M_PROVIDER.CUSTOMER]"
          )
      material-u3m-download-button(
        :isMultiple="false"
        :status="selectedU3m.status"
        :hasPhysicalData="selectedU3m?.hasPhysicalData ?? false"
        :hasZfab="selectedU3m.zfab?.status === ZfabStatus.COMPLETED"
        @download="downloadHandler"
      )
    material-u3m-status-block(v-if="showStatusBlock" :u3m="selectedU3m")
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, onMounted, reactive } from 'vue'
import type {
  Material,
  MaterialCustomU3m,
  MaterialU3m,
} from '@frontier/platform-web-sdk'
import { ZfabStatus } from '@frontier/platform-web-sdk'
import { FTabs } from '@frontier/ui-component'
import MaterialU3mStatusBlock from '@/components/common/material/u3m/MaterialU3mStatusBlock.vue'
import MaterialU3mDownloadButton from '@/components/common/material/u3m/MaterialU3mDownloadButton.vue'
import MaterialU3mViewerReactButton from '@/components/common/material/u3m/MaterialU3mViewerReactButton.vue'
import MaterialU3mViewerButton from '@/components/common/material/u3m/MaterialU3mViewerButton.vue'
import u3mInstructionImage from '@/assets/images/u3m.png'
import { U3M_PROVIDER, U3M_DOWNLOAD_PROP, U3M_STATUS } from '@/utils/constants'
import useLogSender from '@/composables/useLogSender'
import { downloadDataURLFile } from '@frontier/lib'
import useU3mDownloadTabs from '@/composables/material/useU3mDownloadTabs'
import { checkU3mImageExist } from '@/utils/3dViewer/checkU3mImageExist'

const logSender = useLogSender()
const store = useStore()
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
  const url =
    format === U3M_DOWNLOAD_PROP.ZFAB
      ? selectedU3m.value.zfab?.url
      : selectedU3m.value[format]
  if (!url) {
    return console.error(
      `url for ${props.material.materialId} and ${format} is not found`
    )
  }
  const fileName = url.split('/')[url.split('/').length - 1]
  downloadDataURLFile(url, fileName)
  logSender.createDownloadLog(props.material.materialId, format)
}

const threeDViewerDisabledMap: {
  [U3M_PROVIDER.FRONTIER]: boolean
  [U3M_PROVIDER.CUSTOMER]: boolean
} = reactive({
  1: false,
  2: false,
})
const disabledTooltipErrorMessage = () => {
  if (selectedU3m.value.status === U3M_STATUS.COMPLETED) {
    return !threeDViewerDisabledMap[
      U3M_PROVIDER.FRONTIER === currentTab.value
        ? U3M_PROVIDER.FRONTIER
        : U3M_PROVIDER.CUSTOMER
    ]
  } else {
    return true
  }
}

onMounted(async () => {
  threeDViewerDisabledMap[U3M_PROVIDER.FRONTIER] = await checkU3mImageExist(
    props.material?.u3m
  )
  threeDViewerDisabledMap[U3M_PROVIDER.CUSTOMER] = await checkU3mImageExist(
    props.material?.customU3m
  )
})
</script>
