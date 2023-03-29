import { useRoute } from 'vue-router'
import dashboardApi from '@/apis/dashboard'
import { CATEGORY, FROM_LOCATION_TYPE } from '@/types'

const useDashboard = () => {
  const route = useRoute()

  const getLocationType = (): FROM_LOCATION_TYPE => {
    if (route.path.match(/public-library|titas/)) {
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

  const createDownloadLog = (materialId: number, selectedFormat: string) =>
    dashboardApi.createDownloadLog({
      materialId,
      category: getCategory(selectedFormat),
      fromLocationType: getLocationType(),
    })

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
    createDownloadLog,
    createEmbedPageLog,
    createReceivePageLog,
    createViewerLog,
  }
}

export default useDashboard
