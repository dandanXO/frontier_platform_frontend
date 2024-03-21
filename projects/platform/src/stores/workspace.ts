import { defineStore } from 'pinia'
import workspaceApi from '@/apis/workspace'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { reactive } from 'vue'
import type {
  ShareWorkspaceNodeShareAddPeopleOGRequest,
  ShareWorkspaceNodeShareAddPeopleEmailRequest,
  GetWorkspaceNodeShareInfo200ResponseAllOfResult,
} from '@frontier/platform-web-sdk'

export const useWorkspaceStore = defineStore('workspace', () => {
  const ogBaseWorkspaceApi = useOgBaseApiWrapper(workspaceApi)

  const nodeShareInfo =
    reactive<GetWorkspaceNodeShareInfo200ResponseAllOfResult>({})

  const getWorkspaceNodeShareInfo = async (nodeId: number) => {
    const {
      data: { result },
    } = await ogBaseWorkspaceApi('getWorkspaceNodeShareInfo', {
      nodeId,
    })

    Object.assign(nodeShareInfo, result)
  }

  const shareWorkspaceNodeShareAddPeopleOG = async (
    params: Omit<
      ShareWorkspaceNodeShareAddPeopleOGRequest,
      'orgId' | 'ogId' | 'ogType'
    >
  ) => {
    const res = await ogBaseWorkspaceApi(
      'shareWorkspaceNodeShareAddPeopleOG',
      params
    )
    nodeShareInfo.ogShareList = res.data.result.ogShareList
  }

  const shareWorkspaceNodeShareAddPeopleEmail = async (
    params: Omit<
      ShareWorkspaceNodeShareAddPeopleEmailRequest,
      'orgId' | 'ogId' | 'ogType'
    >
  ) => {
    const res = await ogBaseWorkspaceApi(
      'shareWorkspaceNodeShareAddPeopleEmail',
      params
    )
    nodeShareInfo.emailShare = res.data.result.emailShare
  }

  return {
    ogBaseWorkspaceApi,
    getWorkspaceNodeShareInfo,
    shareWorkspaceNodeShareAddPeopleOG,
    shareWorkspaceNodeShareAddPeopleEmail,
    nodeShareInfo,
  }
})
