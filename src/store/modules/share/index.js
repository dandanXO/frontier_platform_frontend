import WorkspaceNode from '@/store/reuseModules/workspaceNode'
import shareApi from '@/apis/share'
import { SHARING_FROM, NODE_TYPE } from '@/utils/constants'

export default {
  namespaced: true,
  modules: {
    collection: WorkspaceNode
  },
  state: () => ({
    material: {},
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
      isClosed: false
    }
  }),
  getters: {
    share: state => state.share,
    logo: state => state.share.logo ? state.share.logo : require('@/assets/images/logo-default.png')
  },
  mutations: {
    SET_collection (state, collection) {
      state.collection = collection
    },
    SET_material (state, material) {
      state.collection = material
    },
    SET_share (state, share) {
      state.share = share
    }
  },
  actions: {
    setShareModule ({ commit, dispatch }, data) {
      const { workspaceCollection, material, share, pagination } = data

      !!workspaceCollection && commit('SET_collection', workspaceCollection)
      !!material && commit('SET_material', material)
      !!share && commit('SET_share', share)
      !!pagination && dispatch('helper/search/setPagination', pagination, { root: true })
    },
    async getShareReceivedInfo ({ dispatch }, { sharingKey }) {
      const { data } = await shareApi.getShareReceivedInfo({ sharingKey })

      dispatch('setShareModule', data.result)
    },
    async getShareReceivedList ({ rootGetters, dispatch }, { targetPage = 1, sharingKey, workspaceNodeId }) {
      const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)
      const params = {
        sharingKey,
        workspaceNodeId,
        ...searchParams
      }

      const { data } = await shareApi.getShareReceivedList(params)

      dispatch('setShareModule', data.result)
    },
    async getShareReceivedMaterial ({ dispatch }, { sharingKey, workspaceNodeId }) {
      const { data } = await shareApi.getShareReceivedMaterial({ sharingKey, workspaceNodeId })
      dispatch('setShareModule', data.result)
      return data.result
    }
  }
}
