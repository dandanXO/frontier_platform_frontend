import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  Dashboard,
  DashboardCreateCounts,
  DashboardTextureCountsInner,
  DashboardFabricKeywordCounts,
  DashboardEcoImpactorInformation,
} from '@frontier/platform-web-sdk'
import dashboardApi from '@/apis/dashboard'
import useCurrentUnit from '@/composables/useCurrentUnit'

export const useDashboardStore = defineStore('dashboard', () => {
  // Management - Dashboard Page
  const { unit } = useCurrentUnit()

  const createCounts = ref<DashboardCreateCounts>()
  const textureCounts = ref<DashboardTextureCountsInner[]>()
  const fabricKeywordCounts = ref<DashboardFabricKeywordCounts>()
  const ecoImpactorInformation = ref<DashboardEcoImpactorInformation>()

  const getBasedReq = () => ({
    orgId: unit.value.orgId,
    ogId: unit.value.ogId,
    ogType: unit.value.ogType,
  })

  const getDashboard = async () => {
    const req = getBasedReq()
    const { data } = await dashboardApi.getDashboard(req)

    const dashboard = data.result as Dashboard
    createCounts.value = dashboard.createCounts
    textureCounts.value = dashboard.textureCounts
    fabricKeywordCounts.value = dashboard.fabricKeywordCounts
    ecoImpactorInformation.value = dashboard.ecoImpactorInformation
  }

  return {
    getDashboard,
    createCounts,
    textureCounts,
    ecoImpactorInformation,
    fabricKeywordCounts,
  }
})
