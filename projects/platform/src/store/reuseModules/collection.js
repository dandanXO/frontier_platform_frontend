import NodeShareState from '@/store/reuseStates/nodeShareState.js'
import NodePublishState from '@/store/reuseStates/nodePublishState.js'
import { NODE_LOCATION, NODE_TYPE, useConstants } from '@/utils/constants'

const Collection = {
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
    childMaterialList: [],
  }),
  getters: {
    collection: (state) => state,
    nodeList: (state, getters, rootState, rootGetters) => {
      const pushCollectionToList = () => {
        if (childCollectionList.length > 0) {
          childCollectionList.forEach((collection) => {
            const {
              workspaceNodeLocation,
              workspaceNodeId,
              isPublic,
              isCanShared,
              isCanClone,
              isCanDownloadU3M,
              location,
              publicDate,
              share,
              publish,
              /** collection property */
              collectionId,
              name,
              coverImgList,
              itemCounts,
              hasChildCollection,
            } = collection
            list.push({
              workspaceNodeId,
              workspaceNodeLocation,
              nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
              nodeType: NODE_TYPE.COLLECTION,
              location,
              isPublic,
              isCanShared,
              isCanClone,
              isCanDownloadU3M,
              publicDate,
              share,
              publish,
              properties: {
                collectionId,
                name,
                coverImgList,
                itemCounts,
                hasChildCollection,
              },
            })
          })
        }
      }
      const pushMaterialToList = () => {
        if (childMaterialList.length > 0) {
          childMaterialList.forEach((material) => {
            const {
              workspaceNodeId,
              workspaceNodeLocation,
              isPublic,
              isCanShared,
              isCanClone,
              isCanDownloadU3M,
              location,
              publicDate,
              share,
              publish,
              rank,
              /** material property */
              materialId,
              materialNo,
              content,
              description,
              finish,
              width,
              weightUnit,
              weightGsm,
              weightOz,
              weightOy,
              warpDensity,
              weftDensity,
              warpYarnCount,
              weftYarnCount,
              coverImg,
              sourceAssetLocation,
            } = material
            list.push({
              workspaceNodeId,
              workspaceNodeLocation,
              nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
              nodeType: NODE_TYPE.MATERIAL,
              location,
              isPublic,
              isCanShared,
              isCanClone,
              isCanDownloadU3M,
              publicDate,
              share,
              publish,
              rank,
              properties: {
                materialId,
                materialNo,
                content,
                description,
                finish,
                width,
                weightUnit,
                weightGsm,
                weightOz,
                weightOy,
                warpDensity,
                weftDensity,
                warpYarnCount,
                weftYarnCount,
                coverImg,
                sourceAssetLocation,
              },
            })
          })
        }
      }
      const list = []
      const { childCollectionList, childMaterialList } = state
      const sortBy = rootGetters['helper/search/pagination'].sort
      const { SORT_BY } = useConstants()
      const { RELEVANCE_M_C, MATERIAL_NO_A_Z_M_C, CREATE_DATE_M_C } =
        SORT_BY.value
      const reverseList = [
        RELEVANCE_M_C.value,
        MATERIAL_NO_A_Z_M_C.value,
        CREATE_DATE_M_C.value,
      ]

      if (reverseList.includes(sortBy)) {
        pushMaterialToList()
        pushCollectionToList()
      } else {
        pushCollectionToList()
        pushMaterialToList()
      }

      return list
    },
    collectionBreadcrumbList: (state) => (rootItem) => {
      const list = []
      const { breadcrumbList } = state

      if (rootItem) {
        list.push(rootItem)
      }

      if (breadcrumbList) {
        breadcrumbList.forEach(
          ({ name, workspaceNodeId, workspaceNodeLocation }) => {
            list.push({
              name,
              nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
            })
          }
        )
      }
      return list
    },
  },
  mutations: {
    SET_collection(state, collection) {
      Object.assign(state, collection)
    },
  },
  actions: {},
}

const WorkspaceCollection = Collection

const ShareCollection = {
  state: () => ({
    ...Collection.state(),
    share: NodeShareState(),
  }),
  ...Collection,
}

const PublicCollection = {
  state: () => ({
    ...Collection.state(),
    publish: NodePublishState(),
  }),
  ...Collection,
}

export { WorkspaceCollection, ShareCollection, PublicCollection }
