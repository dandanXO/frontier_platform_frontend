import { defineStore } from 'pinia'
import workspaceApi from '@/apis/workspace'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { ref } from 'vue'
import type {
  ShareTarget,
  AddWorkspaceNodeShareAssignedRequest,
} from '@frontier/platform-web-sdk'

export const useWorkspaceStore = defineStore('workspace', () => {
  const ogBaseWorkspaceApi = useOgBaseApiWrapper(workspaceApi)

  const shareList = ref<
    (ShareTarget & {
      id: number
      isCanClone: boolean
      isCanDownloadU3M: boolean
    })[]
  >([])
  const embed = ref<{
    isCanDownloadU3M: boolean
    key: string
  }>()
  const isCanShared = ref(false)

  const getWorkspaceNodeShareInfo = async (nodeId: number) => {
    const {
      data: { result },
    } = await ogBaseWorkspaceApi('getWorkspaceNodeShareInfo', {
      nodeId,
    })

    shareList.value = result.shareList
    embed.value = result.embed
    isCanShared.value = result.isCanShared
  }

  const addWorkspaceNodeShareAssigned = async (
    params: Omit<
      AddWorkspaceNodeShareAssignedRequest,
      'orgId' | 'ogId' | 'ogType'
    >
  ) => {
    const res = await ogBaseWorkspaceApi(
      'addWorkspaceNodeShareAssigned',
      params
    )
    shareList.value = res.data.result.shareList
  }

  return {
    ogBaseWorkspaceApi,
    shareList,
    embed,
    isCanShared,
    getWorkspaceNodeShareInfo,
    addWorkspaceNodeShareAssigned,
  }
})
