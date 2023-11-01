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
  f-tabs(ref="refTab" :tabList="tabList" :initValue="defaultTab" keyField="id")
    div(class="flex items-center gap-x-2 py-2.5")
      material-u3m-viewer-button(
        :key="currentTab"
        :materialId="materialId"
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
import { ref, computed } from 'vue'
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import { FTabs } from '@frontier/ui-component'
import MaterialU3mStatusBlock from '@/components/common/material/u3m/MaterialU3mStatusBlock.vue'
import MaterialU3mDownloadButton from '@/components/common/material/u3m/MaterialU3mDownloadButton.vue'
import MaterialU3mViewerButton from '@/components/common/material/u3m/MaterialU3mViewerButton.vue'
import u3mInstructionImage from '@/assets/images/u3m.png'
import { U3M_PROVIDER, U3M_STATUS, U3M_DOWNLOAD_PROP } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import useLogSender from '@/composables/useLogSender'
import { downloadDataURLFile } from '@frontier/lib'

const { t } = useI18n()
const logSender = useLogSender()

const props = withDefaults(
  defineProps<{
    materialId: number
    u3m: MaterialU3m
    customU3m: MaterialCustomU3m
    showStatusBlock?: boolean
  }>(),
  {
    showStatusBlock: true,
  }
)

const defaultTab = computed(() => {
  /**
   * define a default tab computed, and its value is decided by the following rules:
   * 1. if the status of u3m is completed, then the default tab is Frontier
   * 2. if the status fo custom u3 is completed, then the default tab is Customer
   * 3. if both of them are not completed, then the default tab is Frontier
   */

  if (props.u3m.status === U3M_STATUS.COMPLETED) {
    return U3M_PROVIDER.FRONTIER
  }

  if (props.customU3m.status === U3M_STATUS.COMPLETED) {
    return U3M_PROVIDER.CUSTOMER
  }

  return U3M_PROVIDER.FRONTIER
})

const refTab = ref<InstanceType<typeof FTabs>>()
const tabList = ref([
  {
    id: U3M_PROVIDER.FRONTIER,
    name: t('EE0174'),
  },
  {
    id: U3M_PROVIDER.CUSTOMER,
    name: t('EE0175'),
  },
])
const currentTab = computed<U3M_PROVIDER>(
  () => refTab.value?.currentTab || tabList.value[0].id
)

const selectedU3m = computed<MaterialU3m | MaterialCustomU3m>(() =>
  currentTab.value === U3M_PROVIDER.FRONTIER ? props.u3m : props.customU3m
)

const downloadHandler = (format: U3M_DOWNLOAD_PROP) => {
  const url = selectedU3m.value[format]!
  const fileName = url.split('/')[url.split('/').length - 1]
  downloadDataURLFile(url, fileName)
  logSender.createDownloadLog(props.materialId, format)
}
</script>
