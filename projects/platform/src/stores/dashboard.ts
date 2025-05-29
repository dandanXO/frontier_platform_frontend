import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  Dashboard,
  DashboardTextureCountsInner,
  DashboardFabricKeywordCounts,
  DashboardEcoImpactorInformation,
  DashboardGetSummary200ResponseResult,
  DashboardGetSummary200ResponseResultMaterialTypeOfCountryList,
  DashboardGetSummary200ResponseResultMaterialTypeOfCountryListSeriesInner,
} from '@frontier/platform-web-sdk'
import dashboardApi from '@/apis/dashboard'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { type WorkspaceFilter } from '@frontier/platform-web-sdk'
import { type FilterState } from './filter'

// Define the shape of the API response series item
interface ApiSeriesItem extends DashboardGetSummary200ResponseResultMaterialTypeOfCountryListSeriesInner {
  publicData: number[]
  privateData: number[]
}

// Define the shape of the transformed data
interface TransformedChartData {
  categories: string[]
  series: ApiSeriesItem[]
}

export const useDashboardStore = defineStore('dashboard', () => {
  const ogBaseDashboardApi = useOgBaseApiWrapper(dashboardApi)

  const createCounts = ref()
  const textureCounts = ref<DashboardTextureCountsInner[]>()
  const fabricKeywordCounts = ref<DashboardFabricKeywordCounts>()
  const ecoImpactorInformation = ref<DashboardEcoImpactorInformation>()
  const materialContentCategoryList = ref()
  const rawMaterialTypeOfCountryList = ref<TransformedChartData>()
  const chooseCountryType = ref<'public' | 'private' | null>('private')

  // Computed property for transformed data
  const materialTypeOfCountryList = computed(() => {
    if (!rawMaterialTypeOfCountryList.value?.series) {
      return null
    }
    
    // Transform the data once and cache it
    const transformedData = {
      ...rawMaterialTypeOfCountryList.value,
      series: rawMaterialTypeOfCountryList.value.series.map(item => ({
        ...item,
        data: chooseCountryType.value === 'public' ? item.publicData : item.privateData
      }))
    }

    return transformedData
  })

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
  }

  const getDashboardSummary = async (filters?: FilterState) => {
    try {
      const { data } = await ogBaseDashboardApi(
        'dashboardGetSummary',
        {
          filter: filters as unknown as WorkspaceFilter,
        },
        { meta: { suppressGlobal404Popup: true } } as any
      )

      const dashboard = data.result as DashboardGetSummary200ResponseResult
      createCounts.value = dashboard.createCounts
      materialContentCategoryList.value = dashboard.materialTypeOfContentCategoryList
      rawMaterialTypeOfCountryList.value = dashboard.materialTypeOfCountryList as unknown as TransformedChartData
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
