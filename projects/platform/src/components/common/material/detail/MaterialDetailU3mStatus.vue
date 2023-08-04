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
    div(class="flex items-center gap-x-2 pt-2.5")
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
    div(
      v-if="showStatusBlock"
      class="mt-2 bg-grey-50 rounded py-2 px-4 box-border flex flex-col gap-y-2"
    )
      div(class="flex items-center gap-x-2")
        p(class="w-30 text-caption text-grey-600") {{ $t('PP0010') }}
        material-u3m-status-label(:status="selectedU3m.status")
        f-svg-icon(
          v-if="[U3M_STATUS.IN_QUEUE, U3M_STATUS.PROCESSING].includes(selectedU3m.status)"
          iconName="loading"
          size="16"
          class="text-primary-400"
        )
      div(
        v-if="selectedU3m.status === U3M_STATUS.COMPLETED"
        class="flex items-center gap-x-2"
      )
        p(class="w-30 text-caption text-grey-600") {{ $t('RR0188') }}
        div(class="flex items-center gap-x-3")
          f-avatar(
            :imageUrl="selectedU3m.creatorAvatar"
            type="user"
            :labelColor="selectedU3m.creatorUnitLabelColor"
            size="sm"
            :hasBorder="false"
          )
          div
            p(class="text-body2 text-grey-900 pb-1") {{ selectedU3m.creator }}
            p(class="text-caption text-grey-600") {{ toDigitalThreadDateFormat(selectedU3m.createDate) }}
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import FTabs from '@frontier/ui-component/src/FTabs/FTabs.vue'
import MaterialU3mStatusLabel from '@/components/common/material/u3m/MaterialU3mStatusLabel.vue'
import MaterialU3mDownloadButton from '@/components/common/material/u3m/MaterialU3mDownloadButton.vue'
import MaterialU3mViewerButton from '@/components/common/material/u3m/MaterialU3mViewerButton.vue'
import { U3M_STATUS } from '@/utils/constants'
import { toDigitalThreadDateFormat } from '@/utils/date'
import u3mInstructionImage from '@/assets/images/u3m.png'
import type { U3mDownloadFileItem } from '@/types'

const props = withDefaults(
  defineProps<{
    materialId: number
    u3m: MaterialU3m
    customU3m: MaterialCustomU3m
    showStatusBlock?: boolean
    downloadHandler?: (item: U3mDownloadFileItem) => void
  }>(),
  {
    showStatusBlock: true,
  }
)

enum U3M_PROVIDER {
  FRONTIER = 0,
  CUSTOMER = 1,
}
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
