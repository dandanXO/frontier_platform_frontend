<template lang="pug">
div(class="flex flex-col gap-10 items-start justify-start")
  //- Show if isActive
  call-to-action-card(
    v-if="!isActive"
    :title="$t('RR0459')"
    :description="$t('RR0460')"
    :explainText="$t('RR0453')"
    :actionText="$t('UU0064')"
    @explain="onShowGuide"
    @action="onUpgrade"
  )

  //- show if isActive but no data in StarTrust
  carbon-footprint-summary-card(
    v-if="isActive && !isCarbonFootprintData"
    :title="$t('RR0461')"
    :description="$t('RR0457')"
    :explainText="$t('RR0453')"
    :actionText="$t('RR0054')"
    @explain="onShowGuide"
    @action="redirectToStarTrust"
  )

  //- show if isActive and processing
  carbon-footprint-summary-card(
    v-if="isActive && isProcessingCarbonFootprintData"
    :title="$t('RR0461')"
    :description="$t('RR0458')"
    :explainText="$t('RR0453')"
    :actionText="$t('RR0054')"
    @explain="onShowGuide"
    @action="redirectToStarTrust"
    :data="carbonFootprintPendingData"
  )

  //- show if isActive and data is completed
  carbon-footprint-summary-card(
    v-if="isActive && isCarbonFootprintData"
    :title="$t('RR0461')"
    :description="$t('RR0066') + '•' + formattedDate"
    :explainText="$t('RR0453')"
    :actionText="$t('RR0054')"
    @explain="onShowGuide"
    @action="redirectToStarTrust"
    :data="carbonFootprintData"
  )
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import {
  GetAssetsMaterialCarbonFootprint200ResponseAllOfResultFootprintDataStatusIdEnum,
  type Material,
} from '@frontier/platform-web-sdk'
import { useConstants, VALUE_ADDED_SERVICE_STATUS } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'
import CallToActionCard from './internal/carbonFootprintCalculator/CallToActionCard.vue'
import CarbonFootprintSummaryCard from './internal/carbonFootprintCalculator/CarbonFootprintSummaryCard.vue'
import assetsApi from '@/apis/assets'

const STARTURST_URL = 'https://sustainability.frontier.cool/14067'
const NUMBER_OF_DECIMAL_PLACES = 2

const props = defineProps<{ material: Material }>()
const materialId = props.material.materialId
const itemNo = props.material.itemNo
const store = useStore()
const router = useRouter()
const { ogType, ogId } = useNavigation()
const { t } = useI18n()
const { FEEDBACK_CATEGORY } = useConstants()
// StarTrust Carbon Footprint Calculator
const valueAddedService = computed(
  () => store.getters['polling/valueAddedService']
)
const orgId = computed<number>(() => store.getters['organization/orgId'])
const { status } = valueAddedService.value.starTrust || {}

const isActive = computed(
  () => status?.id === VALUE_ADDED_SERVICE_STATUS.ACTIVATE
)

const redirectUrl = computed(() => {
  return `${STARTURST_URL}/re?token=${startTrustToken.value}&orgId=${ogType.value}-${orgId.value}&materialId=${materialId}&itemNo=${itemNo}`
})

const carbonFootprintPendingData = computed(() => {
  return {
    rawMaterial: 'pending',
    process: 'pending',
    distribution: 'pending',
    usage: 'pending',
    disposal: 'pending',
    total: 'pending',
  }
})

const formattedDate = computed(() => {
  const date = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())

  return `${date} at ${time}`
})

const carbonFootprintData = computed(() => {
  return {
    rawMaterial: rawMaterial.value,
    process: process.value,
    distribution: distribution.value,
    total: total.value,
    usage: NaN,
    disposal: NaN,
  }
})

const isCarbonFootprintData = ref(false)
const isProcessingCarbonFootprintData = ref(false)
const startTrustToken = ref('')
const rawMaterial = ref(0)
const process = ref(0)
const distribution = ref(0)
const total = ref(0)

const onShowGuide = () => {
  router.push({
    name: 'Billings', // Assuming 'Billings' is the name of the route for the billing page
    params: { tab: 'value-added-service' }, // Specify the tab you want to navigate to
    query: { scroll_to: 'cfc-guide' }, // Add any additional query parameters if needed
  })
}

const redirectToStarTrust = () => {
  window.open(redirectUrl.value, '_blank')
}
const onUpgrade = () => {
  const properties = isActive.value
    ? undefined
    : {
        title: t('UU0064'),
        category: FEEDBACK_CATEGORY.value.PAYMENT.value,
      }
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
    properties,
  })
}

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
