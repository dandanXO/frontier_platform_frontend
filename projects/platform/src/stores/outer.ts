import { defineStore } from 'pinia'
import receivedShareApi from '@/apis/receivedShare'
import embedApi from '@/apis/embed'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import type { ShareInfo, Material, NodeMeta } from '@frontier/platform-web-sdk'
import { ref } from 'vue'
import generalApi from '@/apis/general'
import { useSearchStore } from '@/stores/search'
import { useStore } from 'vuex'

export const useOuterStore = defineStore('outer', () => {
  const store = useStore()
  const ogBaseReceivedShareApi = useOgBaseApiWrapper(receivedShareApi)
  const ogBaseEmbedApi = useOgBaseApiWrapper(embedApi)
  const { getSearchLog } = useSearchStore()

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

  const hasLogin = ref(false)
  const checkHasLogin = async () => {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      hasLogin.value = false
      return
    }

    const { data } = await generalApi.checkTokenStatus({
      accessToken,
    })
    hasLogin.value = data.result.status !== 1

    if (hasLogin.value) {
      await store.dispatch('user/getUser')
    }
  }

  const hasSelectedStickerAddFromOG = ref(false)
  const setHasSelectedStickerAddFromOG = (bool: boolean) =>
    (hasSelectedStickerAddFromOG.value = bool)

  return {
    ogBaseReceivedShareApi,
    getReceivedShareInfo,
    ogBaseEmbedApi,
    getEmbedInfo,
    shareInfo,
    hasLogin,
    checkHasLogin,
    hasSelectedStickerAddFromOG,
    setHasSelectedStickerAddFromOG,
    getReceivedShareMaterial,
    material,
    nodeMeta,
  }
})
