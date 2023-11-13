import { defineStore } from 'pinia'
import shareToMeApi from '@/apis/shareToMe'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export const useShareToMeStore = defineStore('shareToMe', () => {
  const ogBaseShareToMeApi = useOgBaseApiWrapper(shareToMeApi)

  return {
    ogBaseShareToMeApi,
  }
})
