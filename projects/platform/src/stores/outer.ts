import { defineStore } from 'pinia'
import receivedShareApi from '@/apis/receivedShare'
import embedApi from '@/apis/embed'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import type { ShareInfo, Material, NodeMeta } from '@frontier/platform-web-sdk'
import { ref } from 'vue'
import { useSearchStore } from '@/stores/search'
import useNavigation from '@/composables/useNavigation'
import { useNotifyStore } from '@/stores/notify'
import { NOTIFY_TYPE } from '@frontier/constants'

export const useOuterStore = defineStore('outer', () => {
  const ogBaseReceivedShareApi = useOgBaseApiWrapper(receivedShareApi)
  const ogBaseEmbedApi = useOgBaseApiWrapper(embedApi)
  const { getSearchLog } = useSearchStore()
  const { goToAssetMaterialDetail } = useNavigation()
  const notify = useNotifyStore()

  const shareInfo = ref<ShareInfo>()
  const getReceivedShareInfo = async (sharingKey: string) => {
    const { data } = await ogBaseReceivedShareApi('getReceivedShareInfo', {
      sharingKey,
    })

    shareInfo.value = data.result.shareInfo
  }
  const getEmbedInfo = async (sharingKey: string) => {
    const { data } = await ogBaseEmbedApi('getEmbedInfo', {
      sharingKey,
    })

    shareInfo.value = data.result.shareInfo
  }

  const material = ref<Material>()
  const nodeMeta = ref<NodeMeta>()

  const getReceivedShareMaterial = async (
    sharingKey: string,
    nodeId: number
  ) => {
    const { data } = await ogBaseReceivedShareApi('getReceivedShareMaterial', {
      sharingKey,
      nodeId,
      searchLog: getSearchLog(),
    })

    material.value = data.result.workspaceNodeMaterial.material
    nodeMeta.value = data.result.workspaceNodeMaterial.nodeMeta
  }

  const hasSelectedStickerAddFromOG = ref(false)
  const setHasSelectedStickerAddFromOG = (bool: boolean) =>
    (hasSelectedStickerAddFromOG.value = bool)

  const getAssetsExternalMaterial = async (materialId: number) => {
    const { data } = await assetsApi.getAssetsExternalMaterial({
      materialId,
    })
    material.value = data.result.material
  }

  const checkIsMaterialOwner = async (
    materialId: number,
    showFalseMsg: boolean
  ) => {
    const { data } = await assetsApi.checkIsMaterialOwner({
      materialId,
    })
    const ownerInfo = data.result.ownerInfo

    if (ownerInfo) {
      const { orgNo, ogType, ogId } = ownerInfo
      goToAssetMaterialDetail(
        {
          orgNo,
          ogKey: `${ogType}-${ogId}`,
        },
        materialId
      )
    } else {
      if (showFalseMsg) {
        notify.showNotifySnackbar({
          notifyType: NOTIFY_TYPE.WARNING,
          messageText: 'only material owner can see the internal detail info',
        })
      }
    }
  }

  return {
    ogBaseReceivedShareApi,
    getReceivedShareInfo,
    ogBaseEmbedApi,
    getEmbedInfo,
    shareInfo,
    hasSelectedStickerAddFromOG,
    setHasSelectedStickerAddFromOG,
    getReceivedShareMaterial,
    getAssetsExternalMaterial,
    material,
    nodeMeta,
    checkIsMaterialOwner,
  }
})
