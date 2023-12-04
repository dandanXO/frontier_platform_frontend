import { defineStore } from 'pinia'
import moodboardApi from '@/apis/moodboard'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export const useMoodboardStore = defineStore('moodboard', () => {
  const ogBaseMoodboardApi = useOgBaseApiWrapper(moodboardApi)

  return {
    ogBaseMoodboardApi,
  }
})
