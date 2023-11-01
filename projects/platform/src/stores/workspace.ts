import { defineStore } from 'pinia'
import workspaceApi from '@/apis/workspace'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export const useWorkspaceStore = defineStore('workspace', () => {
  const ogBaseWorkspaceApi = useOgBaseApiWrapper(workspaceApi)

  return {
    ogBaseWorkspaceApi,
  }
})
