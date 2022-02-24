import setVuexState from '@/utils/set-vuex-state'
import assetsApi from '@/apis/assets'
import { downloadBase64File } from '@/utils/fileOperator'
import { NODE_LOCATION, DISPLAY_NODE } from '@/utils/constants'

const state = () => ({
  displayMode: DISPLAY_NODE.LIST,
  materialList: []
})

const getters = {
  materialList: state => state.materialList,
  displayMode: state => state.displayMode
}

const mutations = {
  UPDATE_displayMode (state, mode) {
    state.displayMode = mode
  }
}

const actions = {
  setAssets ({ state }, data) {
    setVuexState(state, data)
  },
  async getMaterialList ({ rootGetters, dispatch }, { targetPage = 1 }) {
    const searchParams = rootGetters['helper/search/getSearchParams'](targetPage)

    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.getMaterialList({ orgId: rootGetters['organization/orgId'], ...searchParams })
      : await assetsApi.group.getMaterialList({ groupId: rootGetters['group/groupId'], ...searchParams })

    dispatch('handleResponseData', { data }, { root: true })
  },
  async getMaterialListForModal (_, { nodeLocation, id, keyword, targetPage = 1, sort }) {
    const params = {
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

    const { data } = NODE_LOCATION.ORG === Number(nodeLocation)
      ? await assetsApi.org.getMaterialList({ orgId: id, ...params })
      : await assetsApi.group.getMaterialList({ groupId: id, ...params })

    return data.result
  },
  async mergeMaterial ({ rootGetters, dispatch }, { mergedList }) {
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.mergeMaterial({ orgId: rootGetters['organization/orgId'], mergedList })
      : await assetsApi.group.mergeMaterial({ groupId: rootGetters['group/groupId'], mergedList })

    dispatch('handleResponseData', { data }, { root: true })
  },
  async carbonCopyMaterial ({ rootGetters }, { materialId }) {
    rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.carbonCopyMaterial({ orgId: rootGetters['organization/orgId'], materialId })
      : await assetsApi.group.carbonCopyMaterial({ groupId: rootGetters['group/groupId'], materialId })
  },
  async deleteMaterial ({ rootGetters }, { materialIdList }) {
    rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.deleteMaterial({ orgId: rootGetters['organization/orgId'], materialIdList })
      : await assetsApi.group.deleteMaterial({ groupId: rootGetters['group/groupId'], materialIdList })
  },
  async exportMaterial ({ rootGetters }, { materialIdList }) {
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.exportMaterial({ orgId: rootGetters['organization/orgId'], materialIdList })
      : await assetsApi.group.exportMaterial({ groupId: rootGetters['group/groupId'], materialIdList })

    const { extension, file, fileName } = data?.result
    downloadBase64File(file, extension, fileName)
  },
  async cloneMaterial ({ rootGetters }, { targetLocationList, materialIdList }) {
    rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.cloneMaterial({ orgId: rootGetters['organization/orgId'], targetLocationList, materialIdList })
      : await assetsApi.group.cloneMaterial({ groupId: rootGetters['group/groupId'], targetLocationList, materialIdList })
  },
  async addToWorkspace ({ rootGetters }, { targetWorkspaceNodeList, materialIdList }) {
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.addToWorkspace({ orgId: rootGetters['organization/orgId'], targetWorkspaceNodeList, materialIdList })
      : await assetsApi.group.addToWorkspace({ groupId: rootGetters['group/groupId'], targetWorkspaceNodeList, materialIdList })

    return data.result.failMaterialList
  },
  updateDisplayMode ({ commit }, mode) {
    commit('UPDATE_displayMode', mode)
  },
  async batchUpload ({ rootGetters }, { xlsxFile }) {
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.batchUpload({ orgId: rootGetters['organization/orgId'], xlsxFile })
      : await assetsApi.group.batchUpload({ groupId: rootGetters['group/groupId'], xlsxFile })

    return data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
