import { useRoute } from 'vue-router'
import { FeatureType } from '@frontier/platform-web-sdk'
import dashboardApi from '@/apis/dashboard'
import useCurrentUnit from '@/composables/useCurrentUnit'
import { CATEGORY } from '@/types'

const useLogSender = () => {
  const route = useRoute()
  const { unit } = useCurrentUnit()

  const getFeatureType = (): FeatureType => {
    if (route.path.match(/public-library|showroom/)) {
      return FeatureType.PUBLIC_LIBRARY
    }
    if (route.path.match(/assets|progress/)) {
      return FeatureType.ASSET
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

  const getBasedReq = () => ({
    orgId: unit.value.orgId,
    ogId: unit.value.ogId,
    ogType: unit.value.ogType,
  })

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
    const req = getBasedReq()
    await dashboardApi.createStickerTagFilterLog(req)
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
