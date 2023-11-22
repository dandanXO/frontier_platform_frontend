import { defineStore } from 'pinia'
import showroomApi from '@/apis/showroom'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export const useShowroomStore = defineStore('showroom', () => {
  const ogBaseShowroomApi = useOgBaseApiWrapper(showroomApi)

  return {
    ogBaseShowroomApi,
  }
})
