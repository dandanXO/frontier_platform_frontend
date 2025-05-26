import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  Dashboard,
  DashboardTextureCountsInner,
  DashboardFabricKeywordCounts,
  DashboardEcoImpactorInformation,
  DashboardGetSummary200ResponseResult,
} from '@frontier/platform-web-sdk'
import dashboardApi from '@/apis/dashboard'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { type WorkspaceFilter } from '@frontier/platform-web-sdk'
import { type FilterState } from './filter'

export const useDashboardStore = defineStore('dashboard', () => {
  function formatChartData<T>(rawData: T): T {
    rawData.series.forEach((item: any) => {
      if (chooseCountryType.value === 'public') {
        item.data = item.publicData
      } else {
        item.data = item.privateData
      }
      return item
    })
    return rawData
  }
  const ogBaseDashboardApi = useOgBaseApiWrapper(dashboardApi)

  const createCounts = ref()
  const textureCounts = ref<DashboardTextureCountsInner[]>()
  const fabricKeywordCounts = ref<DashboardFabricKeywordCounts>()
  const ecoImpactorInformation = ref<DashboardEcoImpactorInformation>()
  const materialContentCategoryList = ref()
  const materialTypeOfCountryList = ref()
  const chooseCountryType = ref<'public' | 'private' | null>('private')
  const getDashboard = async (filters?: FilterState) => {
    try {
      const { data } = await ogBaseDashboardApi('getDashboard', {
        filters,
      })

      const dashboard = data.result as Dashboard
      textureCounts.value = dashboard.textureCounts
      fabricKeywordCounts.value = dashboard.fabricKeywordCounts
      ecoImpactorInformation.value = dashboard.ecoImpactorInformation
    } catch {
      // do nothing
    }
  }

  const switchMaterialTypeOfCountryList = (type: 'public' | 'private') => {
    chooseCountryType.value = type
    materialTypeOfCountryList.value = formatChartData(
      materialTypeOfCountryList.value
    )
  }

  const getDashboardSummary = async (filters?: FilterState) => {
    try {
      const { data } = await ogBaseDashboardApi(
        'dashboardGetSummary',
        {
          filter: filters as unknown as WorkspaceFilter,
          search: null,
        },
        { meta: { suppressGlobal404Popup: true } } as any
      )

      const dashboard = data.result as DashboardGetSummary200ResponseResult
      createCounts.value = dashboard.createCounts

      materialContentCategoryList.value = dashboard.materialContentCategoryList

      materialTypeOfCountryList.value = formatChartData(
        dashboard.materialTypeOfCountryList
      )
    } catch (error) {
      console.error('Failed to get dashboard summary:', error)
    }
  }

  return {
    materialContentCategoryList,
    materialTypeOfCountryList,
    getDashboardSummary,
    getDashboard,
    createCounts,
    textureCounts,
    ecoImpactorInformation,
    fabricKeywordCounts,
    chooseCountryType,
    switchMaterialTypeOfCountryList,
  }
})
