import setVuexState from '@/utils/set-vuex-state'
import workspaceApi from '@/apis/workspace'
import { NODE_LOCATION } from '@/utils/constants'

const getWorkspaceCollectionState = () => ({
  workspaceNodeId: null,
  type: NODE_LOCATION.ORG,
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
  childMaterialList: []
})

const state = getWorkspaceCollectionState()

const getters = {
  workspaceCollection: state => state
}

const actions = {
  setWorkspace ({ state }, data) {
    setVuexState(state, data)
  },
  async getWorkspaceForModal ({ rootGetters }, { keyword, sort, targetPage = 1, workspaceNodeId, type }) {
    const params = {
      workspaceNodeId,
      type,
      search: {
        keyword,
        tagList: []
      },
      pagination: {
        perPageCount: 40,
        isShowMatch: false,
        sort: Number(sort),
        targetPage: Number(targetPage)
      }
    }

    if (!keyword) {
      params.search = null
    }

    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await workspaceApi.org.getWorkspaceForModal({ orgId: rootGetters['organization/orgId'], ...params })
      : await workspaceApi.group.getWorkspaceForModal({ groupId: rootGetters['group/groupId'], ...params })
    return data.result
  },
  async createCollectionForModal (_, { id, type, workspaceNodeId, collectionName }) {
    if (type === NODE_LOCATION.ORG) {
      await workspaceApi.org.createCollection({ orgId: id, workspaceNodeId, collectionName })
    } else {
      await workspaceApi.group.createCollection({ groupId: id, workspaceNodeId, collectionName })
    }
  },
  async createCollection ({ rootGetters }, { workspaceNodeId, collectionName, trendBoard = null, description = null }) {
    rootGetters['helper/routeLocation'] === 'org'
      ? await workspaceApi.org.createCollection({ orgId: rootGetters['organization/orgId'], workspaceNodeId, collectionName, trendBoard, description })
      : await workspaceApi.group.createCollection({ groupId: rootGetters['group/groupId'], workspaceNodeId, collectionName, trendBoard, description })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
