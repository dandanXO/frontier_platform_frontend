import WorkspaceNode from '@/store/reuseModules/workspaceNode'
import shareToMeApi from '@/apis/shareToMe'
import { SHARING_FROM, NODE_TYPE } from '@/utils/constants'

const ShareToMeWorkspaceNode = {
  state: () => ({
    ...WorkspaceNode.state(),
    share: {
      sharingId: null,
      sharingKey: null,
      sharingFrom: SHARING_FROM.WORKSPACE,
      workspaceNodeId: '',
      workspaceNodeType: NODE_TYPE.COLLECTION,
      message: '',
      logo: '',
      displayName: '',
      shareDate: null,
      isCanClone: false,
      isCanDownloadU3M: false,
      isClosed: false,
      isCanSave: false
    }
  }),
  ...WorkspaceNode
}

export default {
  namespaced: true,
  modules: {
    collection: ShareToMeWorkspaceNode
  },
  state: () => ({
    material: {},
    materialBreadcrumbList: [],
    materialShare: {
      sharingId: null,
      sharingKey: null,
      sharingFrom: SHARING_FROM.WORKSPACE,
      workspaceNodeId: '',
      workspaceNodeType: NODE_TYPE.COLLECTION,
      message: '',
      logo: '',
      displayName: '',
      shareDate: null,
      isCanClone: false,
      isCanDownloadU3M: false,
      isClosed: false,
      isCanSave: false
    }
  }),
  getters: {
    material: state => state.material,
    materialBreadcrumbList: state => state.materialBreadcrumbList,
    materialShare: state => state.materialShare,
    materialShareLogo: state => state.materialShare.logo ? state.materialShare.logo : require('@/assets/images/logo-default.png')
  },
  mutations: {
    SET_collection (state, collection) {
      state.collection = collection
    },
    SET_material (state, material) {
      state.material = material
    },
    SET_materialBreadcrumbList (state, materialBreadcrumbList) {
      state.materialBreadcrumbList = materialBreadcrumbList
    },
    SET_materialShare (state, materialShare) {
      state.materialShare = materialShare
    }
  },
  actions: {
    setShareModule ({ commit, dispatch }, data) {
      const { shareCollection, material, share, pagination, breadcrumbList } = data

      !!shareCollection && commit('SET_collection', shareCollection)
      !!material && commit('SET_material', material)
      !!breadcrumbList && commit('SET_materialBreadcrumbList', breadcrumbList)
      !!share && commit('SET_materialShare', share)
      !!pagination && dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getShareToMeList ({ rootGetters, dispatch }, { targetPage = 1, sharingId, workspaceNodeId }) {
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        sharingId,
        workspaceNodeId,
        ...searchParams
      }
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.getShareToMeList({ orgId: rootGetters['organization/orgId'], ...params })
        : await shareToMeApi.group.getShareToMeList({ groupId: rootGetters['group/groupId'], ...params })
      dispatch('setShareModule', data.result)
    },
    async getShareToMeMaterial ({ rootGetters, dispatch }, { sharingId, workspaceNodeId }) {
      const { data } = rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.getShareToMeMaterial({ orgId: rootGetters['organization/orgId'], sharingId, workspaceNodeId })
        : await shareToMeApi.group.getShareToMeMaterial({ groupId: rootGetters['group/groupId'], sharingId, workspaceNodeId })
      dispatch('setShareModule', data.result)
    },
    async cloneShareToMe ({ rootGetters }, { workspaceNodeIdList, targetLocationList }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.cloneShareToMe({ orgId: rootGetters['organization/orgId'], workspaceNodeIdList, targetLocationList })
        : await shareToMeApi.group.cloneShareToMe({ groupId: rootGetters['group/groupId'], workspaceNodeIdList, targetLocationList })
    },
    async deleteShareToMe ({ rootGetters }, { sharingIdList }) {
      rootGetters['helper/routeLocation'] === 'org'
        ? await shareToMeApi.org.deleteShareToMe({ orgId: rootGetters['organization/orgId'], sharingIdList })
        : await shareToMeApi.group.deleteShareToMe({ groupId: rootGetters['group/groupId'], sharingIdList })
    }
  }
}
