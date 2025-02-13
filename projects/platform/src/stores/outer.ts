import { defineStore } from 'pinia'
import receivedShareApi from '@/apis/receivedShare'
import embedApi from '@/apis/embed'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import type {
  ShareInfo,
  Material,
  NodeMeta,
  PrivateShareAccessInfo,
} from '@frontier/platform-web-sdk'
import { ref } from 'vue'
import { useSearchStore } from '@/stores/search'
import useNavigation from '@/composables/useNavigation'
import { useNotifyStore } from '@/stores/notify'
import { NOTIFY_TYPE } from '@frontier/constants'
import { OUTER_TYPE } from '@/utils/constants'

export const useOuterStore = defineStore('outer', () => {
  const ogBaseReceivedShareApi = useOgBaseApiWrapper(receivedShareApi)
  const ogBaseEmbedApi = useOgBaseApiWrapper(embedApi)
  const { getSearchLog } = useSearchStore()
  const { goToAssetMaterialDetail } = useNavigation()
  const notify = useNotifyStore()

  const outerType = ref<OUTER_TYPE>(OUTER_TYPE.RECEIVED_SHARE)
  const setOuterType = (type: OUTER_TYPE) => (outerType.value = type)

  const shareInfo = ref<ShareInfo>()
  const isPrivate = ref(false)
  const hasVerified = ref(false)
  const privateInfo = ref<PrivateShareAccessInfo>({
    email: '',
    accessCode: '',
  })
  const contactEmail = ref<string | null>(null)
  const getPrivateInfo = () => (isPrivate.value ? privateInfo.value : null)
  const checkIsPrivate = async (sharingKey: string) => {
    if (outerType.value === OUTER_TYPE.RECEIVED_SHARE) {
      const res = await receivedShareApi.checkReceiveShareIsPrivate({
        sharingKey,
      })
      isPrivate.value = res.data.result.isPrivate
      contactEmail.value = res.data.result.contactEmail
    }
    if (outerType.value === OUTER_TYPE.EMBED) {
      const res = await embedApi.checkEmbedIsPrivate({
        sharingKey,
      })
      isPrivate.value = res.data.result.isPrivate
      contactEmail.value = res.data.result.contactEmail
    }
  }

  const getReceivedShareInfo = async (sharingKey: string) => {
    const { data } = await ogBaseReceivedShareApi('getReceivedShareInfo', {
      sharingKey,
      privateInfo: getPrivateInfo(),
    })

    shareInfo.value = data.result.shareInfo
  }
  const getEmbedInfo = async (sharingKey: string) => {
    const { data } = await ogBaseEmbedApi('getEmbedInfo', {
      sharingKey,
      privateInfo: getPrivateInfo(),
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
      privateInfo: getPrivateInfo(),
    })

    material.value = data.result.workspaceNodeMaterial.material
    nodeMeta.value = data.result.workspaceNodeMaterial.nodeMeta
  }

  const hasSelectedStickerAddFromOG = ref(false)
  const setHasSelectedStickerAddFromOG = (bool: boolean) =>
    (hasSelectedStickerAddFromOG.value = bool)

  const getAssetsExternalMaterial = async (frontierNo: string) => {
    const { data } = await assetsApi.getAssetsExternalMaterial({
      frontierNo,
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
  const get3dViewShareInfo = async (shareCode: string) => {
    const { data } = await assetsApi.materialExternalPageGet3DViewShare({
      shareCode,
    })
    return data.result
  }
  return {
    get3dViewShareInfo,
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
    isPrivate,
    hasVerified,
    checkIsPrivate,
    privateInfo,
    getPrivateInfo,
    setOuterType,
    outerType,
    contactEmail,
  }
})
