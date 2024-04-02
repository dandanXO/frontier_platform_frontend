import { defineStore } from 'pinia'
import shareWithMeApi from '@/apis/shareWithMe'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export const useShareWithMeStore = defineStore('shareWithMe', () => {
  const ogBaseShareWithMeApi = useOgBaseApiWrapper(shareWithMeApi)

  return {
    ogBaseShareWithMeApi,
  }
})
