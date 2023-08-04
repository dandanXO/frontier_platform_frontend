<template lang="pug">
div
  div(class="flex items-center text-grey-900 pb-1.5")
    h5(class="text-h5 font-bold") {{ $t('RR0132') }}
    f-tooltip-media(
      class="ml-2"
      :tooltipTitle="$t('UU0029')"
      :tooltipMessage="$t('EE0066')"
      :imageUrl="u3mInstructionImage"
    )
      template(#slot:tooltip-trigger)
        f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
  f-tabs(ref="refTab" :tabList="tabList" keyField="id")
    div(class="flex items-center gap-x-2 py-2.5")
      material-u3m-viewer-button(
        :key="currentTab"
        :materialId="materialId"
        :u3m="selectedU3m"
      )
      material-u3m-download-button(
        :materialId="materialId"
        :u3m="selectedU3m"
        :downloadHandler="downloadHandler"
      )
    material-u3m-status-block(v-if="showStatusBlock" :u3m="selectedU3m")
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import FTabs from '@frontier/ui-component/src/FTabs/FTabs.vue'
import MaterialU3mStatusBlock from '@/components/common/material/u3m/MaterialU3mStatusBlock.vue'
import MaterialU3mDownloadButton from '@/components/common/material/u3m/MaterialU3mDownloadButton.vue'
import MaterialU3mViewerButton from '@/components/common/material/u3m/MaterialU3mViewerButton.vue'
import u3mInstructionImage from '@/assets/images/u3m.png'
import type { DownloadU3mPayload } from '@/types'
import { U3M_PROVIDER } from '@/utils/constants'

const props = withDefaults(
  defineProps<{
    materialId: number
    u3m: MaterialU3m
    customU3m: MaterialCustomU3m
    showStatusBlock?: boolean
    downloadHandler?: (payload: DownloadU3mPayload) => void
  }>(),
  {
    showStatusBlock: true,
  }
)
const refTab = ref<InstanceType<typeof FTabs>>()
const tabList = ref([
  {
    id: U3M_PROVIDER.FRONTIER,
    name: 'Created in Frontier',
  },
  {
    id: U3M_PROVIDER.CUSTOMER,
    name: 'Customized',
  },
])
const currentTab = computed<U3M_PROVIDER>(
  () => refTab.value?.currentTab || tabList.value[0].id
)

const selectedU3m = computed<MaterialU3m | MaterialCustomU3m>(() =>
  currentTab.value === U3M_PROVIDER.FRONTIER ? props.u3m : props.customU3m
)
</script>
