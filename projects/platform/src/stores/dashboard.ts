import { defineStore } from 'pinia'
import dashboardApi from '@/apis/dashboard'
import { CATEGORY, FROM_LOCATION_TYPE } from '@/types'
import { useRoute } from 'vue-router'
import useCurrentUnit from '@/composables/useCurrentUnit'
import type {
  Dashboard,
  DashboardCreateCounts,
  DashboardTextureCountsInner,
  DashboardFabricKeywordCounts,
  DashboardEcoImpactorInformation,
} from '@frontier/platform-web-sdk'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  // Management - Dashboard Page
  const { unit } = useCurrentUnit()

  const createCounts = ref<DashboardCreateCounts>()
  const textureCounts = ref<DashboardTextureCountsInner[]>()
  const fabricKeywordCounts = ref<DashboardFabricKeywordCounts>()
  const ecoImpactorInformation = ref<DashboardEcoImpactorInformation>()

  const getDashboard = async () => {
    const { data } = await dashboardApi.getDashboard({
      orgId: unit.value.orgId,
      ogId: unit.value.ogId,
      ogType: unit.value.ogType,
    })

    const dashboard = data.result as Dashboard
    createCounts.value = dashboard.createCounts
    textureCounts.value = dashboard.textureCounts
    fabricKeywordCounts.value = dashboard.fabricKeywordCounts
    ecoImpactorInformation.value = dashboard.ecoImpactorInformation
  }

  // log
  const route = useRoute()
  const getLocationType = (): FROM_LOCATION_TYPE => {
    if (route.path.match(/public-library|showroom/)) {
      return FROM_LOCATION_TYPE.PUBLIC_LIBRARY
    }
    if (route.path.match(/assets|progress/)) {
      return FROM_LOCATION_TYPE.ASSET
    }
    if (route.path.includes('workspace')) {
      return FROM_LOCATION_TYPE.WORKSPACE
    }
    if (route.path.includes('moodboard')) {
      return FROM_LOCATION_TYPE.MOODBOARD
    }
    if (route.path.includes('share-to-me')) {
      return FROM_LOCATION_TYPE.SHARED_WITH_ME
    }
    if (route.path.includes('received-share')) {
      return FROM_LOCATION_TYPE.SHARED_RECEIVE_PAGE
    }
    if (route.path.includes('embed')) {
      return FROM_LOCATION_TYPE.EMBED
    }
    throw new Error('unexpected error')
  }

  const createDownloadLog = (materialId: number, selectedFormat: string) => {
    const getCategory = (selectedFormat: string): CATEGORY => {
      switch (selectedFormat) {
        case 'zipUrl':
          return CATEGORY.U3M
        case 'u3maUrl':
          return CATEGORY.U3MA
        case 'gltfUrl':
          return CATEGORY.GLTF
        default:
          throw new Error('unexpected error')
      }
    }
    return dashboardApi.createDownloadLog({
      materialId,
      category: getCategory(selectedFormat),
      fromLocationType: getLocationType(),
    })
  }

  const createEmbedPageLog = (sharingKey: string) =>
    dashboardApi.createEmbedPageLog({ sharingKey })

  const createReceivePageLog = (sharingKey: string) =>
    dashboardApi.createReceivePageLog({ sharingKey })

  const createViewerLog = (materialId: number) =>
    dashboardApi.createViewerLog({
      materialId,
      fromLocationType: getLocationType(),
    })

  return {
    getDashboard,
    createCounts,
    textureCounts,
    ecoImpactorInformation,
    fabricKeywordCounts,
    createViewerLog,
    createDownloadLog,
    createReceivePageLog,
    createEmbedPageLog,
  }
})
