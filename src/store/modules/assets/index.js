import setVuexState from '@/utils/set-vuex-state'
import assetsApi from '@/apis/assets'
import { downloadBase64File } from '@/utils/fileOperator'

const state = () => ({
  materialList: [],
  addedMaterialList: []
})

const getters = {
  materialList: state => state.materialList,
  addedMaterialList: state => state.addedMaterialList,
  formalAddedMaterialList: state => state.addedMaterialList.map((item) => JSON.parse(item))
}

const mutations = {
  CLEAR_addedMaterialList (state) {
    state.addedMaterialList.length = 0
  },
  SET_addedMaterialList (state, arr) {
    /**
     * addedMaterialList 是 String 組成的陣列，其中的字串是由 JSON.stringify(object) 轉型而來
     * 比對時一定要以 string 格式比對，所以下面會判斷 arr 裡面的東西是不是字串，並且進行轉換
     * 目前有 2 種來源：assets page 裡面的 handleSelectAll（object）、inputCheckbox（string）
     */
    state.addedMaterialList = arr.map(item => {
      return typeof item === 'string' || item instanceof String ? item : JSON.stringify(item)
    })
  }
}

const actions = {
  setAssets ({ state }, data) {
    setVuexState(state, data)
  },
  async getMaterialList ({ rootGetters, dispatch }, { targetPage = 1 }) {
    const pagination = rootGetters['helper/search/pagination']
    const { perPageCount, isShowMatch, sort } = pagination
    const params = {
      pagination: {
        perPageCount: Number(perPageCount),
        isShowMatch: Boolean(isShowMatch),
        sort: Number(sort),
        targetPage: Number(targetPage)
      },
      filter: rootGetters['helper/search/filter']
    }
    const search = {
      keyword: rootGetters['helper/search/keyword'],
      selectedTagList: rootGetters['helper/search/selectedTagList']
    }

    if (!(search.keyword === '' && search.selectedTagList.length === 0)) {
      params.search = search
    }

    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.getMaterialList({ orgId: rootGetters['organization/orgId'], ...params })
      : await assetsApi.group.getMaterialList({ groupId: rootGetters['group/groupId'], ...params })

    dispatch('handleResponseData', { data }, { root: true })
  },
  async mergeMaterial ({ rootGetters, dispatch }, { mergedList }) {
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await assetsApi.org.mergeMaterial({ orgId: rootGetters['organization/orgId'], mergedList })
      : await assetsApi.group.mergeMaterial({ groupId: rootGetters['group/groupId'], mergedList })

    dispatch('handleResponseData', { data }, { root: true })
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
