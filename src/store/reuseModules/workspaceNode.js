import { NODE_LOCATION, NODE_TYPE } from '@/utils/constants'

const WorkspaceNode = {
  state: () => ({
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
    childMaterialList: []
  }),
  getters: {
    defaultWorkspaceNodeId: (state, getters, rootState, rootGetters) => {
      return rootGetters['helper/routeLocation'] === 'org'
        ? rootGetters['organization/organization'].workspaceNodeId
        : rootGetters['group/group'].workspaceNodeId
    },
    defaultWorkspaceNodeLocation: (state, getters, rootState, rootGetters) => {
      return rootGetters['helper/routeLocation'] === 'org'
        ? NODE_LOCATION.ORG
        : NODE_LOCATION.GROUP
    },
    workspaceCollection: state => state,
    nodeList: state => {
      const { childCollectionList, childMaterialList } = state
      const list = []

      if (childCollectionList.length > 0) {
        childCollectionList.forEach(collection => {
          list.push({
            key: `${collection.workspaceNodeLocation}-${collection.workspaceNodeId}`,
            nodeType: NODE_TYPE.COLLECTION,
            data: collection
          })
        })
      }

      if (childMaterialList.length > 0) {
        childMaterialList.forEach(material => {
          list.push({
            key: `${material.workspaceNodeLocation}-${material.workspaceNodeId}`,
            nodeType: NODE_TYPE.MATERIAL,
            data: material
          })
        })
      }

      return list
    },
    breadcrumbList: (state) => (rootItem) => {
      const list = [rootItem]
      const { breadcrumbList } = state

      if (breadcrumbList) {
        breadcrumbList.forEach(({ name, workspaceNodeId, workspaceNodeLocation }) => {
          list.push({ name, key: `${workspaceNodeLocation}-${workspaceNodeId}` })
        })
      }
      return list
    }
  },
  mutations: {},
  actions: {}
}

export default WorkspaceNode
