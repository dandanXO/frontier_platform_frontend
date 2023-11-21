import { defineStore } from 'pinia'
import progressApi from '@/apis/progress'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export const useProgressStore = defineStore('progress', () => {
  const ogBaseProgressApi = useOgBaseApiWrapper(progressApi)

  return {
    ogBaseProgressApi,
  }
})
