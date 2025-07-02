<template lang="pug">
div(class="flex flex-col gap-8 p-8")
  //- Header
  div(class="flex items-center justify-between")
    global-breadcrumb-list(
      :breadcrumbList="locationList"
      @click:item="$event?.goTo?.()"
      fontSize="text-h6"
    )
  material-detail-content(
    :material="material"
    :platformLocationType="PLATFORM_LOCATION_TYPE.INTERNAL"
    :locationList="locationList"
  )
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'

import { type Location } from '@/types'
import {
  GetAssetsMaterialCarbonFootprint200ResponseAllOfResultFootprintDataStatusIdEnum,
  type Material,
} from '@frontier/platform-web-sdk'
import { PLATFORM_LOCATION_TYPE } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'
import assetsApi from '@/apis/assets'
import MaterialDetailContent from './MaterialDetailContent.vue'

const props = defineProps<{
  material: Material
  locationList: Location[]
}>()
const store = useStore()

use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const orgId = computed<number>(() => store.getters['organization/orgId'])
const { ogId, ogType } = useNavigation()
const materialId = props.material.materialId
const startTrustToken = ref('')
const isCarbonFootprintData = ref(false)
const isProcessingCarbonFootprintData = ref(false)
const distribution = ref(0)
const total = ref(0)
const process = ref(0)
const rawMaterial = ref(0)
const NUMBER_OF_DECIMAL_PLACES = 2
const parseAndFormatNumber = (value: string) => {
  return Number(parseFloat(value).toFixed(NUMBER_OF_DECIMAL_PLACES))
}

onMounted(async () => {
  try {
    const response = await assetsApi.getAssetsMaterialCarbonFootprint({
      materialId: materialId,
      ogType: ogType.value,
      ogId: ogId.value,
      orgId: orgId.value,
    })

    const { data } = response

    const { stToken } = data.result
    const {
      status,
      co2DistributionStage,
      co2ProcessStage,
      co2RawMaterialStage,
    } = data.result.footprintData || {}

    startTrustToken.value = stToken ?? ''
    isCarbonFootprintData.value =
      status?.id ===
      GetAssetsMaterialCarbonFootprint200ResponseAllOfResultFootprintDataStatusIdEnum.Complete
    isProcessingCarbonFootprintData.value =
      status?.id ===
      GetAssetsMaterialCarbonFootprint200ResponseAllOfResultFootprintDataStatusIdEnum.InProgress
    distribution.value = parseAndFormatNumber(co2DistributionStage) ?? 0
    process.value = parseAndFormatNumber(co2ProcessStage) ?? 0
    rawMaterial.value = parseAndFormatNumber(co2RawMaterialStage) ?? 0
    total.value = distribution.value + process.value + rawMaterial.value
  } catch (error) {
    console.error('API call failed:', error)
  }
})
</script>

<style scoped>
.chart-container {
  width: 685px;
  height: 544px; /* Adjust the height as needed */
  margin: 0 auto; /* Center the chart horizontally */
  border-radius: 12px;
  @apply border border-grey-200-v1;
}
</style>
