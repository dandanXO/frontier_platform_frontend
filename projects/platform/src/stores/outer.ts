import { defineStore } from 'pinia'
import receivedShareApi from '@/apis/receivedShare'
import embedApi from '@/apis/embed'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import type { ShareInfo } from '@frontier/platform-web-sdk'
import { ref } from 'vue'
import generalApi from '@/apis/general'

export const useOuterStore = defineStore('outer', () => {
  const ogBaseReceivedShareApi = useOgBaseApiWrapper(receivedShareApi)
  const ogBaseEmbedApi = useOgBaseApiWrapper(embedApi)

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
  }
})
