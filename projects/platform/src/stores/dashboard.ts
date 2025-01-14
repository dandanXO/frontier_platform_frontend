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
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export const useDashboardStore = defineStore('dashboard', () => {
  const ogBaseDashboardApi = useOgBaseApiWrapper(dashboardApi)

  const createCounts = ref<DashboardCreateCounts>()
  const textureCounts = ref<DashboardTextureCountsInner[]>()
  const fabricKeywordCounts = ref<DashboardFabricKeywordCounts>()
  const ecoImpactorInformation = ref<DashboardEcoImpactorInformation>()

  const getDashboard = async () => {
    try {
      const { data } = await ogBaseDashboardApi('getDashboard')

      const dashboard = data.result as Dashboard
      createCounts.value = dashboard.createCounts
      textureCounts.value = dashboard.textureCounts
      fabricKeywordCounts.value = dashboard.fabricKeywordCounts
      ecoImpactorInformation.value = dashboard.ecoImpactorInformation
    } catch {
      // do nothing
    }
  }

  return {
    getDashboard,
    createCounts,
    textureCounts,
    ecoImpactorInformation,
    fabricKeywordCounts,
  }
})
