import publicLibraryApi from '@/apis/publicLibrary'
import { NODE_LOCATION } from '@/utils/constants'

const getWorkspaceCollectionState = () => ({
  workspaceNodeId: null,
  workspaceNodeLocation: NODE_LOCATION.ORG,
  collectionId: null,
  name: '',
  description: '',
  trendBoardCoverImg: '',
  trendBoardDisplayFileName: '',
  trendBoardUrl: '',
  isPublic: false,
  isCanShared: false,
  isCanClone: false,
  isCanDownloadU3M: false,
  publicDate: null,
  createDate: null,
  breadcrumbList: [],
  childCollectionList: [],
  childMaterialList: [],
  publish: {
    workspaceNodeId: null,
    workspaceNodeLocation: NODE_LOCATION.ORG,
    logo: '',
    displayName: '',
    publicDate: null,
    isCanClone: false,
    isCanDownloadU3M: false
  }
})

const state = getWorkspaceCollectionState()

const getters = {
  workspaceCollection: state => state,
  publishBy: state => state.publish?.displayName || ''
}

const actions = {
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

export default {
  namespaced: true,
  state,
  getters,
  actions
}
