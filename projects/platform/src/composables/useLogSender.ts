import { useRoute } from 'vue-router'
import { FeatureType } from '@frontier/platform-web-sdk'
import dashboardApi from '@/apis/dashboard'
import { U3M_FILE_TYPE, U3M_DOWNLOAD_PROP } from '@/utils/constants'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

const useLogSender = () => {
  const ogBaseDashboardApi = useOgBaseApiWrapper(dashboardApi)
  const route = useRoute()

  const getFeatureType = (): FeatureType => {
    if (route.path.match(/public-library|showroom/)) {
      return FeatureType.PUBLIC_LIBRARY
    }
    if (route.path.match(/assets|progress/)) {
      return FeatureType.ASSETS
    }
    if (route.path.includes('workspace')) {
      return FeatureType.WORKSPACE
    }
    if (route.path.includes('moodboard')) {
      return FeatureType.MOODBOARD
    }
    if (route.path.includes('share-to-me')) {
      return FeatureType.SHARED_WITH_ME
    }
    if (route.path.includes('received-share')) {
      return FeatureType.RECEIVED_SHARE
    }
    if (route.path.includes('embed')) {
      return FeatureType.EMBED
    }
    throw new Error('unexpected error')
  }

  const createDownloadLog = (materialId: number, selectedFormat: string) => {
    const getCategory = (selectedFormat: string): U3M_FILE_TYPE => {
      switch (selectedFormat) {
        case U3M_DOWNLOAD_PROP.U3M:
          return U3M_FILE_TYPE.U3M
        case U3M_DOWNLOAD_PROP.U3MA:
          return U3M_FILE_TYPE.U3MA
        case U3M_DOWNLOAD_PROP.GLTF:
          return U3M_FILE_TYPE.GLTF
        default:
          throw new Error('unexpected error')
      }
    }
    return dashboardApi.createDownloadLog({
      materialId,
      category: getCategory(selectedFormat),
      fromLocationType: getFeatureType(),
    })
  }

  const createEmbedPageLog = (sharingKey: string) =>
    dashboardApi.createEmbedPageLog({ sharingKey })

  const createReceivePageLog = (sharingKey: string) =>
    dashboardApi.createReceivePageLog({ sharingKey })

  const createViewerLog = (materialId: number) => {
    return dashboardApi.createViewerLog({
      materialId,
      fromLocationType: getFeatureType(),
    })
  }

  const createStickerTagFilterLog = async () => {
    await ogBaseDashboardApi('createStickerTagFilterLog')
  }

  return {
    createViewerLog,
    createDownloadLog,
    createReceivePageLog,
    createEmbedPageLog,
    createStickerTagFilterLog,
  }
}

export default useLogSender
