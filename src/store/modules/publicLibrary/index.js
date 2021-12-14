import WorkspaceNode from '@/store/reuseModules/workspaceNode'
import publicLibraryApi from '@/apis/publicLibrary'
import { NODE_LOCATION } from '@/utils/constants'

export default {
  namespaced: true,
  state: () => ({
    ...WorkspaceNode.state(),
    publish: {
      workspaceNodeId: null,
      workspaceNodeLocation: NODE_LOCATION.ORG,
      logo: '',
      displayName: '',
      publicDate: null,
      isCanClone: false,
      isCanDownloadU3M: false
    }
  }),
  getters: {
    ...WorkspaceNode.getters,
    publishBy: state => state.publish?.displayName || ''
  },
  actions: {
    ...WorkspaceNode.actions,
    setPublicLibrary ({ state }, data) {
      Object.assign(state, data)
    },
    async getPublicList ({ rootGetters, dispatch }, { targetPage = 1, workspaceNodeId, workspaceNodeLocation }) {
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        workspaceNodeId,
        workspaceNodeLocation,
        ...searchParams
      }

      const { data } = await publicLibraryApi.getPublicList(params)

      dispatch('handleResponseData', { data }, { root: true })
    },
    async getPublicMaterial ({ dispatch }, { workspaceNodeId, workspaceNodeLocation }) {
      const { data } = await publicLibraryApi.getPublicMaterial({ workspaceNodeId, workspaceNodeLocation })
      dispatch('handleResponseData', { data }, { root: true })
      return data.result
    },
    async cloneNode (_, { workspaceNodeList, targetLocationList }) {
      await publicLibraryApi.cloneNode({ workspaceNodeList, targetLocationList })
    }
  }
}
