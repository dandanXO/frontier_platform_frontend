import { defineStore } from 'pinia'
import publicLibraryApi from '@/apis/publicLibrary'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export const usePublicLibraryStore = defineStore('publicLibrary', () => {
  const ogBasePublicLibraryApi = useOgBaseApiWrapper(publicLibraryApi)
  return {
    ogBasePublicLibraryApi,
  }
})
