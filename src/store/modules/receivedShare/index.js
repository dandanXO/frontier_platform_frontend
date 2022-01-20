import WorkspaceNode from '@/store/reuseModules/workspaceNode'
import receivedShareApi from '@/apis/receivedShare'
import { SHARING_FROM, NODE_TYPE } from '@/utils/constants'

export default {
  namespaced: true,
  modules: {
    collection: WorkspaceNode
  },
  state: () => ({
    material: {},
    breadcrumbList: [],
    share: {
      sharingId: null,
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
    materialBreadcrumbList: state => state.breadcrumbList,
    share: state => state.share,
    logo: state => state.share.logo ? state.share.logo : require('@/assets/images/logo-default.png')
  },
  mutations: {
    SET_collection (state, collection) {
      state.collection = collection
    },
    SET_material (state, material) {
      state.material = material
    },
    SET_breadcrumbList (state, breadcrumbList) {
      state.breadcrumbList = breadcrumbList
    },
    SET_share (state, share) {
      state.share = share
    }
  },
  actions: {
    setShareModule ({ commit, dispatch }, data) {
      const { workspaceCollection, material, share, pagination, breadcrumbList } = data

      !!workspaceCollection && commit('SET_collection', workspaceCollection)
      !!material && commit('SET_material', material)
      !!breadcrumbList && commit('SET_breadcrumbList', breadcrumbList)
      !!share && commit('SET_share', share)
      !!pagination && dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getShareReceivedInfo ({ dispatch }, { sharingKey }) {
      const { data } = await receivedShareApi.getShareReceivedInfo({ sharingKey })

      dispatch('setShareModule', data.result)
    },
    async getShareReceivedList ({ rootGetters, dispatch }, { targetPage = 1, sharingKey, workspaceNodeId }) {
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        sharingKey,
        workspaceNodeId,
        ...searchParams
      }

      const { data } = await receivedShareApi.getShareReceivedList(params)

      dispatch('setShareModule', data.result)
    },
    async getShareReceivedMaterial ({ dispatch }, { sharingKey, workspaceNodeId }) {
      const { data } = await receivedShareApi.getShareReceivedMaterial({ sharingKey, workspaceNodeId })
      dispatch('setShareModule', data.result)
    },
    async checkShareReceivedPermission ({ getters }, { type }) {
      const { data } = await receivedShareApi.checkShareReceivedPermission({ sharingKey: getters.share.sharingKey, type })
      const { success, result } = data

      if (success) {
        return result.allow
      }
    },
    async saveShareReceived ({ getters }, { orgId, groupId }) {
      await receivedShareApi.saveShareReceived({ sharingKey: getters.share.sharingKey, orgId, groupId })
    },
    async cloneShareReceived ({ getters }, { orgId, groupId, workspaceNodeIdList }) {
      await receivedShareApi.cloneShareReceived({ sharingKey: getters.share.sharingKey, orgId, groupId, workspaceNodeIdList })
    }
  }
}
